# Content model & editorial workflow

This document describes how blog posts exist in the beligh system, the fields
every post carries, and the workflow states a post moves through from draft to
publication.

## Storage

Posts are stored as **Markdown files** in `src/content/blog/`. Each file is
validated at build time against the schema in `src/content.config.ts`.

**Why Markdown in git?**

- Versioned, reviewable, and diffable via pull requests.
- No external database or CMS dependency.
- Easy for both humans and AI-assisted tools to read and write.
- A future headless CMS or git-backed CMS (Decap, TinaCMS) can write to the same
  files without changing the schema.

## Post schema

Every post front-matter must include:

| Field         | Type     | Required | Description                                                     |
| ------------- | -------- | -------- | --------------------------------------------------------------- |
| `title`       | string   | Yes      | Post title (used for `<title>`, OG, listings).                  |
| `description` | string   | Yes      | One-sentence summary (SEO meta, RSS, listings).                 |
| `status`      | enum     | Yes      | Workflow state: `draft`, `in_review`, `published`, `scheduled`. |
| `pubDate`     | date     | Yes      | Intended/publish date.                                          |
| `updatedDate` | date     | No       | Last significant revision date.                                 |
| `author`      | string   | No       | Defaults to `beligh`.                                           |
| `heroImage`   | string   | No       | Cover image URL (relative or absolute).                         |
| `tags`        | string[] | No       | Topics/categories.                                              |

Example:

```yaml
---
title: 'My post title'
description: 'A one-sentence summary.'
status: 'published'
pubDate: 2026-07-29
author: 'beligh'
tags: ['engineering', 'seo']
---
```

## Editorial workflow

```
draft ──▶ in_review ──▶ published
            │
            └──▶ scheduled ──▶ published (auto on rebuild after pubDate)
```

| State       | Visible on public site? | How to transition                                                |
| ----------- | ----------------------- | ---------------------------------------------------------------- |
| `draft`     | No                      | Edit the file; change `status` when ready for review.            |
| `in_review` | No                      | Editor approves: change `status: 'published'`.                   |
| `scheduled` | No (until pubDate)      | Goes live automatically once `pubDate` passes and site rebuilds. |
| `published` | Yes                     | The post is built into the static site and feeds.                |

### Transition rules

- **draft → in_review**: Author marks ready; opens PR for editorial review.
- **in_review → published**: Editor approves; updates `status` and merges.
- **in_review → draft**: Revisions needed; author updates `status` back to `draft`.
- **published → draft**: Uncommon, but can be done by changing `status` (e.g. to unpublish). Requires rebuild.
- **published → scheduled**: Not a standard transition; use `updatedDate` for updates instead.

### Scheduled posts

A post with `status: 'scheduled'` is treated as **published** once its `pubDate`
is in the past. Until then, it is excluded from the build. This means:

- You can write and approve content in advance.
- The site must be rebuilt (e.g. via CI on push, or a scheduled rebuild) for the
  post to appear automatically.
- If you need precise publish timing, set up a scheduled CI trigger (e.g.
  GitHub Actions cron) to rebuild the site daily.

## Editorial calendar

The `/editorial/` page lists **all posts** in the system grouped by status. This
is the editorial dashboard: authors and editors can see drafts in progress,
posts awaiting review, upcoming scheduled posts, and what is already live.

Only `published` (and past-due `scheduled`) posts appear on the public blog
index, RSS feed, and sitemap.

## Adding a new post

1. Create a Markdown file in `src/content/blog/`, e.g. `my-post.md`.
2. Fill in the front-matter (see schema above).
3. Set `status: 'draft'` while writing.
4. Run `npm run dev` to preview locally.
5. When ready for review, change `status: 'in_review'` and open a PR.
6. After approval, merge to `main`. CI builds and deploys automatically.

## Migration path

If we later move to a headless CMS or git-backed CMS:

- The CMS can emit Markdown with the same front-matter schema.
- `src/content.config.ts` remains the validation layer.
- Workflow state can be synced bidirectionally (CMS status ↔ front-matter
  `status`) or the CMS can own the state and we read it at build time.
- No content rewrite is needed because the canonical storage format (Markdown +
  front-matter) stays the same.
