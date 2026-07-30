---
title: 'Drafting with AI: a guarded workflow'
description: 'How we plan to use Claude to draft posts while keeping an editor in control. (Work in progress — this post is a draft.)'
status: 'draft'
pubDate: 2026-08-12
author: 'beligh'
category: 'engineering'
tags: ['ai', 'workflow']
---

> This post is a **draft**. It is excluded from the public build and does not
> appear on the live site. It is visible only on the internal editorial
> calendar (`npm run dev` → `/admin/calendar`).

We are building a small tool that turns a brief or outline into a review-ready
draft, using the Claude API. The hard rule: AI output always lands in the store
as `draft: true` and `status: draft`. Nothing the model writes is ever
auto-published.

## The shape of the loop

1. An editor writes a brief (title, audience, key points, target length).
2. The drafting tool calls Claude and writes a Markdown file into
   `src/content/blog/` with `status: draft`.
3. A human moves it to `in_review`, edits it, and only then to `published`.

This post itself will describe that loop once we have shipped it — see BEL-6.
