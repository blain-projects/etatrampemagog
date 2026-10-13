# Redéploiement en prod — rebuild avant de demander une review (réflexe par défaut)

> **Principe.** Sur serveur-blain, chaque app tourne depuis des **images Docker**
> construites à partir de son checkout de prod (`~/web_projects/<app>`). Le code est
> **copié dans l'image au build** : aucun bind mount. Éditer un fichier, committer ou
> pousser ne change **rien** au site live. Tant que l'image n'est pas reconstruite et le
> conteneur recréé, Guillaume review l'**ancienne** version.

Cette skill complète la règle `.cursor/rules/20-docker-traefik.mdc`.

---

## 1) Quand redéployer

Dès que tu modifies **en prod** quelque chose que Guillaume doit voir ou valider :
code frontend ou backend, `Dockerfile`, dépendances (`package.json`,
`requirements.txt`), migration, config lue au démarrage, assets.

- **Pas nécessaire** : docs seules (`*.md`, `AI skills/`), tests seuls.
- **`docker-compose.yml` qui touche Traefik, ports, réseau, middleware ou secrets** →
  `/approve` d'abord (`10-security`), puis la même procédure.
- Le projet a son propre `scripts/deploy.sh` → utilise-le à la place de l'étape 3, puis
  fais quand même l'étape 4.

## 2) Trouver le checkout qui sert la prod

```bash
docker inspect -f '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' <app>-front
```

C'est **là** qu'on build, jamais depuis un worktree : un worktree n'a pas de `.env`,
donc `PROJECT_NAME` est vide, les conteneurs sont mal nommés et les routes Traefik
cassent.

Amène ton commit dans ce checkout :

1. Tests verts avant tout (`00-core`).
2. `git -C <checkout> status --short` : s'il y a des changements non commités qui ne
   sont pas les tiens, **arrête et demande**.
3. Si tu travailles dans un worktree : commit dans le worktree, puis
   `git -C <checkout> merge --ff-only <ta-branche>` (main reste linéaire, pas de PR).

## 3) Rebuild + recréer les conteneurs

```bash
cd <checkout> && docker compose up -d --build            # toute l'app
cd <checkout> && docker compose up -d --build frontend   # un seul service
```

- Le build se fait **avant** l'arrêt de l'ancien conteneur : si le build échoue, la
  version précédente reste en ligne.
- Frontend : le build a besoin de `NODE_AUTH_TOKEN` dans le `.env` du checkout (package
  privé `@blain-projects/ui`). Un 401/403 sur `npm ci` = token absent ou expiré, pas un
  bug de code.
- Backend : `alembic upgrade head` roule au démarrage, donc la migration s'applique au
  redeploy. Les données vivent dans le volume `/app/data` et survivent au rebuild.

## 4) Vérifier que c'est vraiment live

- `docker compose ps` → services `Up`, backend `healthy`, rien en `Restarting`.
- `docker compose logs --tail=50 <service>` → aucune exception au démarrage.
- `docker inspect -f '{{.Created}}' <app>-front` → conteneur recréé après ton commit.
- Le changement est servi :
  - frontend : `docker exec <app>-front grep -rl "<texte ajouté>" /usr/share/nginx/html`
  - backend : `docker exec <app>-back python -c "import urllib.request as u; print(u.urlopen('http://127.0.0.1:5000/api/health').read())"`
  - de l'extérieur, `google-auth` redirige vers Google : vérifie depuis le conteneur, ou
    dans le navigateur (375px + desktop pour toute modif UI, `30-blain-ui`).
- Pas besoin de vider le cache : `index.html` est servi en `no-cache` et les assets
  sont hashés.

## 5) Demander la review

Donne à Guillaume :

- l'URL live (`https://<app>.blain-projects.ca`) ;
- le commit déployé (`git -C <checkout> rev-parse --short HEAD`) ;
- quoi regarder, et où.

## Si ça casse

- **Build en échec** → la prod n'a pas bougé. Corrige et relance.
- **Conteneur qui crashe au démarrage** → la prod est down. Reviens d'abord en arrière
  (`git -C <checkout> revert --no-edit HEAD` puis `docker compose up -d --build`),
  ensuite diagnostique (`diagnose.md`).

## Sans accès au daemon Docker

Si tu ne peux pas lancer `docker` (agent sandboxé), ton travail n'est **pas** fini :
dis explicitement que le changement n'est **pas encore live**, et donne la commande
exacte de l'étape 3 ou délègue à un agent qui a l'accès. Ne dis jamais « c'est fait »
sur un changement que personne ne peut voir.

## Definition of done (prod)

- [ ] Tests verts
- [ ] Commit sur `main` du checkout de prod
- [ ] `docker compose up -d --build` réussi
- [ ] Conteneurs `Up`/`healthy`, logs propres, recréés après le commit
- [ ] Changement constaté live
- [ ] Review demandée avec URL + SHA
