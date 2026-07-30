#!/usr/bin/env -S npx tsx
/**
 * Content-quality CLI for beligh.
 *
 * Run this locally or in CI to catch defects before they ship:
 *
 *   npm run quality-check
 *
 * Exits with code 1 if any errors are found (warnings do not fail the build).
 */

import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import { generateReport, formatReport, type QualityPost } from '../src/lib/quality';

const BLOG_DIR = new URL('../src/content/blog/', import.meta.url);

function parseFrontMatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    // No front-matter — treat the whole file as body with empty data
    return { data: {}, body: raw };
  }
  const data = load(match[1]) ?? {};
  const body = match[2];
  return { data, body };
}

function loadPosts() {
  const entries = fs.readdirSync(BLOG_DIR, { withFileTypes: true });
  const posts: { id: string; filePath: string; data: Record<string, unknown>; body: string }[] = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (ext !== '.md' && ext !== '.mdx') continue;
    const filePath = path.join(BLOG_DIR.pathname, entry.name);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, body } = parseFrontMatter(raw);
    posts.push({
      id: entry.name.replace(ext, ''),
      filePath,
      data: data as QualityPost['data'],
      body,
    });
  }
  return posts as QualityPost[];
}

async function main() {
  const posts = loadPosts();
  const report = generateReport(posts);

  // eslint-disable-next-line no-console
  console.log(formatReport(report));

  if (report.summary.totalErrors > 0) {
    // eslint-disable-next-line no-console
    console.error(`\n❌ Failed: ${report.summary.totalErrors} error(s) found.`);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log('\n✅ Quality checks passed.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
