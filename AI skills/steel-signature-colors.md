# Steel Signature Color Rules

Use this reference whenever implementing or modifying frontend UI in this template.

## Core Intent

- Maintain the Steel Signature identity: premium, precise, and minimal.
- Keep color usage stable across all projects derived from this template.
- Use accent color intentionally; avoid visual noise.

## Canonical Tokens

Use the token names already defined in `frontend/src/index.css`:

- Accent:
  - `--color-steel-100`
  - `--color-steel-500`
  - `--color-steel-600`
- Neutrals:
  - `--color-bg`
  - `--color-surface`
  - `--color-surface-2`
  - `--color-border`
  - `--color-text`
  - `--color-text-muted`
- Interaction/feedback:
  - `--color-focus`
  - `--color-success`
  - `--color-warning`
  - `--color-danger`

## Usage Rules

- Always style new components with tokens, never raw hex values, unless defining new tokens.
- Reserve accent (`steel`) for:
  - primary actions
  - active/selected states
  - links
  - focus indicators
- Keep non-primary UI surfaces neutral and low-saturation.
- Prefer borders and subtle contrast over heavy visual effects.

## Theme Contract

- Light and dark modes must both be supported.
- Theme state is controlled by `data-theme="light"` or `data-theme="dark"` at root level.
- Do not add frontend styles that only work in one theme.

## Header theme control (all projects)

- The **primary app header** (top navigation / shell) must always expose a **light / dark theme toggle** so users can switch themes without leaving the page.
- Implementations should read the initial mode from **system preference** when no explicit choice exists, then update `data-theme` on the root element when the user toggles.
- When scaffolding or refactoring layouts, do not remove this control from the header unless the product owner explicitly requests a different pattern.

## Accessibility

- Keep keyboard focus clearly visible.
- Maintain at least WCAG AA contrast for text and controls.
- Avoid low-contrast accent-on-accent combinations.

## Anti-Patterns

- Hard-coded colors inside component CSS.
- Introducing unrelated accent colors for single components.
- Strong shadows/glows that overpower content hierarchy.
- Different semantic meaning for the same token across pages.
