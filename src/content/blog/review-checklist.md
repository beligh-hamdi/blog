---
title: 'Pre-publish review checklist'
description: 'The checklist every post passes before it moves from in_review to published. (Awaiting review.)'
status: 'in_review'
pubDate: 2026-08-05
author: 'beligh'
category: 'process'
tags: ['process', 'quality', 'seo']
---

> This post is **in review**. It is excluded from the public build until an
> editor moves it to `published`. Track it on the editorial calendar
> (`npm run dev` → `/admin/calendar`).

Before any post flips from `in_review` to `published`, it passes this checklist.

- [ ] Title is clear and under ~60 characters.
- [ ] Description doubles as the meta description (under ~155 characters).
- [ ] Headings are semantic and in order (one H1, then H2/H3).
- [ ] Every image has descriptive alt text.
- [ ] Internal links resolve; external links are valid.
- [ ] Canonical URL is correct (or omitted to use the generated one).
- [ ] Structured data validates in a Rich Results test.
- [ ] The post appears on the editorial calendar under the right state.

This checklist is the human half of our workflow enforcement; the machine half
lives in `src/lib/workflow.ts` and the schema invariants in
`src/content.config.ts`.
