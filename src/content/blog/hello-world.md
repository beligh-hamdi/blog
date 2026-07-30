---
title: 'Hello, world'
description: 'The first post on the beligh blog — and a tour of the publishing pipeline that got it here.'
status: 'published'
pubDate: 2026-07-29
author: 'beligh'
tags: ['announcement', 'engineering']
---

Welcome to the **beligh** blog. This is the first post published through our new
content pipeline.

## How this page got here

1. A Markdown file lives in `src/content/blog/`.
2. Its front-matter is validated against a schema (title, description, dates, tags).
3. `astro build` renders it to static HTML, generates a sitemap and RSS feed, and
   emits SEO metadata (canonical URL, OpenGraph, Article structured data).
4. CI builds every push; the deploy step ships the static `dist/` to our host.

No client-side JavaScript is shipped for a post like this, which keeps pages fast
and Core Web Vitals healthy.

## What's next

Draft/review states, an editorial calendar, and AI-assisted drafting tooling all
build on top of this foundation.
