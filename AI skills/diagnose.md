# Diagnose (Structured Debug Loop)

> **Inherited from**: [Matt Pocock's skills](https://github.com/mattpocock/skills) — engineering/diagnose/SKILL.md
>
> **Why**: Unstructured debugging wastes tokens on "try random things and see". This 6-phase loop is the fastest path from bug to fix.

Trigger: say **"diagnose this"** or **"debug this"** or describe a bug.

## Phase 1 — Build a feedback loop ⭐

**This is the whole skill.** Spend 70%+ effort here. If you have a fast, deterministic, agent-runnable pass/fail signal, you WILL find the cause.

Construct one, in roughly this order:
1. **Failing test** at whatever seam reaches the bug
2. **Curl/HTTP script** against a running dev server
3. **CLI invocation** with fixture input, diffing output
4. **Browser script** (Playwright) driving UI, asserting on DOM/console
5. **Replay trace** — save a real payload, replay through code in isolation
6. **Throwaway harness** — minimal subset of system exercising the bug path
7. **Property/fuzz loop** — 1000 random inputs, find the failure mode
8. **Bisection harness** — automate `git bisect run`
9. **Differential loop** — run same input through old vs new version
10. **HITL bash script** — last resort, drive a human through structured steps

Then iterate: make it faster, make the signal sharper, make it more deterministic.

**If you genuinely cannot build a loop**, stop. Say so explicitly. List what you tried. Ask the user for access, a captured artifact, or permission for temporary instrumentation. Do NOT proceed to hypothesize without a loop.

## Phase 2 — Reproduce

Run the loop. Confirm:
- [ ] The failure matches what the USER described (not a different nearby failure)
- [ ] Reproducible across multiple runs
- [ ] You captured the exact symptom (error message, wrong output, timing)

## Phase 3 — Hypothesize

Generate **3–5 ranked hypotheses** before testing any. Each must be falsifiable:

> "If <X> is the cause, then changing <Y> will make the bug disappear / changing <Z> will make it worse."

Show the ranked list to the user before testing — they often re-rank instantly with domain knowledge.

## Phase 4 — Instrument

One variable at a time. Map each probe to a specific hypothesis from Phase 3.
- **Debugger/REPL** > targeted logs > "log everything and grep"
- Tag debug logs with unique prefix: `[DEBUG-a4f2]`. Cleanup = one grep.
- For perf regressions: establish baseline measurement FIRST, then bisect.

## Phase 5 — Fix + regression test

Write the regression test BEFORE the fix — but only if there's a correct seam.
- **Correct seam** = test exercises the real bug pattern as it occurs at the call site
- If no correct seam exists, that IS the finding. Note it — architecture is preventing the bug from being locked down.

## Phase 6 — Cleanup + post-mortem

- [ ] Original repro no longer reproduces
- [ ] Regression test passes (or absence of seam documented)
- [ ] All debug instrumentation removed (grep `[DEBUG-`)
- [ ] Correct hypothesis stated in commit message

**Then ask**: what would have prevented this bug? If architectural change needed → recommend it.
