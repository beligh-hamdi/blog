---
title: "JetBrains open-sources KotlinLLM's smart macros"
description: 'JetBrains Research open-sourced KotlinLLM, an IntelliJ plugin whose smart macros generate Kotlin at runtime and persist it as committed, reviewable source.'
status: 'in_review'
pubDate: 2026-07-30
author: 'beligh'
category: 'dev'
tags: ['kotlin', 'developer-tools', 'ai', 'code-generation', 'jetbrains']
---

> This post is **in review**. It is excluded from the public build until an
> editor moves it to `published`. Track it on the editorial calendar
> (`npm run dev` → `/admin/calendar`).

Most "AI writes your code" tooling works the same way: you describe what you
want, a model proposes code, and you paste the result into a pull request.
The model lives outside the program, and its output enters your codebase
only when you choose to copy it in. In late July 2026, JetBrains Research
open-sourced a prototype that flips that relationship. It is called
KotlinLLM, and it treats the model as a part of the program itself — a
function call whose body is generated Kotlin, then kept as ordinary source
you commit, review, and test.

## What a smart macro actually is

KotlinLLM is an IntelliJ IDEA plugin for Kotlin/JVM projects, released
under the Apache 2.0 license. Its core idea is a language feature the team
calls a "smart macro": a regular Kotlin function call whose body is
generated Kotlin code. The behavior is not fixed before the program runs —
it evolves based on how the code is actually used at runtime — while the
call site itself stays compact and explicit.

The authors, Anastasia Birillo and Stanislav Sandler of JetBrains Research,
frame the design around three properties. It is _explicit_, so the call
site shows that a feature is LLM-backed and shows up in code review. It is
_persistent_, meaning the generated behavior is saved as ordinary Kotlin
source rather than living only in a runtime session. And it is _portable_:
once generated, the code runs as plain Kotlin with no further LLM calls and
no need for the plugin to be present.

That last point is the unobvious one. The model is a build-time and runtime
collaborator, but its output is not locked behind it. You generate, you
commit, and the artifact stands on its own.

## Two APIs, two halves of the idea

The plugin ships two main APIs, and they split the concept neatly.

The first, `asLlm<F, T>(from, hint)`, converts an input of type `F` into a
typed value `T` — a data class, an enum, a list, or a primitive. It is the
bridge for taking unstructured or semi-structured input and turning it into
typed Kotlin at runtime, with the generated parsing logic persisted as
source you can inspect.

The second, `mockLlm<T>()`, generates a stateful implementation of an
interface `T`, behaving as a test double whose responses depend on which
methods get called on it. It is a generated mock that you can read, commit,
and run against — not a magic object that changes between test runs.

Both share the same shape: the LLM fills in a body, and that body becomes
plain, reviewable Kotlin.

## The inversion: generated code you commit, not chat you paste

The interesting argument here is not "AI can write Kotlin now." It is where
the generated code ends up. In a chat workflow, the model's output is a
suggestion that survives only if a human carries it into the repo. In
KotlinLLM, the generated code _is_ the repo's source — committed, tracked,
diffable, and runnable without the model that produced it. The LLM call
becomes a kind of compiler step you opt into at a specific call site, and
its result is ordinary, type-checked Kotlin the rest of the toolchain
already understands.

That reframes the review problem. Instead of asking whether a pasted
snippet is safe, you ask it of the same kind of artifact you always review:
a committed function body, sitting at a marked call site, inside your
statically typed project. The "explicit at the call site" property matters
here — a reviewer can see _that_ a feature is model-backed before judging
_what_ it does.

The team's own evaluation hints at the trade-offs. On an adapted Spring
Petclinic Kotlin sample, 18 `asLlm` call sites completed 24 of 24 scenarios
with a 100% hot-reload success rate and roughly 1% runtime overhead. On a
GitHub "beginner issue radar" that scanned 30,000-plus issues across 20
repositories, the labeling approach reached about 0.89 recall against
ground-truth beginner labels. The numbers are prototype-scale, but the
shape — generated code that is then measured like any other code — is the
part worth watching.

## Where this sits, and where the human sits

KotlinLLM is explicitly a research prototype, not a shipping language
feature; the repo calls the plugin an experiment for "LLM-driven Smart
macros in Kotlin." But it lands in a month already crowded with moves to
make AI-assisted development more governable — agent skills in code review,
hooks and budget controls in agent runtimes, the broader turn toward
control planes over raw model capability. KotlinLLM's contribution to that
theme is narrow but distinct: push the model _inside_ the language, then
insist its output pass through the same review and type systems as
everything else.

For developers, the practical question is the one the design already
raises. If a function body is generated, committed, and portable, then the
human's job is not to write that body or to vet a chat suggestion in the
moment — it is to review the committed artifact the way they would any
other code, and to decide which call sites are worth being LLM-backed at
all. The model stops being a side-channel assistant and becomes a
collaborator whose work lives in the same place as yours.

A few questions worth asking as experiments like this mature:

- **Reviewability**: is every model-backed call site marked so a reviewer
  can see it before reading the generated body?
- **Persistence**: does the generated code stand on its own without the
  model, or does it silently depend on a live LLM?
- **Cost model**: who pays for the generation, and what happens to the
  committed artifact if the service behind it changes or disappears?

Code generation is not new. What KotlinLLM tries is making its output a
first-class, reviewable citizen of a typed codebase — and daring you to
treat the LLM's code exactly like your own.

## Sources

- KotlinLLM is Going Open Source —
  [The JetBrains Blog](https://blog.jetbrains.com/research/2026/07/kotlinllm-open-source/)
- JetBrains-Research/kotlinllm-plugin (Apache 2.0) —
  [github.com/JetBrains-Research/kotlinllm-plugin](https://github.com/JetBrains-Research/kotlinllm-plugin)
