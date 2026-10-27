# Shared Liquid UI

This frontend uses the published `@blain-projects/ui` 2.1.2 package, installed from the canonical GitHub Packages URL in its lockfile (`frontend/package.json` range `^2.1.2`).

`bootstrapTheme()` initializes the current system theme on every load (`frontend/src/main.tsx`). Shared `useTheme()` and `ThemeToggle` (via `BrandThemeToggle`) allow a manual choice for the current visit and follow system changes without persisted theme preferences. The status page is composed with kit `AppShell` and `SiteFooter` (`frontend/src/App.tsx`): brand and actions sit in the shell header; the footer receives project identity from `frontend/src/project.ts` (including `repoUrl`), plus `version` / commit build defines from `frontend/build-meta.ts`. Show-off mode defaults on for this public app; `VITE_BLAIN_SHOWOFF=true|false` overrides when set at build time. The kit reserves the header band itself (since ui 2.1.1 `.bui-main` starts below the header blur); `frontend/src/brand-integration.css` keeps `--bui-footer-offset` clearance and dense popup styling; it does not re-define shell chrome. Reduced-motion preferences disable decorative animation.

UI primitives come from `@blain-projects/ui` (imported by `App.tsx`). The thin modules under `frontend/src/components/ui/` re-export kit `Button` and `Input` only; there is no local `card` module.

Private package authentication is reused from the existing npm configuration; credentials never belong in source control. The frontend image build receives `NODE_AUTH_TOKEN` as the BuildKit secret `npm_token` (`docker-compose.yml` → `frontend/Dockerfile`), exposed as an env var for the `npm install` step only. It is never a build arg, so it stays out of BuildKit's history and cache; `scripts/check-build-secrets.sh` enforces that.
