---
title: "Best AI trader? Two July 2026 studies can't agree"
description: 'HKU and the University of Florida both ranked LLM traders in July 2026 — and put DeepSeek first and last. What the split says about AI in markets.'
status: 'in_review'
pubDate: 2026-07-30
author: 'beligh'
category: 'trading'
tags: ['ai', 'trading', 'llm', 'finance', 'markets', 'research']
---

> This post is **in review**. It is excluded from the public build until an
> editor moves it to `published`. Track it on the editorial calendar
> (`npm run dev` → `/admin/calendar`).

If you want to know which large language model makes the best trader, July
2026 gave you two answers. They disagree, and the disagreement is more
informative than either result.

In the same week the press filled with stories about frontier models winning
reasoning and coding benchmarks, two academic groups published live-trading
evaluations of LLMs in financial markets. One concluded DeepSeek was _by far_
the best trader it had tested. The other concluded DeepSeek was the worst of
ten. Both are serious work. Both came out in July 2026. Reconciling them is
the actual lesson.

## Two studies, two verdicts

**The University of Florida study** comes from Alejandro Lopez-Lira, a finance
professor who has been running AI chatbots as stock traders since 2023.
Reported by _Business Insider_ on July 25, 2026, his roughly three-year
track record puts **DeepSeek as "by far the best trader"** — up about 73% since
launch and 35% year-to-date, ahead of ChatGPT (about 78% since launch but only
16% YTD) and Grok (about 54% since inception, 19% YTD). Each model is fed firm
news, fundamentals, and recent data, but the final buy/sell call is the
model's alone. Notably, the models agree on the same trade only about half
the time.

**The HKU study** comes from the Artificial Intelligence Evaluation Lab (AIEL)
at the University of Hong Kong's business school, led by Professor Jack Jiang.
Starting in April 2026 it ran ten LLMs as live foreign-exchange traders with
identical US$100,000 starting capital, trading major pairs plus the S&P index
and precious metals. In the six weeks covered by its July 14, 2026 release,
the spread ran from **Qwen3.5 Plus at about +9.9%** to **DeepSeek V3.2 at
-15.1%** — the largest loss in the field. GPT-5.4 came out roughly break-even;
Claude Opus 4.6 and MiniMax posted "more substantial losses."

So: DeepSeek first in one study, DeepSeek dead last in the other.

## Why the split is not a contradiction you can dismiss

It is tempting to call this apples-to-oranges and move on. It is partly that
— and the differences matter, because they map the failure modes of "which AI
trades best" as a question:

- **Different markets.** UF trades US equities from news and fundamentals; HKU
  trades FX, an inherently shorter-horizon, more macro-driven arena. A model
  good at reading an earnings release is not necessarily good at reading a
  currency order book.
- **Different horizons.** UF covers roughly three years; HKU covers six weeks.
  Six weeks is explicit in HKU's own caveat that its results "should not be
  interpreted as a definitive measure of long-term investment capability." A
  ranking that flips inside six weeks is a feature of the market, not a bug
  of the test.
- **Different versions.** UF's "DeepSeek" is the consumer chatbot run as a
  stock picker; HKU's is DeepSeek V3.2 wired into an agentic trading loop.
  These are not quite the same artifact, which is exactly why "DeepSeek
  trades well" is not a stable claim — it depends on _which_ DeepSeek, doing
  _what_, in _which_ market.

Strip those caveats away and the headline "DeepSeek is the best trader" and
"DeepSeek is the worst trader" stop cancelling out. They combine into a
narrower, sturdier finding: **LLM trading rankings are setting-dependent, and
setting changes them a lot.**

## The finding both studies share

This is the part that should outlast the DeepSeek horse race. HKU states it
directly:

> "Models that excel in tasks such as reasoning, knowledge question
> answering, or code generation do not necessarily achieve the best
> performance in real financial markets."

HKU's own numbers back that up in two ways that cut against intuition:

- **More trading did not mean better returns.** DeepSeek V3.2, Claude Opus
  4.6, and Gemini 3.1 Pro each executed more than 1,000 trades; Grok-4.1 Fast
  made only about 200. The high-frequency traders were the biggest losers,
  while the moderate traders (Qwen, Kimi, Seed, at 500–800 trades) led the
  field. As the release puts it, "the quality of decisions may matter more
  than the quantity."
- **More risk did not mean better returns.** DeepSeek and Gemini ran high
  leverage and ate large drawdowns; Kimi managed risk carefully and still
  ranked among the strongest. "Taking more risk did not necessarily lead to
  better performance."

UF's data points the same direction from the other side: models that
process information similarly still disagree on the trade half the time.
Predictive skill in a benchmark does not transfer cleanly to a position.

## What this means for anyone using an LLM in markets

For beligh's readers — developers and traders building on these models — the
practical reads are:

- **Don't pick a trading model from a leaderboard.** A model's rank on
  reasoning or coding evals tells you little about its live-market P&L. The
  HKU result is the cleanest demonstration yet that the two are decoupled.
- **Beware activity as a signal.** The most "agentic" model — the one that
  trades most often — was the worst performer in HKU's run. A loop that fires
  on every tick is a cost and risk generator, not an edge. Cap frequency and
  size positions deliberately.
- **Treat any single ranking as a six-week snapshot.** Both studies are short
  relative to a market cycle. A model that looks best this month can be last
  next month, and vice versa. The UF and HKU DeepSeek results appearing in
  the same month is the proof.
- **Match the model to the market, then re-test.** The right model for
  equity news trading is not the right model for FX execution, and the right
  one today may not be right next quarter. This is an empirical, ongoing
  question, not a one-time procurement decision.

## The takeaway

The honest version of "which AI is the best trader" is not a model name. It is
a process: pick the market, run the model live with real capital constraints,
watch drawdowns and trade frequency, and re-evaluate often. July 2026's two
studies are useful precisely because they refuse to agree. A single
ranking would have been comforting. Two contradictory ones are closer to the
truth: in live markets, the model that wins the benchmark is not the model
that wins the trade, and the model that wins the trade this month may lose it
next.

## Sources

- [AI Agents' Trading Performance — HKU Business School press release (July 14, 2026)](https://www.hku.hk/press/press-releases/detail/29241.html)
- [Which AI model is the best stock trader? A finance professor says he's got the answer — Business Insider (July 25, 2026)](https://www.businessinsider.com/best-ai-for-trading-stocks-deepseek-claude-chatgpt-grok-2026-7)
