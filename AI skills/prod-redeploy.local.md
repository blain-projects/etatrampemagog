# Prod redeploy — project overrides (etatrampemagog)

> Companion to `prod-redeploy.md`. Kit sync never overwrites this file.
> Where this differs from the managed skill, this file wins for this project.

## Migrations do not run at container start

The managed skill states that `alembic upgrade head` runs when the backend
starts. That is **not** true here.

- `backend/Dockerfile` ends with
  `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000", "--workers", "2"]`.
- `docker-compose.yml` does not override the backend `command` or `entrypoint`.
- Alembic is present (`backend/alembic/`, `alembic` in `requirements.txt`) and
  must be run **explicitly** when a schema change needs applying
  (see `AI skills/fastapi-database-management.md`).

A `docker compose up -d --build` therefore rebuilds and recreates containers;
it does **not** apply pending Alembic revisions by itself.

## Unchanged from the managed skill

- Images still bake application code (no source bind mount); only
  `backend_sqlite_data` is mounted at `/app/data`.
- Frontend build needs `NODE_AUTH_TOKEN` in the shell environment (loaded by
  `~/.bashrc` from `~/.openclaw/secrets/npm-github.env`), **not** in the
  checkout `.env`. Compose hands it to the build as the BuildKit secret
  `npm_token` (`docker-compose.yml` → `secrets:` → `frontend/Dockerfile`).
- Rebuild / verify / review sequence in `prod-redeploy.md` still applies.
