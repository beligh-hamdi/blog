---
title: 'Scheduled example: a post set for future publication'
description: 'This is a sample scheduled post demonstrating the scheduled workflow state.'
status: 'scheduled'
pubDate: 2027-01-01
author: 'beligh'
tags: ['example', 'workflow']
---

This post is **scheduled** for publication on 1 January 2027. It has already been
reviewed and approved, but it will not appear on the public site until its
`pubDate` arrives.

Scheduled posts are excluded from the build if their publish date is in the
future. Once the date passes and the site is rebuilt, this post will
automatically appear as published.

This is useful for content calendars: write and approve posts in advance, then
let the build pipeline handle the rest.
