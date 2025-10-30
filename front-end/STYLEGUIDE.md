# Stone Management Front-End Style Guide

This guide documents the updated elegant UI system.

## Design Principles
1. Clarity: Prioritize readable hierarchy & spacing.
2. Consistency: Reuse tokens for color, radius, shadow, spacing.
3. Accessibility: Keyboard operable controls, visible focus, semantic structure.
4. Performance: Lightweight CSS utilities instead of large UI frameworks.
5. Motion: Subtle, purposeful transitions. Respect reduced motion.

## Global Tokens (theme.css)
Defined under `:root` and overridden for dark mode via `body.theme-dark`:
- Colors: `--color-*` palette (primary, surfaces, borders, semantic states).
- Radii: `--radius-xs` … `--radius-lg`, `--radius-pill`.
- Spacing: 4px baseline scale `--space-*`.
- Typography: font family, size scale, line height.
- Shadows: layered elevation tokens.
- Motion: durations & easings.

## Components
### Card
`.card` base surface with soft elevation; add `.soft` for subtle alt background; `.hoverable` for interactive lift.

### Button Variants
Base `.btn`. Modifiers: `.btn-outline`, `.btn-ghost`, `.btn-danger`, `.btn-pill`. Disabled state automatic.

### Floating Field
Wrapper `.field.floating` with an `input` and adjacent `label`. Label lifts when input focused or has value.

### Badge
`.badge` for inline metadata. Variants: `.primary`, `.soft`, `.danger`.

### Segmented Control
Container `.segment-group` with interactive `.segment` children. `active` class toggled by selection.

### Table Grid
Responsive grid rows using `.table-row` and `.table-head` for structured data lists.

### Toast
`.toast` fixed bottom center ephemeral feedback.

## Layout
`Layout.js` provides shell with sticky header, brand, global actions, dark toggle and main content container.

## Dark Mode
Automatic on initial load if user preference is dark. Manual toggle updates `body.theme-dark`. Adjusted tokens ensure contrast.

## Accessibility Notes
- Floating labels remain visible for context; placeholder text intentionally blank with space.
- Segmented control uses `input[type=radio]` hidden but retains semantics; keyboard focus styles via outline.
- Color contrast meets WCAG AA for primary against backgrounds.
- Motion reduced under `prefers-reduced-motion: reduce`.

## Adding New UI Elements
1. Prefer existing tokens; avoid hard-coded hex values.
2. Keep custom component styles in a colocated CSS file or extend utilities with minimal overrides.
3. Use semantic HTML elements (`button`, `nav`, `section`, `header`) where intent is clear.
4. Provide `aria-label` or `title` for icon-only buttons.

## Roadmap / Future Enhancements
- Extract form inputs into dedicated React components (Field, SegmentedControl).
- Add Toast context provider.
- Implement responsive side navigation for larger screens.
- Add loading skeleton utilities.

---
Last updated: (auto-generated) 2025-10-31