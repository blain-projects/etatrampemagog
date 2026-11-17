# Deployment architecture — project overrides (etatrampemagog)

> Companion to `deployment-architecture.md`. Kit sync never overwrites this file.
> Where this differs from the managed skill, this file wins for this project.

## Mounts

`docker-compose.yml` mounts one runtime volume: `backend_sqlite_data` at
`/app/data` on the backend service. The frontend service has no `volumes`
entry. Application source is copied into the images (`COPY` in
`frontend/Dockerfile` and `backend/Dockerfile`).

The other mount is the frontend image build. It mounts the BuildKit secret
`npm_token` for `npm install` only:

```dockerfile
RUN --mount=type=secret,id=npm_token,env=NODE_AUTH_TOKEN npm install
```

That line is in `frontend/Dockerfile`. In `docker-compose.yml` the secret is
declared under `frontend.build.secrets` and the top-level `secrets:` table
(`environment: NODE_AUTH_TOKEN`). The frontend service has no service-level
`secrets` key. Deploy-time supply of the token is in `prod-redeploy.local.md`.

## Network

Both services join the external network `web_network` (`docker-compose.yml`).
That is the shared default for this checkout.
