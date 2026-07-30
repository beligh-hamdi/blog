---
title: 'In-review example: awaiting editorial approval'
description: 'This is a sample in-review post demonstrating the review workflow state.'
status: 'in_review'
pubDate: 2026-08-20
author: 'beligh'
tags: ['example', 'workflow']
---

This post is in **in_review** status. It has been drafted and is now awaiting
editorial approval before it can be published.

While in review, the post is excluded from the public site build. Reviewers can
read the source Markdown in the repository or preview it locally with `npm run dev`.

Once approved, update `status: 'in_review'` to `status: 'published'` and merge.
