# Content model & editorial workflow

This is the canonical reference for how a blog post exists in beligh. Authors,
the public site, SEO tooling, and the AI drafting tool (BEL-6) all share this
one representation.

- **Storage:** Markdown + front-matter, version-controlled in this repo
  (`src/content/blog/`). See `docs/decisions/0001-stack-choice.md` for the
  stack rationale and `docs/decisions/0002-content-model.md` for the
  content-model decision. A migration path to a headless / git-backed CMS is
  documented below.
- **Schema:** `src/content.config.ts` (Zod). The schema is the editorial
  contract — invalid front-matter fails the build.
- **Workflow:** `src/lib/workflow.ts` (transition model + invariants).
- **Calendar:** internal, dev-only view at `/editorial`
  (`src/pages/editorial.astro`).

## Post schema

Every post is a `*.md`/`*.mdx` file in `src/content/blog/` with this front-matter:

| Field          | Type     | Required              | Notes                                                                           |
| -------------- | -------- | --------------------- | ------------------------------------------------------------------------------- |
| `title`        | string   | yes                   | Page `<title>`, H1, OG headline.                                                |
| `description`  | string   | yes                   | Doubles as the meta description **and** the listing excerpt. Keep ≤ ~155 chars. |
| `status`       | enum     | yes (default `draft`) | `draft` \| `in_review` \| `published` \| `scheduled`.                           |
| `pubDate`      | date     | yes                   | Publish date (coerced from `YYYY-MM-DD`).                                       |
| `updatedDate`  | date     | no                    | Last meaningful revision; feeds `dateModified` in structured data.              |
| `author`       | string   | no (default `beligh`) | Author name; feeds Article `author`.                                            |
| `slug`         | string   | no                    | Explicit URL slug. Defaults to the file name (`post.id`).                       |
| `category`     | string   | no                    | One primary category. `tags` carries the rest of the taxonomy.                  |
| `heroImage`    | string   | no                    | Cover image (path under `/public` or absolute URL).                             |
| `canonicalURL` | URL      | no                    | Overrides the generated canonical URL (for cross-posted content).               |
| `tags`         | string[] | no (default `[]`)     | Free-form tags; each gets a `/blog/tag/<tag>/` archive.                         |
| `draft`        | boolean  | no (default `false`)  | Hard block: exclude from the public build entirely, independent of `status`.    |

The post **body** is the Markdown below the front-matter.

Example:

```yaml
---
title: 'My post title'
description: 'A one-sentence summary.'
status: 'published'
pubDate: 2026-07-29
author: 'beligh'
category: 'engineering'
tags: ['engineering', 'seo']
---
```

## Editorial workflow

```
draft ──▶ in_review ──▶ published
                   │       ▲
                   └─▶ scheduled ─┘   (promote to published once pubDate passes)
```

| State       | Visible on public site? | Meaning                                                                        |
| ----------- | ----------------------- | ------------------------------------------------------------------------------ |
| `draft`     | No                      | Work in progress. Visible on the editorial calendar only.                      |
| `in_review` | No                      | Ready for an editor; excluded from the public build.                           |
| `scheduled` | No (until pubDate)      | Approved with a future `pubDate`. Promote to `published` once the date passes. |
| `published` | Yes                     | Live on the public site, RSS feed, and sitemap.                                |

### What is enforced where

- **Machine-checked invariants** (build-time, in `src/content.config.ts` via
  Zod `superRefine`; mirrored in `workflowViolations()` in `src/lib/workflow.ts`
  so the editorial calendar can report the same issues):
  - A `published` post cannot be dated in the future — use `scheduled`.
  - A `scheduled` post must be dated in the future — promote to `published`
    once it passes.
  - Violating either fails `astro check`, `astro build`, and CI.
- **Human-checked transitions** (`draft` → `in_review` → `published`): enforced
  by **pull-request review**. The allowed-transition table lives in
  `src/lib/workflow.ts` (`ALLOWED_TRANSITIONS`, `canTransition`) and is available
  to tooling — e.g. the AI drafting tool (BEL-6) must never auto-publish.
- **No auto-publish path exists.** Publication always requires a human to set
  `status: published` (or `scheduled`) and merge through review. `filterPublished`
  in `src/lib/posts.ts` is the single gate that decides what the public site
  renders; drafts and `in_review` posts are never in it.

### Scheduled posts

A `scheduled` post has a future `pubDate` and is excluded from the build. Once
the date passes, **promote it to `published`** and rebuild — the build-time
invariant will reject a `scheduled` post whose date has passed, so it cannot
silently sit in the pipeline. To automate promotion, add a scheduled CI trigger
(e.g. a GitHub Actions cron) that flips due `scheduled` posts to `published`
and rebuilds; that automation is out of scope for the content model itself.

## Editorial calendar

Run the dev server and open the internal calendar:

```bash
npm run dev
# open http://localhost:4321/editorial
```

The calendar lists **every** post grouped by status and sorted by publish date,
flags machine-checkable workflow violations, and calls out `scheduled` posts
that are due to be promoted to `published`. It renders an **inert stub in a
production build**, so drafts and review posts never ship to `dist/`. The route
is also excluded from the sitemap and `robots.txt` (`Disallow: /editorial`).

## Adding a new post

1. Create a Markdown file in `src/content/blog/`, e.g. `my-post.md`.
2. Fill in the front-matter (see schema above).
3. Set `status: 'draft'` while writing.
4. Run `npm run dev` to preview locally (view it on `/editorial`).
5. When ready for review, change `status: 'in_review'` and open a PR.
6. After approval, set `status: 'published'` (or `'scheduled'` with a future
   date) and merge to `main`. CI builds and deploys automatically.

## Storage choice & migration path

**v1 (now):** Markdown + front-matter in git. Zero database, fully versioned,
reviewable through PRs. A non-engineer adds a post by dropping a Markdown file
in `src/content/blog/`.

If non-technical editors later need a GUI, in increasing order of disruption:

1. **Git-backed CMS** (Decap CMS / TinaCMS) — a web editor that commits Markdown
   to this same repo. The content model and schema are unchanged; only the
   authoring UI changes. Lowest cost.
2. **Headless CMS** (Sanity / Contentful) — move the store out of git. Keep the
   Zod schema as the contract; swap the Astro `glob` loader for the CMS loader.
   Requires a data export step and an API key, but the public-site code stays
   the same.
3. **Database + admin** — only if editorial workflow outgrows a CMS (custom
   scheduling, roles, audit). Not justified at current scale.

In all cases the schema in `src/content.config.ts` is the stable contract; only
the _loader_ changes.
