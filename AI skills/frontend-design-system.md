# Frontend Design System (Shadcn + Tailwind v4)

Ce document régit la création et la modification de tous les composants de l'interface utilisateur.

## Stack Technologique

- **Tailwind CSS v4** (Attention : PAS de fichier `tailwind.config.ts`, tout est géré nativement via `@theme` dans `index.css`).
- **Shadcn UI** (Composants extraits dans `src/components/ui/`).
- **Steel Signature** : Notre palette de couleur maison infusée directement dans les variables Shadcn.

### ⚠️ Avertissement Tailwind v4
Ce projet utilise la version **Tailwind v4** très récente.
Si vous utilisez la commande CLI `npx shadcn@latest add [component]` et qu'elle échoue ou demande l'ancien `tailwind.config.ts`, **résolvez les problèmes manuellement** :
1. N'essayez PAS de ramener Tailwind v3 ou de recréer les vieux fichiers de configuration.
2. Téléchargez les composants en brut (fichiers `.tsx`) si le CLI bloque continuellement.
3. Assurez-vous que l'import css continue de fonctionner via `@import "tailwindcss";`.

## Standards d'Implémentation

Quand l'utilisateur demande la création d'un nouveau composant ou d'une nouvelle page :
1. **Unification absolue** : Par défaut, utilisez les utilitaires Shadcn / Tailwind préconfigurés.
2. **Cohérence Visuelle** : Appliquez les composants du dossier `src/components/ui/` (ex: `Button`, `Card`, `Dialog`) au lieu de créer des équivalents en CSS pur. Ils hériteront automatiquement du style "Steel Signature".
3. **Couleurs de marque** : Pour les appels à l'action ou les marqueurs d'identité, utilisez les classes standards Shadcn (ex: `bg-primary`, `text-muted-foreground`), car elles sont mappées sur nos tons d'acier (`var(--color-steel-600)`).
4. **Dark Mode** : Le multi-thème (support du mode sombre et clair via le toggle de l'en-tête) est obligatoire. N'écrivez jamais de `bg-white` en dur sur un conteneur principal ; utilisez `bg-card` ou `bg-background`.

## Composants Existants

Consultez systématiquement `src/components/ui/` avant de réinventer une roue.
Si l'utilisateur demande un concept simple (exemple : "un formulaire de login"), vous devez l'assembler avec les `<Input>` et `<Button>` du dossier `ui/`.
