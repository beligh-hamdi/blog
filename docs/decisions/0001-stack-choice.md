# ADR 0001 — Content stack: Astro + Markdown, static output

- **Status:** Accepted
- **Date:** 2026-07-29
- **Deciders:** Founding Engineer (BEL-2)

## Context

beligh's business is publishing high-quality blog content at scale. The platform
needs: a clean, versionable content model with draft/review/published states; a
fast, SEO-friendly public site; a build/deploy path a non-engineer can trigger
safely; and headroom for AI-assisted drafting tooling later. The team is small,
so the stack must favor boring, maintainable technology over novelty.

## Decision

Build the public blog on **[Astro](https://astro.build) 5** with content authored
as **Markdown/MDX** in a typed **content collection**, output as a **static site**,
and deployed to a static host (**GitHub Pages** by default; Cloudflare Pages /
Netlify documented as drop-in alternatives).

## Options considered

| Option                           | SEO / perf                                                                               | Content ergonomics                                                            | Complexity for a small team                             | Verdict                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Astro (static)**               | Excellent — zero JS by default, static HTML, first-party sitemap/RSS                     | Markdown/MDX + schema-validated front-matter                                  | Low                                                     | **Chosen**                                                                    |
| Next.js                          | Great, but SSR/ISR and a React runtime add moving parts we don't need for a content site | MDX works, more wiring                                                        | Medium/High                                             | Rejected — heavier than needed                                                |
| Hugo / Eleventy                  | Excellent perf                                                                           | Templating is capable but less component-friendly; MDX/JS integrations weaker | Low/Medium                                              | Rejected — Astro gives the same perf with a nicer authoring + component story |
| Headless CMS (Contentful/Sanity) | Fine                                                                                     | Nice editor UI                                                                | Adds a paid external dependency + API before we need it | Deferred — revisit if non-technical editors need a GUI                        |

## Rationale

- **SEO-first by default.** Static HTML, semantic markup, and first-party
  integrations for `sitemap.xml` and RSS. Article structured data (JSON-LD),
  canonical URLs, and OpenGraph/Twitter tags are wired into a shared `BaseHead`.
- **Fast Core Web Vitals.** Astro ships no client JavaScript unless a page opts
  in, which keeps content pages lightweight.
- **Clean content model.** Posts are Markdown with front-matter validated by a
  Zod schema (`src/content.config.ts`). `draft: true` is the first slice of the
  editorial workflow (drafts are excluded from build/listings).
- **Maintainable.** One framework, one language, a small dependency surface; a
  non-engineer can add a post by dropping in a Markdown file.
- **AI-ready.** Future AI-assisted drafting tools can emit Markdown into
  `src/content/blog/` as drafts for human review — no auto-publish.

## Consequences

- Content lives in git (versioned, reviewable via PRs). No database yet.
- If/when non-technical editors need a GUI, revisit a git-backed CMS
  (e.g. Decap/TinaCMS) or a headless CMS — the content model already fits.
- Dynamic features (search, comments) would need an island or an external
  service; acceptable given current scope.
