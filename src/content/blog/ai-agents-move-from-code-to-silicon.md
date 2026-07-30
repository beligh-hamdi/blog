---
title: 'AI agents move from code to silicon'
description: "NVIDIA's Agent Toolkit turns the generate-test-reflect agent loop on chip design, and the EDA incumbents graft agents onto their own tools."
status: 'in_review'
pubDate: 2026-07-30
author: 'beligh'
category: 'ai'
tags: ['ai', 'agents', 'nvidia', 'semiconductors', 'eda', 'engineering', 'hardware']
---

> This post is **in review**. It is excluded from the public build until an
> editor moves it to `published`. Track it on the editorial calendar
> (`npm run dev` → `/admin/calendar`).

The agent story of 2026 has mostly played out in text and code: an agent
plans, acts on a tool, reads the result, and tries again. That loop is now
crossing a more expensive boundary. On July 26, 2026, at the Design
Automation Conference, NVIDIA expanded its _Agent Toolkit_ with physics
and simulation libraries aimed at one job — letting autonomous agents help
design chips. The interesting part is not the speedup headlines. It is
that the same _generate-test-reflect_ architecture that writes software is
being grafted onto the tools that draw silicon.

## What NVIDIA actually shipped

The expansion re-architects NVIDIA's _PhysicsNeMo_ libraries into
agent-callable skills, so a model can train and run physics simulations as
tools rather than as background math. Alongside it, three CUDA-X libraries
were added or refreshed:

- _cuISS_ — iterative sparse solvers for the large linear systems behind
  physics and engineering simulation.
- _cuDSS_ — direct sparse solvers aimed at electronic design automation
  (EDA) and scientific simulation, scaling to multi-GPU and multi-node.
- _cuEST_ — electronic structure theory for quantum chemistry, including
  density functional theory and post-DFT methods, at device-relevant
  scales.

The framing is deliberate: these are not just faster math kernels. They
are packaged as _skills_ an agent can invoke, the same way a coding agent
invokes a shell or a test runner.

## The agent loop, now in Verilog

The headline model is _Nemotron 3 Ultra_, a 550B-total / 55B-active
Mixture-of-Experts Hybrid Mamba-Attention model with a 1M-token context,
pretrained on 20 trillion tokens. On its own, a model is just a model.
The telling piece is the agent around it: _ACE-RTL_, from NVIDIA Research,
which runs an iterative generate-test-reflect workflow — a generator that
writes or updates register-transfer level (RTL) code, a reflector that
reads simulation feedback and pins down root causes, and a coordinator
that carries debugging context across iterations.

On the Comprehensive Verilog Design Problems (CVDP) benchmark, ACE-RTL
with Nemotron 3 Ultra hits a 97.1% average pass rate across nine agentic
RTL task categories, ahead of Kimi K2.6 at 95.2% and GLM 5.2 at 92.1%. On
one debugging task it climbs from 65.7% standalone to 100% with the
agent. It also burns far fewer tokens per iteration — about 6,629 versus
22,579 for Kimi K2.6, roughly 71% fewer — which matters when each
iteration spins up a real simulation. NVIDIA claims up to 5x throughput
and 30% lower cost against other open models.

This is the part worth pausing on. The win is not "the model is smarter."
Plenty of frontier models are smart. The win is that the loop closes:
generate code, compile, simulate, read the failure, reflect, repeat. RTL
design is a long cycle of exactly that, and an agent that can hold the
debugging thread across iterations compresses the part of chip design
that eats the calendar.

## The incumbents invite the agents in

NVIDIA did not ship this into a vacuum. The EDA oligopoly lined up to host
the agents inside its own walls, which is the more revealing signal.

- **Cadence** wired Nemotron, accelerated computing, and CUDA-X into its
  AuraStack AI Super Agent and Millennium M2000 platform, claiming up to
  20x faster multiphysics performance, and is optimizing its Jasper
  formal-verification tool for NVIDIA's Vera CPU.
- **Synopsys** built its _AgentEngineer_ on NIM microservices, Nemotron,
  the NeMo Gym library, and NemoClaw blueprints, and is folding in Ansys
  Icepak for autonomous simulation setup.
- **Siemens** put agents into its Fuse EDA AI Agent and Questa One
  verification toolkit, reporting more than 10x faster library
  characterization while cutting token costs by over 10x.
- **Samsung** uses cuLitho for up to 20x faster computational lithography
  and PhysicsNeMo for chip-scale thermal-stress analysis across domains of
  up to 10 billion cells; **Keysight** uses cuDSS for up to 10x faster
  electromagnetic simulation; **Silvaco** ran a 3.2-billion-mesh-node
  photonic coupler simulation in under four hours on 32 GPUs.

The pattern is uniform: the specialized-software vendors are not being
disintermediated by agents. They are racing to _embed_ the agents, so the
agent becomes the new front door to their expensive, hard-to-replace
tools. Samsung, Synopsys, and TSMC together integrating cuEST for up to a
50x quantum-chemistry speedup is the same logic — own the agent surface,
keep the moat.

## The real story

Strip the numbers and the shape is familiar. The agent loop that reshaped
coding — plan, act, observe, reflect — is colonizing physical
engineering, where each "action" is a real simulation with real compute
cost. NVIDIA's Timothy Costa, who runs computational engineering, named
the inflection plainly: "Engineering has reached an inflection point. AI
can now work with tools of physics, simulation and design," and with the
toolkit "developers can build agentic engineers that reason using physics,
run complex simulations and generate high-fidelity data."

Two things follow. First, the bottleneck in chip design is shifting from
_raw compute capacity_ to the _design-and-verification loop_, and agents
that close that loop attack the calendar, not just the runtime. Second,
the incumbents are not waiting to be replaced — they are grafting agents
onto their own stacks, which suggests agents become the new interface to
specialized software, not a substitute for it. The competitive question
moves from "whose model is best" to "whose harness wraps the most
expensive tools."

## What to watch

- **Whether the pass rates hold outside benchmarks.** CVDP is a
  controlled suite; production RTL is messier, with constraints, timing
  closure, and legacy IP. The 97.1% is a floor claim, not a field claim.
- **The agent-as-interface business model.** If Cadence and Synopsys own
  the agent surface, model makers compete to be the brain inside someone
  else's harness — a different margin structure than selling a model
  directly.
- **Verification, not generation, as the hard part.** Writing RTL that
  compiles is the easy 20%; proving it is correct under a constraint graph
  is the expensive 80%. The agents that eat the verification loop, not the
  drafting loop, are the ones that move the calendar.

The agents have left the editor. Now they are learning to draw silicon —
and the companies that already owned the drawing tools are making sure the
agents ask permission first.

## Sources

- NVIDIA Expands NVIDIA Agent Toolkit With NVIDIA PhysicsNeMo and CUDA-X
  Libraries — [NVIDIA Newsroom](https://nvidianews.nvidia.com/news/nvidia-expands-nvidia-agent-toolkit-with-nvidia-physicsnemo-and-cuda-x-libraries-to-transform-how-the-world-engineers-designs-and-builds)
- NVIDIA Nemotron 3 Ultra Leads Open Models on Accuracy and Efficiency in
  Agentic RTL Coding — [NVIDIA Developer Blog](https://developer.nvidia.com/blog/nvidia-nemotron-3-ultra-leads-open-models-on-accuracy-and-efficiency-in-agentic-rtl-coding/)
- NVIDIA expands Agent Toolkit for AI-driven chip engineering —
  [eeNews Europe](https://www.eenewseurope.com/en/nvidia-expands-agent-toolkit-for-ai-driven-chip-engineering/)
