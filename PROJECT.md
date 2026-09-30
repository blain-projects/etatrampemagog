# PROJECT.md — Rampe Magog État

## Name & Tagline

**Rampe Magog État** — Statut en direct de la rampe de mise à l'eau de Magog.

## Problem & Purpose

Les plaisanciers veulent savoir rapidement si la rampe municipale est ouverte ou fermée, sans parcourir le site de la Ville de Magog. Ce site agrège les pages municipales pertinentes (avis importants + loisirs / débit) et affiche le statut clairement.

## Target Audience

Plaisanciers, résidents et visiteurs du lac Memphrémagog qui utilisent la rampe de mise à l'eau de Magog.

## Core Features (MVP)

1. Affichage du statut (ouverte / fermée) avec code couleur et icônes
2. Date de réouverture prévue lorsque la rampe est fermée (extrait avis)
3. API backend `/api/ramp-status` : scrape avis importants, puis page loisirs pour le débit ; débit > 70 m³/s force fermée
4. Jauge de débit et bascule de thème (Liquid / `@blain-projects/ui`)

## Design Identity

- **Style:** Minimal, lisible, mobile-first (Liquid original via `@blain-projects/ui`)
- **Primary color:** Vert (ouverte) / Rouge (fermée) sur fond Steel Signature / Liquid
- **Vibe:** Utilitaire, rassurant, immédiat

## Technical Preferences

- Stack template : React 19 + Vite + FastAPI + Docker + Traefik
- Site public (sans Google Auth ; middleware Traefik commenté dans `docker-compose.yml`)
- Domaine : `etatrampemagog.blain-projects.ca`
- Sources municipales :
  - https://www.ville.magog.qc.ca/informations-services/avis-important/
  - https://www.ville.magog.qc.ca/culture-sports-communaute/loisirs/#ouverture-fermeture-rampe

## Success Metrics

- Statut correct face aux pages municipales (avis + débit loisirs)
- Chargement rapide sur mobile
- Mise à jour via cache backend (5 min)

## Notes & References

- Déploiement OpenClaw avec `PROJECT_NAME=etatrampemagog`
- CORS : `https://etatrampemagog.blain-projects.ca`
