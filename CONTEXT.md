# CONTEXT.md — Rampe Magog État · Domain Language

> Glossaire de domaine. Un terme par concept, une phrase. Utiliser ces termes
> tels quels dans le code, commits et réponses agent.

## Language

**Rampe**
: La rampe de mise à l'eau municipale de Magog (lac Memphrémagog) dont ce site rapporte l'état.
_Avoid_: descente, quai, slip.

**Statut**
: L'état de la rampe à un instant donné : `open` / `closed` / `unknown` (libellés UI `Ouverte` / `Fermée` / `Statut inconnu`), affiché avec code couleur et icône.
_Avoid_: état (ambigu), state (en français), disponibilité.

**Avis municipal**
: La page d'avis importants de la Ville de Magog (`…/informations-services/avis-important/`). Première source lue pour un extrait « rampe » (fermeture saisonnière, date de réouverture). Ce n'est **pas** la seule entrée qui peut fermer la rampe — voir **Page loisirs**.
_Avoid_: communiqué, annonce, source unique.

**Page loisirs**
: La page municipale loisirs (`…/culture-sports-communaute/loisirs/`, ancre `#ouverture-fermeture-rampe`). Fournit le **Débit** vivant. Sa lecture **remplace** un débit déjà présent dans la réponse, et si le débit dépasse 70 m³/s elle force le **Statut** à `closed` même lorsque l'avis n'a pas d'extrait rampe (le parseur avis default alors à `open`).
_Avoid_: second scrape (vague), source secondaire (sous-estime le rôle de fermeture).

**Débit**
: Débit de la rivière en m³/s (`river_flow`). Seuil opérationnel : au-dessus de 70 m³/s → navigation interdite → rampe `closed`. Les seuils dans les en-têtes de tableau (« ≤ 70 », « > 70 ») ne sont pas des mesures ; la mesure est la valeur autonome juste avant « Navigation ».
_Avoid_: flow (seul), débit d'évacuation (sans préciser la page).

**Scrape**
: L'opération backend `fetch_ramp_status` : GET avis → parse statut/extrait → GET page loisirs → `enrich_river_flow_from_loisirs` (débit + éventuelle fermeture débit) → cache 5 min.
_Avoid_: crawl, fetch (seul).

**/api/ramp-status**
: L'endpoint backend qui retourne le `Statut` courant (et débit, infos, dates) depuis le cache.
_Avoid_: /status, /api/etat.

**Cache (5 min)**
: Fenêtre de mise en cache backend du résultat du scrape pour éviter de marteler le site municipal et garder un chargement rapide.
_Avoid_: TTL (sans préciser), buffer.

**Date de réouverture**
: Quand la rampe est `closed` pour une raison tirée de l'avis, la date prévue de réouverture extraite de l'extrait, affichée à l'utilisateur.
_Avoid_: ETA, deadline.

## Notes

- Site **public** (pas de Google Auth) ; domaine `etatrampemagog.blain-projects.ca`.
- Utilitaire mono-fonction : un seul signal (ouverte/fermée) doit être immédiat et fiable face aux pages municipales (avis **et** loisirs).
