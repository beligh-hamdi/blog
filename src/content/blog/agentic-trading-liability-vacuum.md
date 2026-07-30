---
title: 'When your AI trader loses your money, who pays?'
description: 'Robinhood disclaims the AI agents trading your account and puts the risk on you. The SEC faces a July 31 deadline to say who is liable.'
status: 'in_review'
pubDate: 2026-07-30
author: 'beligh'
category: 'trading'
tags: ['ai', 'trading', 'regulation', 'sec', 'agents', 'finance', 'policy']
---

> This post is **in review**. It is excluded from the public build until an
> editor moves it to `published`. Track it on the editorial calendar
> (`npm run dev` → `/admin/calendar`).

An AI agent now places trades inside your brokerage account. It works while
you sleep, on markets you do not watch, using logic you did not write. If it
loses your money — or, worse, places an order a regulator later calls
manipulative — the obvious question is _whose fault is that_. The
uncomfortable answer arriving in the summer of 2026 is that nobody quite
knows, and the firms rushing the products out are writing their disclosures
to make sure it is not them.

## The product is here. The rules are not.

Agentic trading — AI agents executing trades on a retail investor's behalf,
sometimes autonomously — moved from concept to shipped feature in a few
months. Robinhood launched Agentic Trading for equities on May 27, 2026, the
same day it announced an Agentic Credit Card, with options following and
crypto agentic trading rolling out around July 1. Public brought its
"Agents" feature to market on March 31, requiring customer approval before
anything goes live. Coinbase introduced "Coinbase for Agents" on June 11.
SoFi followed in late June with "Composer" after acquiring Composer
Securities.

The platforms are not subtle about the ambition. Robinhood's CEO, Vlad
Tenev, told CNBC the goal is that "every capability a human can do will be
available to an AI agent." That is a sweeping claim, and it lands before the
securities laws have decided what an AI agent even _is_ for regulatory
purposes.

## The disclosure that does the heavy lifting

Read the fine print and the accountability question is not open — it is
pre-answered, in the broker's favor. Robinhood classifies connected agents
as third-party tools and states plainly that it does not control,
supervise, or audit them. Its disclosures say the company "does not
guarantee the accuracy, completeness, or suitability of any agent output
and is not responsible for losses resulting from agent-generated
decisions."

Where the user sits in this structure is unambiguous. The disclosures treat
the agent's trades as the user's own decisions, and the user "assume[s] all
risk for trades executed by AI agents and for any use of data by
third-party AI providers." Once customer data reaches the AI provider, it
leaves Robinhood's environment and "is governed by the provider's terms
instead." So the broker disclaims the agent, the agent's developer is
behind a separate set of terms, and the person who clicked "connect"
absorbs the downside. That is a liability design, not an accident.

## The SEC has a deadline. It is July 31.

On June 23, 2026, a group of House Financial Services Committee Democrats,
led by Reps. Bill Foster of Illinois and Brad Sherman of California, sent
Chairman Paul Atkins a letter with thirteen questions about how the
agency plans to police agentic trading. A written response was requested
by July 31, 2026. As of the last reporting in late July, that response had
not been made public.

The letter's concerns are the ones the disclosures paper over. Does
connecting a third-party agent to a brokerage account absolve the
broker-dealer of its obligations — supervision, best execution, investor
protection? Do the agents, or the firms that build them, need to register
as brokers, dealers, or investment advisers? And the one that genuinely has
no clean answer yet: when an autonomous system causes harm, who is liable?

The lawmakers left open the possibility that Congress may have to act if
existing securities laws prove insufficient — the same path crypto forced
years ago, when new products outpaced old definitions.

## The scienter problem: fraud law was written for humans

The deepest snag is not a policy preference. It is structural. A lot of
securities enforcement depends on _scienter_ — a showing that some person
acted with fraudulent intent or recklessness. As one legal analysis of the
inquiry puts it, scienter "becomes harder to analyze where no individual
formed the relevant intent." The doctrines presume a human decision-maker.
An autonomous agent that generates and withdraws orders "based on its own
logic" does not map cleanly onto a framework built around a person who
meant to do a thing.

