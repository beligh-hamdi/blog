---
title: 'Agentic security testing lands this week'
description: 'OpenAI open-sourced a reasoning vulnerability scanner and PortSwigger put AI agents in Burp Suite the same week — moving humans from operator to supervisor.'
status: 'in_review'
pubDate: 2026-07-30
author: 'beligh'
category: 'ai'
tags: ['security', 'appsec', 'agents', 'developer-tools', 'penetration-testing']
---

> This post is **in review**. It is excluded from the public build until an
> editor moves it to `published`. Track it on the editorial calendar
> (`npm run dev` → `/admin/calendar`).

Two security-tooling announcements landed within days of each other in late
July 2026, and they are more interesting read together than apart. OpenAI
open-sourced a command-line scanner that reasons about access-control bugs.
PortSwigger put AI agents inside Burp Suite to run penetration tests. One
reads code to find weaknesses; the other runs attacks to prove them. The
common move is structural: the human stops operating the tool and starts
supervising the agent that does.

## A scanner that reasons about access control

On July 28, 2026, OpenAI released the Codex Security CLI and TypeScript SDK
to GitHub under the Apache 2.0 license, as the `@openai/codex-security`
package. What is open is the client — the scaffolding that runs scans, tracks
findings across runs, verifies fixes, and exports results as JSON, CSV, or
SARIF for CI pipelines. What stays closed is the reasoning engine that
actually finds the vulnerabilities, hosted behind OpenAI's service and
priced at roughly $0.018 per thousand lines scanned (about $9 for a
500,000-line codebase).

The interesting part is what it targets. The tool goes after authorization
bypasses, insecure direct object references (IDOR), and broken access
control — the class of bugs that needs a model to understand intent and
data flow, not just match patterns. OpenAI says these are exactly the bugs
that traditional static analysis tools like Semgrep, Snyk, and CodeQL
consistently miss. During its research preview, the scanner covered over 1.2
million commits and surfaced 792 critical vulnerabilities across projects
including GnuTLS, Chromium, and PHP, while claiming about 70% fewer false
positives than conventional SAST.

The open-client, closed-engine split drew sharp commentary. Mitch Ashley of
the Futurum Group called it "distribution, not openness" — you can inspect
and fork the client, but you rent the intelligence behind it. The shape is
familiar from Stripe's SDKs or the AWS CLI: the surface is yours, the
capability is a service.

## A pentester that acts under your thumb

Two days later, on July 30, 2026, PortSwigger opened the public beta of
Burp AT, which brings agentic AI into Burp Suite for professional penetration
testing. Testers delegate investigative tasks to agents that use Burp's native
tools, the project's accumulated context — traffic, target structure,
issues, prior discoveries — and a set of pentesting skills built with
PortSwigger Research.

The notable design choice is how autonomy is handled. For each task and
engagement, a pentester sets actions to be allowed, to require approval, or
to be blocked outright, and can start with tight supervision and loosen it
as performance justifies. "Smart approvals" let routine work continue while
escalating the decisions that need a human. The crucial detail is where the
rules live: scope, tool access, and approval rules are enforced in Burp's
tooling layer, architecturally separate from the model. They are not
instructions the model is expected to remember and choose to follow. Agents
can propose actions, but they cannot execute anything Burp does not permit.

Burp Suite's creator, Dafydd Stuttard, put the philosophy plainly: "Burp AT
gives the model room to reason, but Burp controls what it can actually do,
executes the work through tools pentesters already rely on, and preserves
the evidence."

## Find versus exploit — the same shift, two halves

Read side by side, the two products attack opposite ends of the security
problem with the same architectural instinct.

Codex Security works the defensive side: it reads a repository, reasons
about how data and permissions move through it, and proposes patches for a
human to review. Burp AT works the offensive side: it drives an engagement
against a live target, chains findings, and tries to reproduce weaknesses.
One asks "is this code exploitable?"; the other asks "can I actually exploit
this?" Security work has always split that way, between auditors and
testers. What is new is that both halves are now agent-shaped, and they
arrived the same week.

The deeper convergence is about control. OpenAI's answer is to open the
client and keep the engine closed — control through what the service will
and will not run. PortSwigger's answer is to let the model reason but keep
execution in the tooling layer — control through what the agent is
permitted to do. Neither trusts the model to govern itself. Both put the
binding decision somewhere the model cannot rewrite. That is the same
instinct that animated the broader move toward agent control planes this
month, now showing up concrete and vertical inside security tooling.

## Where the human sits now

For security and engineering teams, the practical shift is a change of
role. The skilled part of the job stops being the mechanical work — running
the scan, walking the attack path, formatting the finding — and becomes the
supervisory work: setting scope, calibrating autonomy, reviewing proposed
actions, and keeping the evidence trustworthy. The tooling layer has to
make that supervision real, not aspirational, or the agent is just a faster
way to make mistakes at scale.

A few questions worth asking as these tools land in real pipelines:

- **Boundary**: Is the agent's permitted scope enforced in tooling, or only
  described in a prompt?
- **Approval**: Can a human gate the actions that matter, and is routine work
  separated from the decisions that need judgment?
- **Evidence**: When an agent finds or exploits something, does the record
  hold up the way a manual finding would?

Security testing is not being automated end to end this week. But the
handoff point — where the human stops and the agent starts — clearly moved,
in two directions at once.

## Sources

- OpenAI Codex Security CLI (Apache 2.0) —
  [github.com/openai/codex-security](https://github.com/openai/codex-security)
- Introducing the Open-Source Codex Security CLI —
  [OpenAI Developer Community](https://community.openai.com/t/introducing-the-open-source-codex-security-cli/1388319)
- PortSwigger introduces Burp AT for agentic AI security testing —
  [Help Net Security](https://www.helpnetsecurity.com/2026/07/30/portswigger-burp-at/)
