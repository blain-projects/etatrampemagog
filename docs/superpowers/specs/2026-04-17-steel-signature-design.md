# Steel Signature Design Spec

## Context

This repository is a reusable fullstack template for future web projects.  
The goal of this spec is to define a consistent personal visual identity ("Steel Signature") that can be applied across all generated projects.

## Design Goals

- Establish a recognizable and reusable visual style across projects.
- Blend premium elegance with minimal technical clarity.
- Support both light and dark themes from day one.
- Keep the system practical for product apps, dashboards, and marketing pages.
- Ensure accessibility and maintainable implementation via design tokens.

## Chosen Direction

The selected direction is **Steel Signature**:

- Style intent: **premium elegant + tech minimal + assertive personality**
- Theme model: **dual theme** (`light` and `dark`)
- Signature accent: **steel blue**

## Brand DNA

- 80% neutral/minimal visual foundation, 20% steel-blue character.
- Clean, precise surfaces and visible structural borders.
- Accent color reserved for intentful interactions (primary actions, active states, links, focus).
- Same visual family in light and dark (not two unrelated design languages).

## Color System

### Accent Palette

- `steel-500`: `#3B82F6` (primary accent)
- `steel-600`: `#2563EB` (hover/pressed accent)
- `steel-100`: `#DBEAFE` (soft accent background in light)
- `steel-dark-soft`: derived from `#1E3A8A` blends for soft dark backgrounds

### Neutral Palette (Light)

- `bg`: `#F8FAFC`
- `surface`: `#FFFFFF`
- `surface-2`: `#F1F5F9`
- `border`: `#E2E8F0`
- `text`: `#0F172A`
- `text-muted`: `#475569`

### Neutral Palette (Dark)

- `bg`: `#0B1220`
- `surface`: `#111827`
- `surface-2`: `#1F2937`
- `border`: `#334155`
- `text`: `#E5E7EB`
- `text-muted`: `#94A3B8`

### Functional Feedback

- Success, warning, and error colors should remain slightly muted to avoid competing with the steel-blue signature.
- Contrast for all semantic colors must meet WCAG AA requirements in both themes.

## Typography

- Primary font stack:
  - `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`
- Weights:
  - Body: `400`/`500`
  - Headings: default `600`, `700` for key hero or high-emphasis titles only
- Suggested size scale:
  - `text-sm`: `14px`
  - `text-base`: `16px`
  - `text-lg`: `18px`
  - `h3`: `20px`
  - `h2`: `24px`
  - `h1`: `32px` (desktop baseline; reduced on small screens)
- Readability baseline:
  - Body line-height at or above `1.5`

## Spatial System

- Base spacing grid: multiples of `4px`
- Core spacing steps: `4, 8, 12, 16, 24, 32, 48`
- Content shell should favor consistent vertical rhythm and predictable section spacing.

## Shape, Elevation, and Motion

### Radius

- Inputs/buttons: `10px`
- Cards/panels: `14px`
- Modals/drawers: `16px`

### Elevation

- Light theme: subtle, short, diffused shadows.
- Dark theme: lower shadow reliance; separation comes more from borders and overlays.
- Avoid dramatic floating effects.

### Motion

- Interaction transitions: `120ms` to `180ms`, mostly `ease-out`.
- Hover states: small lift or border/color transition.
- Focus states: explicit visible ring with steel-blue accent and offset.
- Avoid decorative long animations.

## Reference Components (v1 Baseline)

### Buttons

- Variants: `primary`, `secondary`, `ghost`
- Sizes: `sm`, `md`, `lg`
- States: default, hover, active, disabled, loading, focus-visible
- Primary button must carry the strongest steel-blue identity.

### Inputs

- Components: text input, select, textarea
- Characteristics:
  - Stable surface fill and clear borders
  - Subtle placeholder contrast
  - Accent-colored focus ring + border
  - Error state clear but restrained

### Cards / Panels

- Variants: `default`, `elevated`, `interactive`
- Interactive behavior: mild hover feedback + optional accent-border emphasis.

### Navigation

- Top navigation with stable height and clear separators.
- Active item signaled through accent color plus weight/contrast change.
- Secondary nav content uses muted text tones.

### Page Shell

- Recommended max content width around `1200px`.
- Standardized page header structure:
  - title
  - subtitle/description
  - primary actions region

### Feedback Components

- Baseline set:
  - badge
  - alert
  - toast
  - empty state
  - skeleton
- All feedback components must consume the same token system.

## Implementation Contract (Template-Level)

- Define global tokens in `frontend/src/index.css`:
  - `--color-*`
  - `--space-*`
  - `--radius-*`
  - `--shadow-*`
  - `--motion-*`
- Theme switching contract:
  - `data-theme="light"` / `data-theme="dark"` on root element
  - support system preference fallback
- Provide small, reusable utility classes for rapid page assembly, without replacing component-level styling discipline.

## Non-Goals (v1)

- No complex branding assets (logos, illustrations, mascots).
- No custom animation framework.
- No full component library abstraction in v1.
- No per-project visual divergence by default; projects may extend but should inherit Steel Signature baseline.

## Accessibility and Quality Requirements

- WCAG AA color contrast minimum for text and interactive controls.
- Visible keyboard focus indicators in all interactive components.
- Preserve readable content density in both themes.
- Ensure token naming and usage remain predictable and maintainable.

## Acceptance Criteria

- A shared design token baseline exists and supports both light/dark themes.
- Core component styling (button, input, card, nav, shell) reflects Steel Signature consistently.
- Accent usage remains intentional and not over-applied.
- The resulting UI feels premium, precise, and reusable across different project types.

## Risks and Mitigations

- Risk: Over-stylization reduces universality across projects.
  - Mitigation: Keep strong identity mostly in accent/focus/interaction layers.
- Risk: Dark and light themes drift apart over time.
  - Mitigation: Require token parity and mirrored component state logic.
- Risk: Inconsistent future additions.
  - Mitigation: Centralize additions through token-driven rules and documented component conventions.

## Next Step

After this design spec is approved, create an implementation plan and then apply the baseline in the template frontend styles/components.
