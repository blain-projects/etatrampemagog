# OPENCLAW.md — retiré

Le guide qui était ici montrait comment appeler le conteneur `openclaw-bridge`.
Il ne faut plus le suivre.

- Le retrait est écrit dans [`AI skills/openclaw-bridge.md`](AI%20skills/openclaw-bridge.md) et [`AI skills/openclaw-agents-catalog.md`](AI%20skills/openclaw-agents-catalog.md).
- La convention générique pour joindre un agent depuis un backend est la section *Integration conventions* de [`AI skills/project-context.md`](AI%20skills/project-context.md).
- Aucun module applicatif sous `backend/` n'appelle un agent. `docker-compose.yml` ne déclare pas `extra_hosts`.

`AI skills/project-context.md` est réécrit par blain-agent-kit à chaque sync. Un fait propre à cette app irait dans `AI skills/project-context.local.md`, qui n'existe pas ici.
