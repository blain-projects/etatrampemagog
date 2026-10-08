# Frontend Design System (`@blain-projects/ui` + Tailwind v4)

This document governs creation and modification of UI in this app.

## Stack

- **`@blain-projects/ui` 1.7.2** — Liquid original theme (`theme.css`), shared chrome (`Header`, `ThemeToggle`), and primitives (`Button`, `Card`, `Badge`, …). See `frontend/BRAND-INTEGRATION.md`.
- **Tailwind CSS v4** — consumed through the kit theme import in `frontend/src/index.css`. Do not re-import `tailwindcss` there, and do not bring back a `tailwind.config.ts`.
- **App adapters** — `frontend/src/brand-integration.css` reserves measured header/footer offsets and styles dense popups; it does not re-define floating header chrome.

## Implementation standards

When adding or changing UI:

1. **Import from the kit** — use `@blain-projects/ui` (as `App.tsx` does). Do not invent local Button/Card/Input implementations.
2. **Compatibility shims only** — `frontend/src/components/ui/button.tsx` and `input.tsx` re-export the kit. Prefer direct kit imports for new code. Do not restore a local `card` module.
3. **Tokens** — style with `--bui-*` from the kit theme. App-only FlowGauge colors live in `frontend/src/index.css`; do not redefine the kit theme.
4. **Theme** — light/dark via kit `bootstrapTheme` / `ThemeToggle`. Never hard-code page backgrounds; use kit surfaces (`--bui-bg`, `--bui-surface`, …).
5. **Mobile-first** — keep the status layout readable at 375px; preserve ramp status vocabulary, refresh behaviour, and municipal source links.

## Where to look

- `frontend/BRAND-INTEGRATION.md` — package version, floating header, theme contract.
- `docs/ui-uniformity-2026-10-08.md` — dated note for the 2026-10-08 uniformity pass.
- `frontend/src/App.tsx` — live composition of Header, theme toggle, Card, and status content.
