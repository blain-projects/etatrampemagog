# Automated Deployment Architecture

> Generic architecture shared by every app built from the template. A project
> that departs from it (another network, an extra service) documents the
> difference in `AI skills/deployment-architecture.local.md`, which the kit
> sync never touches. If that file exists, read it too: where it differs from
> this one, it wins. Changing a project's network is an infra change: it needs
> `/approve` first (`.cursor/rules/10-security.mdc`).

## Overview

- Traefik is the entry point (routing + automatic TLS).
- Frontend is served by Nginx.
- FastAPI backend runs behind Uvicorn.
- By default, all app services connect to Docker network `web_network`.

## Server orchestration (OpenClaw)

- OpenClaw/server manager uses a reference deployment script: `REFERENCE_deploy.sh.md`.
- This script defines the standard server flow:
  - clone/pull repository depending on project existence,
  - create/verify Docker network `web_network`,
  - create/update `.env` (`PROJECT_NAME`, `DOMAIN_NAME`),
  - run `docker compose up -d --build`.
- For deployment debugging, treat this file as the orchestration source of truth.

## Images bake application code

- Frontend and backend Dockerfiles `COPY` source into the image at build time
  (`frontend/Dockerfile`, `backend/Dockerfile`). Compose mounts only the named
  volume `backend_sqlite_data` at `/app/data` — there is no source bind mount.
- Editing, committing, or pushing therefore does not change the live site until
  images are rebuilt and containers recreated from the prod checkout.
- After a prod change that must be reviewed live, follow `prod-redeploy.md`
  (`docker compose up -d --build`, then verify the change is served) before
  asking for review.

## Target domains

- Public frontend: `https://<project>.blain-projects.ca`
- Public API: `https://api.<project>.blain-projects.ca`

## Development implications

- New features must preserve frontend/API separation.
- Internal services should call backend via `http://backend:5000`.
- External clients (browser/mobile/partners) must use public API domain.

## Common risks

- Hardcoded local URLs in production.
- Persistent data written into ephemeral containers without volumes.
- Unhandled API timeouts.
- Proxy/CORS changes that break cross-subdomain behavior.

## Recommended guardrails

- Parameterize URLs via environment variables.
- Validate exposed routes after each infra change.
- Keep a health endpoint and monitor it post-deploy.
- Apply the correct security profile (`security-modes.md`).
