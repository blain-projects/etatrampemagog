# Grill Session (Alignment Interview)

> **Inherited from**: [Matt Pocock's skills](https://github.com/mattpocock/skills) — productivity/grill-me + engineering/grill-with-docs
>
> **Why**: The #1 failure mode in AI-assisted coding is misalignment. You think the agent understood. It didn't. A 5-minute grill session saves hours of rework.

## When to use

- Before starting ANY non-trivial feature
- When you have a plan/idea but haven't coded yet
- When you're not 100% sure the agent understood your intent

Trigger: say **"grill me"** or **"let's align on this first"**

## How it works

The agent interviews you relentlessly about every aspect of the plan — ONE question at a time, walking down each branch of the decision tree.

**For each question, the agent provides its recommended answer.** You just approve or correct.

### With docs (/grill-with-docs)

If `CONTEXT.md` exists, the agent will also:
- **Challenge against the glossary** — "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"
- **Sharpen fuzzy language** — "You're saying 'account' — do you mean Customer or User?"
- **Discuss concrete scenarios** — Invent edge cases that force precision
- **Cross-reference with code** — "Your code cancels entire Orders, but you just said partial cancellation is possible"
- **Update CONTEXT.md inline** — When a term is resolved, capture it immediately
- **Offer ADRs sparingly** — Only when a decision is: hard to reverse + surprising without context + the result of a real trade-off

## What makes a good grill

- **Don't skip.** The features you're most confident about need it the most.
- **Let the agent challenge you.** If it's just nodding along, it's not working.
- **One question at a time.** Don't rush to answer everything upfront.
- **Update CONTEXT.md as you go.** Terms crystallized during grilling become project vocabulary forever.

## Token economics

A grill session costs 1-3K tokens upfront. It saves 10-50K tokens in avoided rework. Always net positive for non-trivial changes.
