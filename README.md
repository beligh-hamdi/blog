# beligh — Content for Blogs

The public blog site and publishing pipeline for **beligh**. High-quality blog
content, published at scale on a fast, SEO-friendly static stack.

## Stack

- **[Astro](https://astro.build) 5** — static site generator, zero JS by default.
- **Markdown/MDX** posts in a typed **content collection** (`src/content.config.ts`),
  with a `draft` flag as the first slice of the editorial workflow.
- **SEO built in** — semantic HTML, canonical URLs, OpenGraph/Twitter tags,
  Article JSON-LD, `sitemap.xml`, and an RSS feed.

Full rationale and alternatives considered: [`docs/decisions/0001-stack-choice.md`](docs/decisions/0001-stack-choice.md).

## Quick start

Requires Node.js ≥ 18.20 (Node 20 recommended; see `.nvmrc`).

```bash
npm install      # install dependencies
npm run dev      # run the site locally at http://localhost:4321
```

That's the one command to develop locally: **`npm run dev`**.

## Commands

| Command           | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Start the local dev server at `localhost:4321`            |
| `npm run build`   | Build the static site to `dist/`                          |
| `npm run preview` | Preview the production build locally                      |
| `npm run lint`    | Prettier format check + `astro check` (types/diagnostics) |
| `npm run format`  | Auto-format with Prettier                                 |

## Writing a post

Add a Markdown file under `src/content/blog/`, e.g. `my-post.md`:

```markdown
---
title: 'My post title'
description: 'One-sentence summary used for SEO and listings.'
pubDate: 2026-07-29
tags: ['category']
# draft: true   # uncomment to keep it out of the build until reviewed
---

Your content here…
```

The front-matter is validated against the schema in `src/content.config.ts`;
a build fails fast if a required field is missing. Its file name becomes the URL
slug (`/blog/my-post/`).

## Project layout

```
src/
  components/   BaseHead (SEO), Header
  content/blog/ Markdown posts (the content store)
  layouts/      BaseLayout, BlogPost
  pages/        index, about, blog/, rss.xml.js
  styles/       global.css
public/         favicon, robots.txt (static assets copied as-is)
docs/           decisions/ (ADRs), deploy.md
.github/workflows/  ci.yml (build+lint), deploy.yml (GitHub Pages)
```

## CI & deploy

- **CI** (`.github/workflows/ci.yml`) runs lint + build on every push and PR to `main`.
- **Deploy** — static output to a static host. Default target and step-by-step
  setup: [`docs/deploy.md`](docs/deploy.md).

## Configuration

Copy `.env.example` to `.env` for local overrides. Key vars:

- `SITE_URL` — canonical production origin (used for sitemap/RSS/canonical/OG).
- `BASE_PATH` — sub-path for project-style hosting (default `/`).

**Never commit secrets.** API keys (e.g. the Claude API key for future
AI-drafting tooling) are read from environment variables only.

## License

[MIT](LICENSE) © beligh
