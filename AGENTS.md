<!-- BEGIN blain-agent-kit:agents (managed v0.6.4) -->
## Méthodo agent blain-projects (managée par blain-agent-kit)

> Ce bloc est **managé par blain-agent-kit**. Ne l'édite pas ici : modifie le repo `blain-agent-kit`, le sync le réinjectera. Tout texte hors de ce bloc reste local et n'est jamais touché.

### Écosystème
Les apps blain-projects partent d'un **template** (fork). Le déploiement suit `AI skills/prod-redeploy.md`. Ce kit est resynchronisé dans chaque dépôt depuis serveur-blain (la gateway OpenClaw qui le faisait est éteinte depuis le 2026-10-24).

### Plateforme : lire, ne pas copier
Dans ce dépôt, tu es l'**expert local du projet**. Pour une décision qui touche l'infra de Guillaume (réseau, déploiement, design system, bots, données partagées), lis d'abord le **catalogue des skills de la flotte**, en lecture seule :
- sur serveur-blain : `~/blain-skills/CATALOG.md` (chaque skill : `~/blain-skills/plugins/<domaine>/skills/<skill>/SKILL.md`) ;
- ailleurs, ou en cloud : le dépôt GitHub `Blain354/blain-skills`, fichier `CATALOG.md`.

**Fichiers managés par le kit, à ne pas éditer dans ce dépôt.** `sync.mjs` réécrit chaque cible déclarée dans le kit (`kit.config.json`) pour le profil du dépôt : une cible `file` en entier, une cible `block` seulement entre ses marqueurs. Si ces cibles diffèrent de ce que le commit du kit déjà appliqué à ce dépôt y écrivait, `sync-all.sh --state-dir` (passe de `nightly.sh`) ne pousse pas le dépôt. Cibles : ce bloc ; le bloc de `.specify/constitution.md` ; `.cursor/rules/00-core.mdc` et `10-security.mdc` (profil `full` : aussi `20-docker-traefik.mdc` et `30-blain-ui.mdc`) ; `.agent/system_prompt.md`, `.agent/README.md`, `.agent/workflows/onboarding.md`, `.agent/workflows/plan-react.md` ; sous `AI skills/`, `README.md`, `generic-agentic-rules.md`, `development-workflow.md`, `grill-session.md`, `diagnose.md`, `caveman-mode.md`, `domain-language.md`, `skill-authoring-ide-agnostic.md`, `security-modes.md` et `ecc-skills/*.md` (profil `full` : aussi `deployment-modes.md`, `deployment-architecture.md`, `prod-redeploy.md`, `ecosystem-services.md`, `openclaw-bridge.md`, `openclaw-agents-catalog.md`, `onboarding.md`, `project-context.md`, `blain-ui-governance.md`). Le texte hors marqueurs, les `*.local.md`, les `*.local.mdc` et tout autre fichier ne sont pas réécrits. Le stamp `blain-agent-kit.json` est séparé : le kit y pose `version`, `profile` et `syncedAt`, et conserve les autres clés. Une correction du texte managé se fait dans le dépôt `blain-projects/blain-agent-kit` (`managed/`) ; un fait propre à ce projet va dans `AI skills/<nom>.local.md`.

Ne recopie aucun skill dans ce dépôt, et ne délègue pas le travail à un autre agent. La mémoire de Guillaume (règles, décisions, état) est le vault : `~/SynologyDrive/Knowledge_base/AGENTS.md` sur serveur-blain.

### Règles à respecter (voir `.cursor/rules/`)
- **TDD** (`00-core`) : écris + roule un test avant "done", code modulaire single-responsibility, zéro régression sans test, commits atomiques sur `main` (pas de PR).
- **Sécurité** (`10-security`) : pas de secret en clair, `/approve` avant tout changement sécu/infra/port/credential, Inventory API via curl+Bearer, SimpleFin = seule source bancaire.
- **Docker / Traefik** (`20-docker-traefik`) : `web_network` par défaut (exception de projet dans `AI skills/deployment-architecture.local.md`, après `/approve`), jamais de ports exposés (labels Traefik), `apiFetch()` côté front. Un site public est compté dans les statistiques de visite (ligne `t.js` du template) ; si Guillaume demande de l'omettre : label `blain.stats=off`.
- **Redéploiement en prod** (`AI skills/prod-redeploy.md`) : le code est cuit dans l'image, donc un changement n'est live qu'après `docker compose up -d --build` depuis le checkout de prod. Rebuild, redéploie et vérifie que c'est servi **avant** de demander une review — sinon Guillaume review l'ancienne version.
- **Design system** (`30-blain-ui`) : toute l'UI depuis `@blain-projects/ui`, zéro primitive maison / hex brut, **mobile-first minimal** testé à 375px.
- **Code minimal : ponytail** (skill `ponytail`, plugin `tiers-code` du catalogue de la flotte) : avant d'écrire ou de modifier du code, charge ce skill et suis-le : le plus petit changement qui règle toute la tâche ; ni abstraction, ni option, ni dépendance que personne n'a demandée. Les règles ci-dessus passent avant lui : le test écrit et lancé avant « done », l'UI depuis `@blain-projects/ui` même quand un diff plus court existe, le redéploiement vérifié.
<!-- END blain-agent-kit:agents -->

## Version de l'app

`frontend/package.json` → `version` est affichée dans le SiteFooter (avec le commit
déployé). Point de départ fixé le 2026-10-26 lors de la migration Liquid 2, estimé
d'après la quantité de travail. À chaque changement livré, l'agent l'incrémente
en semver, dans le même commit que le changement : correctif → patch,
fonctionnalité → minor, refonte ou rupture → major
(`npm version <patch|minor|major> --no-git-tag-version` dans `frontend/`).
