---
name: steel-signature-frontend
description: Apply Steel Signature color and interaction conventions to frontend UI work. Use when implementing or modifying frontend components, pages, or styles in this template.
---

# Steel Signature Frontend

## Purpose

Enforce consistent Steel Signature visual behavior for frontend implementation.

## Required Reference

Before editing frontend UI styles/components, read:

- `AI skills/steel-signature-colors.md`

## Implementation Rules

- Use design tokens from `frontend/src/index.css`.
- Prefer token-based styling in `App.css` or component CSS modules.
- Keep interaction states consistent:
  - hover: subtle emphasis
  - focus-visible: explicit ring via token
  - disabled: reduced emphasis, still readable
- Preserve light/dark support for all new UI styles.
- **Header theme toggle:** the main app shell must include a light/dark control in the **header** (top bar), wired to `data-theme` on the document root, with system preference as the default when unset.

## Quick Checklist

- [ ] No hard-coded colors in component styles (except token definitions)
- [ ] Accent colors only for intentful interactions
- [ ] Focus state visibly accessible
- [ ] Works in both light and dark themes
- [ ] Theme switch is available in the header on primary layouts
