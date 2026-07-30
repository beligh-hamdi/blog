---
title: 'Why we build on Astro'
description: 'The reasoning behind our content stack: fast, SEO-first, and maintainable by a small team.'
pubDate: 2026-07-29
author: 'beligh'
tags: ['engineering', 'seo']
---

We chose [Astro](https://astro.build) as the foundation for the beligh blog. Here
is the short version of why.

- **Content-first.** Posts are Markdown/MDX with a validated front-matter schema.
- **SEO by default.** Static HTML, semantic markup, sitemap, RSS, and Article
  structured data ship out of the box.
- **Fast.** Zero JavaScript is sent to the browser unless a page explicitly needs
  it, which is great for Core Web Vitals.
- **Maintainable.** A small team can reason about the whole stack.

The full rationale and the alternatives we weighed are recorded in
`docs/decisions/0001-stack-choice.md`.
