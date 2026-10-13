# AI skills

This directory centralizes technical context and working rules for AI agents building on this template.

## Project-specific companions (`*.local.md`)

- The skills synced from blain-agent-kit (version in `blain-agent-kit.json`) are overwritten on every sync: never write project-specific facts in them.
- Project-specific facts go to a companion `<skill>.local.md` next to the skill, e.g. `project-context.local.md`, `deployment-architecture.local.md`. The sync never touches `*.local.md`.
- When a companion exists, read it with its skill: where they differ, the companion wins for this project.

## Contents

### Spec-Driven Development (session start — MANDATORY)
- `.specify/constitution.md`: project governing principles — agents VALIDATE, not just read.
- `.specify/templates/spec-template.md`: feature specification blueprint.
- `.specify/templates/checklist-template.md`: per-feature validation checklist.
- `scripts/validate-deploy-ready.sh`: automated network/build pre-deployment checks.

### Methodology (use these actively)
- `domain-language.md`: shared project glossary (CONTEXT.md) — eliminates agent reinventing terms every session.
- `grill-session.md`: alignment interview before coding — the #1 defense against misunderstood intent.
- `caveman-mode.md`: ultra-compressed communication, ~75% token savings.
- `diagnose.md`: structured 6-phase debug loop — fastest path from bug to fix.

### Process & standards
- `generic-agentic-rules.md`: generic agentic engineering rules.
- `blain-ui-governance.md`: réflexe UI proactif — détecter qu'une modif visuelle touche un primitif `@blain-projects/ui` (composant importé, classe `bui-*`, token `--bui-*`), la corriger DANS le package (jamais en local), puis bump SemVer + CHANGELOG + publish + propagation `npm update` aux consommateurs `^1.x` + redeploy + validation `vite build` réel.
- `onboarding.md`: project onboarding flow — gated by the `ONBOARDING.md` sentinel at the repo root. Plan → Questions → Fill → `scripts/finalize-onboarding.sh` (which deletes the sentinel). Mandatory first-run for any fresh project.
- `project-context.md`: project context and core conventions (+ `project-context.local.md` for this project, if present).
- `development-workflow.md`: recommended implementation workflow.
- `skill-authoring-ide-agnostic.md`: skill-authoring standard + targeted `.cursor/.agent` rule strategy.

### Technical reference
- `api-endpoints.md`: existing backend endpoints and API conventions.
- `openclaw-bridge.md`: intégration OpenClaw Agent Bridge — comment connecter ton backend aux agents IA.
- `openclaw-agents-catalog.md`: liste des 13 agents OpenClaw disponibles avec leurs `id` et spécialités.
- `ecosystem-services.md`: services partagés sur `web_network` (n8n, openclaw-mcp, nextcloud, etc.).
- `deployment-architecture.md`: Docker/Traefik architecture and deployment constraints (+ `deployment-architecture.local.md` for a project exception, if present).
- `security-modes.md`: security options (Google Auth, network protection, dev vs prod).
- `deployment-modes.md`: simple deployment mode contract (`secure` vs `public`).
- `prod-redeploy.md`: rebuild + redéploiement après une modif en prod — le code est cuit dans l'image, donc rien n'est live (ni reviewable) avant `docker compose up -d --build` + vérification.
- `REFERENCE_deploy.sh.md`: reference deployment orchestration script run by OpenClaw/server manager.
- `steel-signature-colors.md`: Liquid / `--bui-*` token rules (Steel Signature baseline removed; points at `@blain-projects/ui`).
- `fastapi-database-management.md`: FastAPI + SQLModel patterns.
- `frontend-design-system.md`: frontend conventions for `@blain-projects/ui` (Liquid) — not local Shadcn.
- `responsive-ui.md`: responsive UI acceptance — required viewport, theme and secondary-route checks for every fork.

## Purpose

Enable agents to quickly understand:

- how to run frontend/backend locally,
- which endpoints to use and extend,
- how to align with automated deployment architecture,
- which checks are required before considering work complete,
- which security profile to apply by environment,
- which deployment tag controls Google Auth behavior,
- which server-side deployment sequence OpenClaw executes for troubleshooting.
