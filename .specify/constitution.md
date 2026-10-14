<!-- BEGIN blain-agent-kit:constitution (managed v0.5.1) -->
## Constitution agent blain-projects (managée par blain-agent-kit)

> Bloc **managé par blain-agent-kit**. Articles VÉRIFIABLES avant de déclarer une tâche "done". Édite dans le repo `blain-agent-kit`, pas ici. Le contenu hors de ce bloc reste local.

### Article I — Tests (TDD)
Aucune feature n'est "done" sans test écrit ET exécuté au préalable. Edge-cases couverts. Tout fix de bug est verrouillé par un test.

### Article II — Sécurité
Aucun secret en clair ni commité (env uniquement). `/approve` formel obtenu AVANT tout changement sécu/infra, sudo/root, nouveau port ou nouveau credential.

### Article III — Réseau / Docker
Services sur `web_network`, aucun port exposé (routage Traefik via labels), privé = `google-auth@docker`, persistance via volumes.

### Article IV — Design System
UI exclusivement depuis `@blain-projects/ui` : zéro primitive maison, zéro hex brut, zéro thème redéfini. Toute modif d'un primitif partagé (composant importé, classe `bui-*`, token `--bui-*`) se corrige DANS le package `blain-ui` puis se propage (bump SemVer + publish + `npm update` des consommateurs `^1.x`) — jamais un patch local. CSS validé par un VRAI `vite build` (pas seulement `tsc`). Mobile-first minimal, vérifié à 375px de large. Détail : skill `blain-ui-governance.md`.

### Checklist avant "done"
- [ ] Test écrit + exécuté (vert), edge-cases couverts
- [ ] Aucun secret en clair ; `/approve` obtenu si requis
- [ ] Réseau/Docker conforme (web_network, pas de ports, volumes)
- [ ] UI 100% `@blain-projects/ui` ; modif de primitif faite au package + propagée ; CSS validé par `vite build` ; mobile-first testé à 375px
- [ ] Docs à jour, commit atomique sur `main`
<!-- END blain-agent-kit:constitution -->
