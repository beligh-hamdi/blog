---
title: 'MCP goes stateless: what the 2026-07-28 spec changes'
description: "The Model Context Protocol's fifth release moves to a stateless core, adds Apps and Tasks, and hardens OAuth. Here's what builders should know."
status: 'in_review'
pubDate: 2026-07-30
author: 'beligh'
category: 'dev'
tags: ['mcp', 'ai', 'tooling', 'agents']
---

> This post is **in review**. It is excluded from the public build until an
> editor moves it to `published`. Track it on the editorial calendar
> (`npm run dev` → `/admin/calendar`).

The Model Context Protocol — the spec for wiring AI models to tools and data
sources — shipped its fifth release on July 28, 2026, and the headline change
is structural: **MCP's core is now stateless**.

## From a stateful protocol to request/response

Until now MCP was a bidirectional, stateful protocol. That made sense for
long-lived sessions between a client and a server, but it made servers hard
to run on commodity infrastructure. You could not just drop an MCP server
behind a typical serverless function or edge runtime the way you can a plain
HTTP endpoint.

The 2026-07-28 release moves MCP to a request/response model. The practical
upshot, per Anthropic's announcement, is that MCP servers can now deploy on
**serverless and edge infrastructure**, which removes one of the bigger
friction points for anyone building a connector at scale.

Adoption is not the open question anymore. MCP now sees more than 400 million
monthly SDK downloads — a roughly 4x increase over the year — and Claude's
connectors directory lists over 950 MCP servers.

## Two new extensions: Apps and Tasks

The release also formalizes two capabilities under a new, versioned
extensions framework:

- **MCP Apps** let a server render interactive UI directly inside the
  conversation, so a user can see and act on connector activity inline rather
  than bouncing out to another tab.
- **Tasks** give servers a formal mechanism for long-running work without
  changing the core protocol — useful for anything that takes more than a
  single round-trip to complete.

Together they let server authors add capability without waiting on the core
spec to change, and they keep the core itself small. That is the right
instinct: a thin stateless core plus opt-in extensions ages better than a
monolith.

## Auth finally gets serious

The third change is the one enterprises will actually feel. Authorization now
aligns with production **OAuth 2.0 and OpenID Connect** deployments, so MCP
servers can plug into identity systems like Entra ID or Okta without the
workarounds the earlier protocol required. If you have been holding off on
MCP for corporate-grade auth reasons, this is the release that removes the
excuse.

## Why it matters for builders

A few takeaways for anyone shipping agent tooling today:

- **Stateless means cheaper and more boring to operate.** Edge and serverless
  deployment changes the unit economics of running a connector; you no longer
  need a sticky process per session.
- **MCP is consolidating as the standard.** GitHub shipped Copilot code
  review with MCP support on the same week, and the spec's own download
  numbers suggest the ecosystem is not fragmenting. Betting on MCP is no
  longer an early-adopter bet.
- **Extensions over core.** Apps and Tasks signal the project's direction:
  keep the core minimal, push capability into versioned extensions. If you
  are building a server, reach for extensions rather than assuming the core
  will absorb your feature.

The full release notes are on Anthropic's blog; the spec is the source of
truth for implementers.

## Sources

- [Bringing the MCP 2026-07-28 spec to Claude — Anthropic](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude)
- [Copilot code review: agent skills and MCP now generally available — GitHub Changelog](https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/)
