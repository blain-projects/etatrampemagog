# OPENCLAW.md — Communication avec les Agents OpenClaw

> **TL;DR :** Pour parler à un agent OpenClaw depuis ton backend Docker, fais un POST vers
> `http://openclaw-bridge:8000/api/internal/v1/agents/{agent}/send`
> avec le header `X-Bridge-Token`. C'est tout. Le reste de ce document explique pourquoi
> cette architecture existe, comment la mettre en place, et comment la réutiliser dans
> n'importe quel nouveau projet.

---

## Architecture de Communication

```
┌──────────────────────────────────────────────────────────────────┐
│                        TON PROJET (Docker)                        │
│  Backend FastAPI / Express / etc.                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │ POST /api/internal/v1/agents/{agent}/send
                               │ Header: X-Bridge-Token: <token>
                               │ Body: { "prompt": "...", "timeout_seconds": 120 }
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                  OpenClaw Agent Bridge (Docker)                    │
│              openclaw-relay.blain-projects.ca                      │
│                                                                    │
│  • Endpoint public:   /api/v1/agents/{agent}/send                 │
│    → Google Auth + token (usage humain ou externe)                │
│  • Endpoint interne:  /api/internal/v1/agents/{agent}/send        │
│    → Token seul, accessible UNIQUEMENT depuis web_network         │
│                                                                    │
│  Container: openclaw-bridge (port 8000 interne)                   │
└──────────────────────────────┬───────────────────────────────────┘
                               │ POST /api/send { prompt, agent }
                               │ via host-gateway:18790
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│               OpenClaw Relay Helper (Host - Systemd)              │
│                      Port 18790 (local)                           │
│                                                                    │
│  Service: openclaw-relay-helper.service                           │
│  Script:  /home/blain/openclaw-relay-helper.py                    │
│                                                                    │
│  Exécute: openclaw agent --agent <id> --message "..." --json      │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                   OpenClaw Gateway (Host)                         │
│                  Port 18789 (WebSocket)                           │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                     Agent OpenClaw (ex: fishey)                    │
│              Réponse structurée → remontée en JSON                │
└──────────────────────────────────────────────────────────────────┘
```

## 🔑 Pourquoi cette architecture ?

| Problème rencontré | Solution dans cette architecture |
|-------------------|----------------------------------|
| Le CLI `openclaw` ne fonctionne pas dans Docker (manque `dist/entry.js`, dépend du gateway local) | **Relay Helper** sur l'host, qui wrap le vrai CLI |
| Google Auth bloque les appels machine-à-machine | **Endpoint interne** `/api/internal/...` sans Google Auth, accessible uniquement depuis `web_network` |
| Chaque nouveau projet doit réinventer la communication agent | Le **Bridge** est un service permanent : une seule implémentation pour tous les projets |
| Sécurité des appels entre conteneurs | Token partagé (`X-Bridge-Token`) + isolation réseau (Docker `web_network`) |

## 🚀 Utilisation dans un nouveau projet

### 1. Prérequis (déjà déployés sur le serveur)

- ✅ **OpenClaw Agent Bridge** : `openclaw-bridge` (Docker, réseau `web_network`)
- ✅ **OpenClaw Relay Helper** : `openclaw-relay-helper.service` (systemd, port 18790)
- ✅ **Token** : variable d'environnement `OPENCLAW_BRIDGE_TOKEN` (secret, jamais en clair dans le repo)

> Ces services sont **déjà en place** sur `serveur-blain`. Tu n'as rien à installer.
> Module transport complet et tests : [`AI skills/openclaw-bridge.md`](AI%20skills/openclaw-bridge.md).

### 2. Code d'intégration (Python)

Le token se lit uniquement depuis l'environnement — pas de valeur en dur, pas de fallback :

```python
import httpx
import os

class OpenClawTransport:
    """Transport standard pour communiquer avec un agent OpenClaw."""

    def __init__(self, agent: str = "fishey"):
        self._bridge_url = os.getenv(
            "OPENCLAW_BRIDGE_URL", "http://openclaw-bridge:8000"
        )
        self._token = os.getenv("OPENCLAW_BRIDGE_TOKEN")
        if not self._token:
            raise RuntimeError(
                "OPENCLAW_BRIDGE_TOKEN manquant : ajoute-le au .env du projet"
            )
        self._agent = agent

    def send_prompt(self, prompt: str, timeout: int = 120) -> dict:
        """Envoie un prompt à l'agent et retourne la réponse JSON."""
        headers = {
            "Content-Type": "application/json",
            "X-Bridge-Token": self._token,
        }
        payload = {
            "prompt": prompt,
            "timeout_seconds": timeout,
        }

        with httpx.Client(timeout=timeout + 15) as client:
            resp = client.post(
                f"{self._bridge_url}/api/internal/v1/agents/{self._agent}/send",
                json=payload,
                headers=headers,
            )
            resp.raise_for_status()
            return resp.json()


# Exemple d'utilisation avec Fishey
transport = OpenClawTransport(agent="fishey")
result = transport.send_prompt("Quel poisson pêcher au lac Memphremagog?")
# result = { "success": true, "response": "{...json structuré...}" }
```