The threshold definitional question feeds straight into this. Whether a
fully autonomous system that recommends or effects trades is providing
"investment advice" under the Investment Advisers Act is unsettled, and if
it is, "who is the adviser — the agent developer, the platform deploying
the system, or the firm licensing the tool to end users?" The likely path is
not a bright-line rule but case-by-case enforcement, which is a polite way
of saying the law will get worked out through lawsuits after the fact.

The Commodity Futures Trading Commission faces the same wall. The
anti-spoofing provision of the Commodity Exchange Act is, in the analysis,
"built around intent," and the CFTC's manipulation rules "both presuppose
a person capable of forming the requisite mental state." A December 2024
CFTC staff advisory reminded firms that existing requirements apply to AI
deployments but, notably, "did not address how the intent-dependent
elements of the spoofing and manipulation provisions map onto autonomous
systems." That gap is now live.

## Herding, and the guardrails that try to contain it

The letter flags a market-level risk that no single disclosure can solve:
herding. If many agents are trained on similar data and read similar
signals, they could independently converge on the same trades, amplifying
volatility rather than damping it. The worry is not that one agent goes
rogue; it is that thousands of reasonable agents do the same reasonable
thing at once.

The platforms have answered with friction, in different doses. Robinhood
walls agentic trading off in dedicated accounts, sends a push notification
for every trade, and lets users disconnect agents at any time. Public
requires customer approval before an agent goes live. Coinbase built
strict user-set limits on trade size and spending — described as handing
over a gift card rather than full account access. SoFi's Composer runs on
rules the customer sets and can backtest before activation. The pattern is
recognizable: keep the agent on a leash, because the legal entity on the
other end of the leash is still an open question.

## What to watch

The interesting fight is not whether AI can trade. It can. It is whether
the accountability structure catches up to the product before a large,
agent-driven loss forces it to. The analogy the legal analysis reaches for
is instructive: crypto-era litigation over whether protocol developers
were liable for what users did with their software "produced years of
litigation without a definitive answer." Agentic trading is heading for the
same terrain — contested responsibility among the developer that built the
agent, the platform that enabled it, and the user who authorized it.

A few things are worth tracking as this matures:

- **Atkins's July 31 response.** Whether the SEC answers the registration
  and liability questions or defers to enforcement will set the tone for
  every product roadmap in this space.
- **The first enforcement action.** Case-by-case regulation means the real
  rules get written when a specific agent, platform, and loss meet in a
  specific case. Watch for that test.
- **The scienter gap.** Until intent-based doctrines are adapted, the tools
  regulators have for chasing manipulation are a poor fit for autonomous
  systems. That is a question Congress may have to answer, not the SEC
  alone.

Agentic trading is selling the future of finance. The open item on the
invoice is who is holding the bag when it goes wrong.

## Sources

- House Democrats press SEC on broker-dealer and AI-developer
  responsibilities in agentic trading —
  [Orrick InfoBytes](https://infobytes.orrick.com/2026-07-10/democratic-lawmakers-press-sec-on-broker-dealer-and-ai-developer-responsibilities-in-agentic-trading/)
- House Democrats Hit SEC With 13 Questions on AI Agents Trading for Retail
  — [beINCRYPTO](https://beincrypto.com/house-democrats-sec-ai-trading-agents/)
- Is Agentic Trading Safe? What the SEC Inquiry Means for Investors —
  [Finder](https://www.finder.com/investments/is-agentic-trading-safe-sec-inquiry)
- Agents at the Gate: AI, Agentic Trading, and the Regulatory Frontier —
  [Orrick Government Enforcement Report](https://www.governmentenforcementreport.com/2026/07/agents-at-the-gate-ai-agentic-trading-and-the-regulatory-frontier/)
