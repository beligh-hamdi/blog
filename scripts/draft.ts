#!/usr/bin/env -S npx tsx
/**
 * AI-assisted drafting tool for beligh.
 *
 * Reads a brief from stdin or a file, calls the Claude API, and writes a
 * Markdown draft into src/content/blog/. The output is always marked
 * `status: 'draft'` — never auto-published.
 *
 * Usage:
 *   npm run draft -- --brief "A post about..."
 *   npm run draft -- --file brief.txt --out "my-post.md"
 *   npm run draft -- --mode edit --file src/content/blog/my-post.md
 */

import fs from 'node:fs';
import path from 'node:path';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const BLOG_DIR = new URL('../src/content/blog/', import.meta.url);

/** Supported modes. */
type DraftMode = 'outline' | 'edit' | 'seo';

interface Args {
  mode: DraftMode;
  brief?: string;
  file?: string;
  out?: string;
  model: string;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  let mode: DraftMode = 'outline';
  let brief: string | undefined;
  let file: string | undefined;
  let out: string | undefined;
  let model = 'claude-opus-4-8';

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--mode':
        mode = args[++i] as DraftMode;
        break;
      case '--brief':
        brief = args[++i];
        break;
      case '--file':
        file = args[++i];
        break;
      case '--out':
        out = args[++i];
        break;
      case '--model':
        model = args[++i];
        break;
    }
  }
  return { mode, brief, file, out, model };
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const SYSTEM_PROMPT = `You are a senior content editor for beligh, a blog that publishes high-quality content at scale.
Your task is to produce Markdown blog posts with front-matter.
Rules:
- Output ONLY the Markdown file content (front-matter + body). No extra commentary.
- Front-matter must include: title, description, status: 'draft', pubDate, author, tags.
- Write in a clear, authoritative, engaging voice.
- Use semantic Markdown: one H1 (#), then H2s (##) and H3s (###) as needed.
- Include a short intro and a strong conclusion.
- If the brief mentions a target length, aim for it; otherwise write ~600-1200 words.`;

const TEMPLATES: Record<
  DraftMode,
  (brief: string, context?: string) => { system: string; user: string }
> = {
  outline: (brief) => ({
    system: SYSTEM_PROMPT,
    user: `Turn this brief into a full blog post draft.\n\nBrief:\n${brief}`,
  }),
  edit: (brief, context) => ({
    system:
      SYSTEM_PROMPT +
      '\n\nYour task is to EDIT and TIGHTEN the existing draft. Keep the structure but improve clarity, flow, and punchiness. Output the full revised Markdown.',
    user: `Existing draft:\n${context}\n\nEditorial direction:\n${brief}`,
  }),
  seo: (brief, context) => ({
    system: `You are an SEO specialist. Given a blog post draft, suggest:
1. An improved title (under 60 characters)
2. A meta description (under 155 characters)
3. 3-5 relevant tags
Output ONLY as YAML front-matter fields:
title: '...'
description: '...'
tags: ['...']`,
    user: `Draft:\n${context}\n\nAdditional direction:\n${brief}`,
  }),
};

async function callClaude(args: { model: string; system: string; user: string }) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set. Export it as an environment variable.');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: args.model,
      max_tokens: 4096,
      system: args.system,
      messages: [{ role: 'user', content: args.user }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Claude API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text: string }[];
    usage: { input_tokens: number; output_tokens: number };
    model: string;
  };

  const text = data.content.find((c) => c.type === 'text')?.text ?? '';
  return { text, usage: data.usage, model: data.model };
}

function logCost(usage: { input_tokens: number; output_tokens: number }, model: string) {
  // Approximate pricing (USD per million tokens) — update as models/price change.
  const pricing: Record<string, { input: number; output: number }> = {
    'claude-opus-4-8': { input: 15.0, output: 75.0 },
    'claude-haiku-4-5-20251001': { input: 0.8, output: 4.0 },
  };
  const rate = pricing[model] ?? { input: 15.0, output: 75.0 };
  const inputCost = (usage.input_tokens / 1_000_000) * rate.input;
  const outputCost = (usage.output_tokens / 1_000_000) * rate.output;
  const total = inputCost + outputCost;
  // eslint-disable-next-line no-console
  console.log(`Tokens: ${usage.input_tokens} in / ${usage.output_tokens} out`);
  // eslint-disable-next-line no-console
  console.log(`Estimated cost: $${total.toFixed(4)} (${model})`);
}

async function main() {
  const args = parseArgs();

  let briefText = args.brief ?? '';
  let existingDraft = '';

  if (args.file) {
    const raw = fs.readFileSync(args.file, 'utf-8');
    if (args.mode === 'edit' || args.mode === 'seo') {
      existingDraft = raw;
      briefText = briefText || 'Improve this draft.';
    } else {
      briefText = raw;
    }
  }

  if (!briefText) {
    // eslint-disable-next-line no-console
    console.error(
      'Usage: npm run draft -- --brief "..." [--mode outline|edit|seo] [--out file.md] [--model MODEL]',
    );
    process.exit(1);
  }

  const template = TEMPLATES[args.mode];
  const { system, user } = template(briefText, existingDraft);

  // eslint-disable-next-line no-console
  console.log('Calling Claude API...');
  const result = await callClaude({ model: args.model, system, user });
  logCost(result.usage, result.model);

  let outputText = result.text.trim();

  // If Claude wrapped the markdown in ```markdown ... ```, unwrap it.
  const codeBlock = outputText.match(/^```markdown\n([\s\S]*?)\n```$/);
  if (codeBlock) {
    outputText = codeBlock[1];
  }

  // Ensure status: draft
  if (!outputText.includes("status: 'draft'")) {
    outputText = outputText.replace(/^---\n/, `---\nstatus: 'draft'\n`);
  }

  // Derive output filename
  let outPath: string;
  if (args.out) {
    outPath = path.resolve(BLOG_DIR.pathname, args.out);
  } else {
    const titleMatch = outputText.match(/^title:\s*['"]?([^'"\n]+)['"]?/m);
    const title = titleMatch?.[1]?.trim() ?? 'untitled';
    outPath = path.resolve(BLOG_DIR.pathname, `${generateSlug(title)}.md`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, outputText, 'utf-8');

  // eslint-disable-next-line no-console
  console.log(`\nDraft saved to: ${path.relative(process.cwd(), outPath)}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
