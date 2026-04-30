# AI skills

This directory centralizes technical context and working rules for AI agents building on this template.

## Contents

### Methodology (use these actively)
- `domain-language.md`: shared project glossary (CONTEXT.md) — eliminates agent reinventing terms every session.
- `grill-session.md`: alignment interview before coding — the #1 defense against misunderstood intent.
- `caveman-mode.md`: ultra-compressed communication, ~75% token savings.
- `diagnose.md`: structured 6-phase debug loop — fastest path from bug to fix.

### Process & standards
- `generic-agentic-rules.md`: generic agentic engineering rules.
- `onboarding.md`: project onboarding flow — triggered automatically for fresh template projects.
- `project-context.md`: project context and core conventions.
- `development-workflow.md`: recommended implementation workflow.
- `skill-authoring-ide-agnostic.md`: skill-authoring standard + targeted `.cursor/.agent` rule strategy.

### Technical reference
- `api-endpoints.md`: existing backend endpoints and API conventions.
- `deployment-architecture.md`: Docker/Traefik architecture and deployment constraints.
- `security-modes.md`: security options (Google Auth, network protection, dev vs prod).
- `deployment-modes.md`: simple deployment mode contract (`secure` vs `public`).
- `REFERENCE_deploy.sh.md`: reference deployment orchestration script run by OpenClaw/server manager.
- `steel-signature-colors.md`: canonical Steel Signature color/token rules for frontend work.
- `fastapi-database-management.md`: FastAPI + SQLModel patterns.
- `frontend-design-system.md`: frontend design system conventions.

## Purpose

Enable agents to quickly understand:

- how to run frontend/backend locally,
- which endpoints to use and extend,
- how to align with automated deployment architecture,
- which checks are required before considering work complete,
- which security profile to apply by environment,
- which deployment tag controls Google Auth behavior,
- which server-side deployment sequence OpenClaw executes for troubleshooting.