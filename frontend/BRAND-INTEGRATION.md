# Shared Liquid UI

This frontend uses the published `@blain-projects/ui` 1.7.2 package, installed from the canonical GitHub Packages URL in its lockfile. Liquid original is the default. A highlighted surface can opt into `appearance="drawn"`; ordinary controls and tables keep the original material.

`bootstrapTheme()` initializes the current system theme on every load. Shared `useTheme()` and `ThemeToggle` allow a manual choice for the current visit and follow system changes without persisted theme preferences. The status page uses the kit floating `Header`; `brand-shell` clears content with `--bui-header-offset` / `--bui-footer-offset`. A footer may be hidden on mobile when it reduces usable space. Existing app actions stay in the header. Reduced-motion preferences disable decorative animation.

UI primitives come from `@blain-projects/ui` (imported by `App.tsx`). The thin modules under `frontend/src/components/ui/` re-export kit `Button` and `Input` only; there is no local `card` module.

Shared `Modal` and `Dialog` retain their controlled subtree for the 200 ms fade-out: keep the component mounted and update its `open` prop. Local business data must remain available throughout the exit.

Private package authentication is reused from the existing npm configuration; credentials never belong in source control. The legacy frontend Dockerfiles accept this configuration as the BuildKit secret `npmrc`, configured by Compose from `${HOME}/.npmrc`.
