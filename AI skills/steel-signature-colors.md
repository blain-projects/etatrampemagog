# Steel Signature / Liquid Color Rules

Use this reference whenever implementing or modifying frontend UI in this app.

## Core Intent

- Keep the Liquid / Steel Signature identity: premium, precise, and minimal.
- Prefer kit tokens over ad-hoc colors.
- Use accent color intentionally; avoid visual noise.

## Canonical Tokens

UI colors come from `@blain-projects/ui/theme.css` (imported in `frontend/src/index.css`). Use the kit `--bui-*` names already consumed by the app, for example:

- Surfaces / text: `--bui-bg`, `--bui-surface`, `--bui-border`, `--bui-text`, `--bui-muted`
- Feedback: `--bui-success`, `--bui-danger`, `--bui-warning`
- Accent / links: `--bui-blue`, `--bui-blue-strong`
- Radii / type: `--bui-r-sm`, `--bui-r-md`, `--bui-r-lg`, `--bui-font-body`, `--bui-font-display`

App-only FlowGauge colors live in `frontend/src/index.css` (`--color-gauge-*`). A few aliases (`--color-border`, `--color-text-muted`, `--font-sans`) map gauge SVG styling onto kit tokens — do not treat those aliases as a second full palette.

## Usage Rules

- Style new UI with `--bui-*` tokens, never raw hex, unless defining a new app-only token (as FlowGauge does).
- Reserve strong accent for primary actions, active states, links, and focus.
- Keep non-primary surfaces neutral and low-saturation.
- Prefer borders and subtle contrast over heavy visual effects.

## Theme Contract

- Light and dark modes must both be supported.
- Theme state is controlled by `data-theme="light"` or `data-theme="dark"` at root level (`bootstrapTheme` / kit `ThemeToggle`).
- Do not add frontend styles that only work in one theme.

## Header theme control

- The primary app header must expose a light / dark theme toggle (`BrandThemeToggle` → kit `ThemeToggle`).
- Initial mode follows system preference when no explicit choice exists; there is no persisted theme preference in this app.
- Do not remove this control from the header unless the product owner explicitly requests a different pattern.

## Accessibility

- Keep keyboard focus clearly visible.
- Maintain at least WCAG AA contrast for text and controls.
- Avoid low-contrast accent-on-accent combinations.

## Anti-Patterns

- Hard-coded colors inside component CSS (except documented app-only gauge tokens).
- Introducing unrelated accent colors for single components.
- Strong shadows/glows that overpower content hierarchy.
- Different semantic meaning for the same token across pages.