### 3. Configuration Docker (docker-compose.yml)

Ton conteneur doit être sur `web_network` et recevoir le token (via `env_file: .env` ou `environment`) :

```yaml
services:
  mon-backend:
    # ...
    env_file: .env
    # ou: environment: - OPENCLAW_BRIDGE_TOKEN=${OPENCLAW_BRIDGE_TOKEN}
    networks:
      - web_network

networks:
  web_network:
    external: true
```

### 4. Variables d'environnement

Ajoute au `.env` de ton projet (ignoré par git, jamais commité) :

```env
OPENCLAW_BRIDGE_URL=http://openclaw-bridge:8000
OPENCLAW_BRIDGE_TOKEN=
```

> ⚠️ `OPENCLAW_BRIDGE_TOKEN` est un secret (`10-security`) : valeur uniquement dans `.env`,
> jamais dans un fichier versionné ni dans un exemple. Si un projet externe doit utiliser
> le bridge, passe par l'endpoint public (`/api/v1/...`) avec Google Auth.

## 🔒 Sécurité

| Couche | Protection |
|--------|------------|
| **Public** (`/api/v1/...`) | Google OAuth (Traefik `google-auth@docker`) + token |
| **Interne** (`/api/internal/...`) | Token uniquement + accès restreint au réseau Docker `web_network` |
| **Host** (port 18790) | Bind sur `0.0.0.0` mais non exposé à Internet (pas de règle Traefik, pas de port mapping) |

### Rotation du token

Pour changer le token :
1. Mettre à jour `BRIDGE_API_TOKEN` dans le `.env` du bridge (`~/.openclaw/workspace-project-agent/openclaw-bridge/.env`, jamais commité). `main.py` le lit au démarrage, sans valeur par défaut : s'il manque, le bridge refuse de démarrer.
2. Mettre à jour `OPENCLAW_BRIDGE_TOKEN` dans le `.env` de chaque projet utilisant le bridge
3. `cd ~/.openclaw/workspace-project-agent/openclaw-bridge && docker compose up -d --build openclaw-bridge`
4. Recréer le conteneur backend de chaque projet (`docker compose up -d --force-recreate <service backend>`) : un conteneur ne relit son `.env` qu'à sa création.

## 🛠️ Maintenance

### Vérifier l'état des services

```bash
# Bridge
docker logs openclaw-bridge --tail 10

# Relay Helper
systemctl --user status openclaw-relay-helper.service

# Tester le healthcheck (pas de token requis)
PROJECT_NAME="$(sed -n 's/^PROJECT_NAME=//p' .env)"
docker exec "${PROJECT_NAME}-back" python -c "
import httpx
r = httpx.get('http://openclaw-bridge:8000/health')
print(r.json())
"

# Tester un appel complet — token lu dans l'env du conteneur, jamais tapé en clair
docker exec "${PROJECT_NAME}-back" python -c "
import httpx, os
r = httpx.post(
    'http://openclaw-bridge:8000/api/internal/v1/agents/fishey/send',
    json={'prompt': 'ping', 'timeout_seconds': 30},
    headers={'X-Bridge-Token': os.environ['OPENCLAW_BRIDGE_TOKEN']},
)
print(r.status_code, r.json())
"
```

### Redémarrer après un reboot

```bash
systemctl --user restart openclaw-relay-helper.service
cd ~/.openclaw/workspace-project-agent/openclaw-bridge && docker compose up -d
```

> Le service systemd a `Restart=always` et se lance automatiquement au boot.

### Ajouter un nouvel agent

Le bridge est générique : le paramètre `{agent}` dans l'URL correspond au `--agent` du CLI.

```
POST /api/internal/v1/agents/{nouvel_agent}/send
```

Aucune modification du bridge nécessaire. Seul le relay helper doit pouvoir exécuter
`openclaw agent --agent {nouvel_agent}`.

## 📁 Fichiers concernés

| Fichier | Emplacement | Rôle |
|---------|-------------|------|
| `main.py` | `openclaw-bridge/backend/` | API FastAPI du bridge |
| `docker-compose.yml` | `openclaw-bridge/` | Déploiement Docker bridge |
| `openclaw-relay-helper.py` | `/home/blain/` | Script host qui wrap le CLI |
| `openclaw-relay-helper.service` | `~/.config/systemd/user/` | Service systemd permanent |

---

> **Dernière mise à jour :** 2026-10-14 — Token exclusivement via `OPENCLAW_BRIDGE_TOKEN` (aligné `AI skills/openclaw-bridge.md`).