---
title: 'Web frameworks in 2026: server-rendered and agent-ready'
description: 'Topcoat, Remix 3, and Guren all shipped in July 2026. Their shared bet: server rendering, web standards, and AI agents as a design constraint.'
status: 'in_review'
pubDate: 2026-07-30
author: 'beligh'
category: 'dev'
tags: ['web', 'frameworks', 'rust', 'react', 'ai', 'tooling']
---

> This post is **in review**. It is excluded from the public build until an
> editor moves it to `published`. Track it on the editorial calendar
> (`npm run dev` → `/admin/calendar`).

July 2026 produced an unusually tight cluster of full-stack web framework
releases across three language ecosystems: Topcoat in Rust, Remix 3 in
JavaScript, and Guren 1.0 in TypeScript-on-Bun. Read alone, each looks like a
local experiment. Read together, they describe a single bet about where web
development is going — **server rendering, web-platform primitives, and AI
agents as a first-class design constraint**.

## Three releases, one direction

**Topcoat** shipped on July 22, 2026. Built by Carl Lerche and Julien Scholz
under the Tokio team, it is a "modular, batteries-included Rust framework for
building full-stack, reactive web apps" that is "entirely server-rendered." The
notable choice is how it handles reactivity: instead of compiling Rust to
WebAssembly the way Leptos or Dioxus do, Topcoat renders markup on the server
and adds "reactive instructions" as metadata — an idea in the spirit of HTMX.
A subset of type-checked Rust is cross-compiled to JavaScript through a macro,
so interactivity stays in Rust without dragging a WASM payload to the client.
It is designed to sit alongside Toasty (a Rust ORM, ready since April 2026) and
Axum (the lower-level HTTP router from the same organization).

**Remix 3**, in beta through July, is a ground-up rebuild that **drops React as
its runtime** in favor of web-platform primitives. Routes use the Fetch API and
return standard web `Response` objects; forms submit to URLs and the server
owns the request lifecycle. The frontend keeps JSX but runs on a forked Preact
with an imperative update model. New primitives like "frames" (server-rendered
fragments with a `src`) and "unbundling" (the runtime as the source of truth
rather than a bundler) push state back toward the server. Reception is split —
supporters call it "the Grug Brain version of what Next.js should have been,"
while critics argue it is unrecognizable from Remix 2. Existing Remix 2 apps
are being pointed at React Router v7.

**Guren 1.0**, released July 18, is a Laravel-inspired full-stack TypeScript
framework on the Bun runtime, reaching stable after 34 release candidates. It
pairs Hono for HTTP, Drizzle for the ORM, and Inertia plus React on the
frontend. The signal here is less the stack and more the defaults: CSRF
protection and security headers are on by default, mass-assignment is locked
down, and the CLI ships tooling built for AI coding agents —
`bunx guren context / check / audit / codegen`, with `CLAUDE.md` and
`.claude/rules/` scaffolded into new apps to cut agent cost.

## What the three share

Strip away the languages and a common shape appears:

- **Server rendering as the default.** All three push rendering and state back
  to the server and reach for the client only for genuine interactivity.
  Topcoat does it with reactive HTML snippets; Remix 3 with frames and the
  server-owned request lifecycle; Guren with Inertia bridging server render to
  a thin React shell. The heavy client-side SPA is no longer the assumed
  starting point.
- **Web standards over framework magic.** Remix 3 is the clearest case —
  Fetch API, web `Response`, URL-based forms — but the instinct is shared: lean
  on the platform, then add narrowly. Topcoat's "locality of behavior"
  principle and Guren's convention-over-configuration point the same way.
- **Agents in the architecture, not bolted on.** Guren ships agent tooling and
  agent-readable rule files. Remix 3's backers argue its simpler, more
  deterministic model is easier for AI coding tools to reason about. Topcoat's
  locality-of-behavior keeps logic where an agent can read it in one place.
  None of these treat "works well with AI agents" as an afterthought.

## The take

A framework wave this coordinated is usually telling you something about the
era's constraint, not just its taste. The last cycle optimized for rich client
applications and the build tooling to ship them. This one is optimizing for
something different: runtimes that are cheap to operate at the edge, models
that are cheap for an agent to edit, and a client surface that does not require
a megabyte of JavaScript to render a form.

That does not mean React is going away — Guren still uses it, and Remix 3 keeps
JSX. It means React is being demoted from the runtime that owns your app to a
library you reach for when server rendering is not enough. The center of
gravity is moving back to the server and the platform, and the frameworks that
shipped this month are betting that is where agents want to work too.

For teams picking a stack right now, the practical read is: watch whether the
"unbundle and server-render" pattern consolidates, or whether it fragments the
way the last SPA cycle did. The early signal — three independent teams in three
languages converging on the same shape in the same month — is that this time it
might stick.

## Sources

- [Announcing Topcoat — Tokio](https://tokio.rs/blog/2026-07-22-announcing-topcoat)
- [Remix 3 Beta Preview Ditches React for a Web-Standards Full-Stack Framework — InfoQ](https://www.infoq.com/news/2026/07/remix-3-beta-preview/)
- [Guren 1.0.0 release — GitHub](https://github.com/gurenjs/guren/releases/tag/v1.0.0)
