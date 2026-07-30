---
title: 'On ARC-AGI-3, the harness is half the score'
description: "OpenAI's GPT-5.6 Sol triples its ARC-AGI-3 score with two API settings — a result that measures the inference harness, not just the model."
status: 'in_review'
pubDate: 2026-07-30
author: 'beligh'
category: 'ai'
tags: ['ai', 'benchmarks', 'openai', 'anthropic', 'agents', 'agi', 'evals', 'reasoning']
---

> This post is **in review**. It is excluded from the public build until an
> editor moves it to `published`. Track it on the editorial calendar
> (`npm run dev` → `/admin/calendar`).

On July 29, 2026, OpenAI published a blog post titled _How enabling two
settings tripled our scores on the ARC-AGI-3 benchmark_. The headline number
was striking: GPT-5.6 Sol hits **38.3%** on ARC-AGI-3's public set using
OpenAI's own Responses API, ahead of Anthropic's Claude Opus 5 at **30.2%**.
The story underneath is less about a smarter model and more about what a
benchmark score even means once the scaffolding around the model becomes
tunable.

## Two settings, three different scores

The two settings OpenAI turned on are mundane infrastructure, not new
weights:

- **Retained Reasoning** — keeps the model's private chain of thought
  between steps instead of wiping it after each action.
- **Compaction** — summarizes older context rather than truncating it.

Under ARC Prize's official, verified test harness, GPT-5.6 Sol at maximum
reasoning effort scores **13.33%** on the public set and **7.78%** on the
semi-private set. OpenAI's custom Responses-API setup lifts the public-set
number to 38.3% — roughly tripled. Same model. Different container.

This is the crux. ARC-AGI-3 was designed to probe "pure model performance,"
and its official harness deliberately strips provider-specific advantages:
it discards the model's reasoning after each action and rolls context over
with truncation, so every lab is measured on the same frugal footing. The
moment you let a model keep its thoughts and compact its history, the score
stops being a property of the weights and becomes a property of the
_inference harness_ the model runs inside.

## Chollet draws the line

François Chollet, ARC Prize co-founder and an author of the ARC-AGI-3
design paper, responded by drawing a boundary between two kinds of setup.
Harnesses that are "custom-made to solve the benchmark or that contain
knowledge about the benchmark" are off-limits. General-purpose API settings
that are "not developed for ARC-AGI-3 and available to all API users" are
fair game.

The concession that followed matters more than the ruling. Chollet
acknowledged a "potential parity issue" — when different providers run
under different default settings, the comparison is no longer like-for-like
— and said it is acceptable only "as long as the settings and the cost are
clearly reported." ARC Prize has had, in his words, "a lot of back and
forth with OpenAI about how to best test their models," especially around
compaction. In other words, the benchmark's own custodians are unsure where
the model ends and the harness begins.

## Two leaderboards, two different claims

ARC Prize already runs two leaderboards, and the split encodes the
problem. The **official** board holds every lab to the same system prompt,
no tools, no provider-specific harness — the closest thing to a clean
model-versus-model comparison. The **community** board accepts
harness-driven scores, which is where OpenAI's 38.3% lives. ARC Prize
warns readers not to read community-board movement as AGI progress, and at
ARC-AGI-3's release frontier models sat under 1% on the official
semi-private board. GPT-5.6 Sol is also the first model to win an ARC-AGI-3
public game outright (task `ft09`, at 87%) — a real milestone, but one
that sits on the harness-driven side of the ledger.

## Why this matters

The honest read is that ARC-AGI-3 still works as a benchmark. What it no
longer measures cleanly is _model intelligence in isolation_. The reported
number is now a product of model × harness, and the frontier of the number
has shifted to the scaffolding: how context is retained, how it is
compacted, how reasoning persists across a long agentic episode. Those are
exactly the levers a frontier lab controls and tunes.

Three things follow for anyone reading eval headlines this year:

- **Disclose the harness, not just the model.** A score without the
  settings, the API, and the per-task compute cost is an advertisement.
  Chollet's "as long as it's clearly reported" standard is the minimum.
- **Discount community-board jumps as AGI signal.** A tripled score that
  comes from keeping chain-of-thought across steps is an inference-time
  trick, not a capability the model acquired. It may be useful in
  production, but it is not the same kind of claim as a gain on the
  no-harness board.
- **Expect the harness arms race.** If memory and compaction are worth ~3x
  on a hard benchmark, every lab will tune them aggressively. Benchmark
  integrity becomes a disclosure problem, and the gap between official and
  community boards becomes the tell for how much of the score is
  scaffolding.

## What to watch

- **Whether official-board numbers move.** GPT-5.6 Sol's 13.33% / 7.78%
  under the strict harness is the figure to compare quarter over quarter.
  If that stays flat while community scores climb, the gains are harness,
  not model.
- **A compaction reporting standard.** The OpenAI/ARC Prize back-and-forth
  on compaction is the leading edge of a wider problem. If the benchmark
  community converges on a required harness disclosure, parity improves;
  if not, expect more "tripled" headlines that compare unlike setups.
- **Production reality versus benchmark reality.** Retained reasoning and
  compaction cost tokens and latency. The harness that wins a benchmark
  is not always the harness you want to ship — the cost Chollet wants
  reported is also the cost a buyer pays.

ARC-AGI-3 did not get easier. The model got more to remember, and someone
built a box that lets it remember. Until the box is part of what we
disclose, the score is half the story — and the half we hear is the half
we should trust least.

## Sources

- How enabling two settings tripled our scores on the ARC-AGI-3 benchmark —
  [OpenAI](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/)
- GPT-5.6 — ARC-AGI Results (verified scores) —
  [ARC Prize](https://arcprize.org/results/openai-gpt-5-6)
- OpenAI claims GPT-5.6 Sol beats Opus 5 on ARC-AGI-3 with its latest API
  and two additional settings — [The Decoder](https://the-decoder.com/openai-claims-gpt-5-6-sol-beats-opus-5-on-arc-agi-3-with-its-latest-api-and-two-additional-settings/)
- ARC-AGI-3: A New Challenge for Frontier Agentic Intelligence —
  [arXiv 2603.24621](https://arxiv.org/pdf/2603.24621)
- François Chollet on the harness / parity distinction —
  [Chollet on X](https://x.com/fchollet/status/2082732210436575669)
