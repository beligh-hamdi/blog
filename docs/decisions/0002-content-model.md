# ADR 0002 — Content model: typed Markdown collection + review-gated workflow

- **Status:** Accepted
- **Date:** 2026-07-29
- **Deciders:** Chief of staff (BEL-3), Founding Engineer

## Context

BEL-3 must define how a blog post exists in the system so authors, the public
site, and tooling (SEO, analytics, AI drafting) share one representation. The
stack is already fixed (ADR 0001: Astro + Markdown, static output). The content
model needs: a post schema (title, slug, body, excerpt, author, tags/categories,
cover image, canonical URL, SEO fields, timestamps), workflow states
(`draft` → `in_review` → `published` + `scheduled`) with enforced transitions,
an editorial calendar (list/filter by state and date), and a storage choice with
a migration path. The hard constraint: **drafts must never leak to the live
site**, and **there is no auto-publish path** — AI-drafted content always lands
as a draft for human review (BEL-6).

## Decision

Represent every post as **Markdown + front-matter in a typed Astro content
collection** (`src/content/blog/`, schema in `src/content.config.ts`). Model the
editorial workflow as a `status` front-matter field with four states and enforce
it in two layers:

1. **Machine-checked invariants** at build time via a Zod `superRefine`:
   `published` cannot be future-dated, `scheduled` must be future-dated. These
   run in `astro check`, `astro build`, and CI.
2. **Human-checked transitions** via pull-request review. The allowed-transition
   table (`ALLOWED_TRANSITIONS`, `canTransition`) lives in `src/lib/workflow.ts`
   for tooling to consult; it is not a runtime gate because publication is a
   git/PR act, not a server action.

The public site renders only what `filterPublished` (`src/lib/posts.ts`) returns
— `published` posts and past-due `scheduled` posts — so drafts and `in_review`
posts are structurally excluded from the build. The editorial calendar
(`/editorial`) is a **development-only** route (inert stub in production) so the
internal view of drafts never ships to `dist/`, and it is excluded from the
sitemap and `robots.txt`.

## Options considered

| Option                                                  | Schema rigor               | Workflow enforcement              | Draft-leak risk                                 | Verdict                                                               |
| ------------------------------------------------------- | -------------------------- | --------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------- |
| **Typed collection + status field + dev-only calendar** | Zod-validated front-matter | Build-time invariants + PR review | None (filterPublished gate + dev-only calendar) | **Chosen**                                                            |
| Astro `draft: true` flag only                           | None beyond a boolean      | None                              | Medium (easy to forget)                         | Rejected — too weak; no review/scheduled states                       |
| Headless CMS owns state                                 | CMS-defined                | CMS-gated                         | Low                                             | Rejected for v1 — adds a paid dependency before we need it (ADR 0001) |
| DB-backed posts                                         | Full                       | Full                              | Low                                             | Rejected — disproportionate for a static content site                 |

## Consequences

- Content is versioned, reviewable via PRs, and readable/writable by humans and
  AI tooling alike.
- The schema in `src/content.config.ts` is the stable contract; the loader is
  the only thing that changes if we later adopt a git-backed or headless CMS.
- Promotion of `scheduled` → `published` after the date passes is a manual (or
  CI-cron-automated) step; the build invariant prevents stale `scheduled` posts
  from lingering.
- The editorial calendar is internal only; a public-facing tag/category archive
  (`/blog/tag/<tag>/`) is the public discovery surface (BEL-4).
