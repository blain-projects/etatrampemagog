# Blain-UI Governance — modifier le visuel au bon endroit (réflexe par défaut)

> **Principe.** `@blain-projects/ui` est la **source unique** de l'UI de l'écosystème.
> Toute modif visuelle se fait à la **source** (le package), jamais en patch local, pour
> rester **modulaire et héritée** par tous les projets. Un fix local = dette + divergence.

Cette skill complète la règle `.cursor/rules/30-blain-ui.mdc` et l'Article IV de la
constitution. Elle code le workflow **proactif** : détecter → fixer à la source →
propager → valider.

---

## 1) Détecter qu'une demande touche un primitif Blain-UI

Quand on te demande de « changer le visuel », « corriger ce détail », « ajuster ce
composant » dans un projet, AVANT de coder, identifie la cible. C'est du Blain-UI si :

- l'élément vient d'un composant importé de `@blain-projects/ui` (Button, Card, Panel,
  Badge, **StatusLED**, Field/Input, Meter, Dialog, Select, Tooltip, Tabs, Grid,
  Skeleton, Drawer, MenuButton, BlueprintBackground, Typography…) ;
- le markup utilise une classe **`bui-*`** (`bui-led`, `bui-badge`, `bui-btn`,
  `bui-glass`, `bui-card`…) ;
- le style référence un token **`--bui-*`** ;
- le défaut est visible **dans plusieurs apps** (signature partagée, pas un one-off).

Si oui → le fix va dans `blain-ui`. Sinon → voir §2.

## 2) Heuristique promote-vs-local

- **Primitif réutilisable partout** (Button, Card, Badge, StatusLED, Dialog, Grid,
  Tooltip, Skeleton…) → vit dans `@blain-projects/ui`. On le **corrige / promeut** au
  package.
- **Composant spécifique au domaine** (MapModule, nœuds React Flow, FlowGauge, vues
  métier…) → reste **local** au projet, mais ses couleurs/espacements **aliasent les
  tokens `--bui-*`** (jamais de hex brut).
- **Worker en migration** : ne promeus pas en parallèle (= conflits). **Flague** le
  candidat à l'orchestrateur ; la promotion se fait en **un bump de version coordonné**.

## 3) Distinguer le SCOPE avant de toucher (anti-casse)

Pour tout rename/refactor d'un identifiant, distingue 3 strates :
1. **Nom affiché / brand** = cosmétique, zéro risque.
2. **Slug technique** (PROJECT_NAME, containers, sous-domaines/URLs, clés localStorage)
   = casse le déploiement (cert Let's Encrypt, route Traefik, middlewares).
3. **Préfixe de variables d'env** = doit être atomique partout sinon auth/rate-limit casse.

Au moindre doute sur le scope (≥ strate 2), **demande à Guillaume** avant d'agir.

## 4) Corriger à la source (dans `blain-ui`)

1. Branche dédiée (`fix/...` ou `feat/...`). **Jamais** de commit direct sur `main`
   (`main` = prod publiée).
2. Applique le fix dans `src/` (souvent `src/theme.css` pour les classes `bui-*`, ou
   `src/components/*.tsx`). Garde le composant **self-contained**.
3. **Test** : verrouille le fix. Pour un bug de layout/visuel, le `tsc` ne suffit PAS.
4. **Bump SemVer** dans `package.json` (patch pour un fix, minor pour un ajout
   rétro-compatible) + entrée **CHANGELOG.md**.
5. Ouvre une **PR** (garde-fou avant publication). Le merge = décision de Guillaume.

## 5) Validation OBLIGATOIRE — vrai build, pas juste tsc

`theme.css` est de la **SOURCE Tailwind v4** (`@import "tailwindcss"`, `@theme`,
`@layer`). Donc :

- `tsc --noEmit` valide les **types**, PAS le CSS.
- Le consommateur DOIT garder `tailwindcss` + `@tailwindcss/vite` (plugin dans
  `vite.config`). Sans le plugin, `vite build` sort exit 0 mais laisse `@theme`/`@tailwind`
  **non transformés** → tokens & utilities jamais générés = **UI cassée en silence**.
- Pour valider une migration/un fix CSS : roule un **vrai `vite build`** (local contre le
  `tgz` via `npm pack`, ou via le pipeline CI `npm test && npm run build` du package).
- Vérifie les **noms de tokens exacts** (`--bui-bg`, PAS `--bui-color-bg` ; `--bui-r-sm`,
  PAS `--bui-radius-sm`). Un alias vers un token inexistant sans fallback casse le rendu.
- Valide le **rendu réel** (mobile 375px + desktop) avant « done ».

## 6) Propager aux consommateurs

1. **Publie** la nouvelle version : tag `v*` **ou** `workflow_dispatch` du workflow
   `publish.yml` (il fait `npm ci && npm test && npm run build && npm publish` vers
   GitHub Packages — c'est aussi ta validation CI).
2. **Consommateurs** : tous déclarent `@blain-projects/ui` en **range caret `^1.x`**.
   Un bump patch/minor **1.x** est donc auto-satisfait : pas besoin d'éditer leurs
   `package.json`. Il suffit de `npm update @blain-projects/ui` + **rebuild/redeploy**
   par repo.
3. Redeploy = **on-server** (OpenClaw/Buddy) : voir `openclaw-bridge.md`. Délègue les
   rebuilds prod à OpenClaw (l'agent portable a un plafond de ~60s/appel, inadapté aux
   builds multi-minutes).
4. **Valide en prod** : capture chaque app (tool MCP `take_screenshot` — bypasse l'OAuth)
   et confirme le fix visuellement.

## 7) Banc d'essai mental (avant de coder)

- « Ce visuel, c'est un `bui-*` / un composant importé ? » → oui = source, non = local.
- « Mon changement profite-t-il à ≥ 2 apps ? » → oui = package.
- « Ai-je un vrai build (pas juste tsc) qui prouve le rendu ? »
- « Ai-je bumpé + CHANGELOG + PR, et planifié la propagation ? »

> Réflexe d'une phrase : **« si c'est du Blain-UI, je le corrige dans `blain-ui`, je bump,
> je publie, je propage, je valide en prod — jamais un patch local. »**
