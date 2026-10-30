<!-- BEGIN blain-agent-kit:agents (managed v0.6.0) -->
## Méthodo agent blain-projects (managée par blain-agent-kit)

> Ce bloc est **managé par blain-agent-kit**. Ne l'édite pas ici : modifie le repo `blain-agent-kit`, le sync le réinjectera. Tout texte hors de ce bloc reste local et n'est jamais touché.

### Écosystème
Les apps blain-projects partent d'un **template** (fork). Le déploiement suit `AI skills/prod-redeploy.md`. Ce kit est resynchronisé dans chaque dépôt depuis serveur-blain (la gateway OpenClaw qui le faisait est éteinte depuis le 2026-10-24).

### Plateforme : lire, ne pas copier
Dans ce dépôt, tu es l'**expert local du projet**. Pour une décision qui touche l'infra de Guillaume (réseau, déploiement, design system, bots, données partagées), lis d'abord le **catalogue des skills de la flotte**, en lecture seule :
- sur serveur-blain : `~/blain-skills/CATALOG.md` (chaque skill : `~/blain-skills/plugins/<domaine>/skills/<skill>/SKILL.md`) ;
- ailleurs, ou en cloud : le dépôt GitHub `Blain354/blain-skills`, fichier `CATALOG.md`.

Ne recopie aucun skill dans ce dépôt, et ne délègue pas le travail à un autre agent. La mémoire de Guillaume (règles, décisions, état) est le vault : `~/SynologyDrive/Knowledge_base/AGENTS.md` sur serveur-blain.

### Règles à respecter (voir `.cursor/rules/`)
- **TDD** (`00-core`) : écris + roule un test avant "done", code modulaire single-responsibility, zéro régression sans test, commits atomiques sur `main` (pas de PR).
- **Sécurité** (`10-security`) : pas de secret en clair, `/approve` avant tout changement sécu/infra/port/credential, Inventory API via curl+Bearer, SimpleFin = seule source bancaire.
- **Docker / Traefik** (`20-docker-traefik`) : `web_network` par défaut (exception de projet dans `AI skills/deployment-architecture.local.md`, après `/approve`), jamais de ports exposés (labels Traefik), `apiFetch()` côté front. Un site public est compté dans les statistiques de visite (ligne `t.js` du template) ; si Guillaume demande de l'omettre : label `blain.stats=off`.
- **Redéploiement en prod** (`AI skills/prod-redeploy.md`) : le code est cuit dans l'image, donc un changement n'est live qu'après `docker compose up -d --build` depuis le checkout de prod. Rebuild, redéploie et vérifie que c'est servi **avant** de demander une review — sinon Guillaume review l'ancienne version.
- **Design system** (`30-blain-ui`) : toute l'UI depuis `@blain-projects/ui`, zéro primitive maison / hex brut, **mobile-first minimal** testé à 375px.
<!-- END blain-agent-kit:agents -->

## Version de l'app

`frontend/package.json` → `version` est affichée dans le SiteFooter (avec le commit
déployé). Point de départ fixé le 2026-10-26 lors de la migration Liquid 2, estimé
d'après la quantité de travail. À chaque changement livré, l'agent l'incrémente
en semver, dans le même commit que le changement : correctif → patch,
fonctionnalité → minor, refonte ou rupture → major
(`npm version <patch|minor|major> --no-git-tag-version` dans `frontend/`).
