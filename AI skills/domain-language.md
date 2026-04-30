# Domain Language (CONTEXT.md)

> **Inherited from**: [Matt Pocock's skills](https://github.com/mattpocock/skills) — grill-with-docs/CONTEXT-FORMAT.md
>
> **Why**: A shared glossary between you and the agent eliminates the #1 source of wasted tokens — the agent using 20 words where 1 will do. When the agent knows "materialization cascade" means exactly one thing, it stops re-explaining concepts every session.

## Quick start

When the agent asks "what should I call this?", or you notice the agent reinventing terms, create a `CONTEXT.md` at the repo root:

```md
# {Project Name}

{One-sentence description of what this project is.}

## Language

**{Term}**:
{One-sentence definition of what it IS.}
_Avoid_: {synonyms/aliases to never use}

## Relationships

- A **{TermA}** produces one or more **{TermB}**
- A **{TermB}** belongs to exactly one **{TermC}**

## Example dialogue

> **Dev:** "When a **Customer** places an **Order**, do we create the **Invoice** immediately?"
> **Domain expert:** "No — an **Invoice** is only generated once a **Fulfillment** is confirmed."

## Flagged ambiguities

- "account" was used to mean both **Customer** and **User** — resolved: these are distinct.
```

## Rules

1. **Only project-specific terms.** General programming concepts (timeouts, error types, patterns) don't belong here.
2. **Be opinionated.** Pick ONE term per concept. List alternatives as "Avoid".
3. **One sentence max per definition.** Define what it IS, not what it does.
4. **Flag conflicts explicitly.** If a term is used ambiguously, call it out.
5. **Create lazily.** Only when you have something to write. Empty CONTEXT.md is worse than none.
6. **Don't couple to implementation.** Terms should make sense to domain experts, not just devs.

## Token impact

- Without CONTEXT.md: agent re-discovers and re-explains the same concepts every session
- With CONTEXT.md: agent reads 200-500 tokens ONCE, saves thousands over the project's lifetime
- Variable/function/file naming becomes consistent → easier navigation → fewer tokens on exploration
