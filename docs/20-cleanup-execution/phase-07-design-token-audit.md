# Phase 7 — Design Token Audit

## Token Implementation Method

Career77 uses **Tailwind CSS v4** with the `@import "tailwindcss"` directive. Design tokens are configured via `@theme inline` in `app/globals.css`.

## Currently Defined Tokens

### CSS Custom Properties (`globals.css`)
```css
:root {
  --background: #f8fafc;    /* slate-50 */
  --foreground: #0f172a;    /* slate-900 */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
}
```

### Typography
- **Body font**: Inter (Google Fonts), loaded via `next/font/google` with CSS variable `--font-inter`
- **Display font**: Outfit (Google Fonts), loaded via `next/font/google` with CSS variable `--font-outfit`
- Both fonts are applied as `font-sans` and `font-display` Tailwind utilities via `@theme inline`

## Approved Design System Colors (from `docs/07-design/7.3-design-color-system.md`)

| Token Name | Value | Role |
|---|---|---|
| Primary Accent | `#4F46E5` (indigo-600) | Buttons, links, active nav |
| Conversion Accent | `#10B981` (emerald-500) | Success, CTAs |
| Structural Neutral | `#0F172A` (slate-900) | Primary text |
| Surface | `#FFFFFF` | Cards, panels |
| Light Surface | `#F8FAFC` (slate-50) | Page backgrounds |

## Token Gap Analysis

| Token | Defined in CSS | Used Consistently | Gap |
|---|---|---|---|
| Background | `--background: #f8fafc` | Partially | Used in `body`, but many components hardcode `bg-slate-50` directly |
| Foreground | `--foreground: #0f172a` | Partially | Used in `body`, but many components hardcode `text-slate-900` directly |
| Primary | Not defined | No | All uses hardcode `indigo-600` (e.g., `bg-indigo-600`) |
| Conversion | Not defined | No | `emerald-500` used ad-hoc where needed |
| Success / Error / Warning | Not defined | No | Inline color classes used throughout |
| Border | Not defined | No | `border-slate-200`, `border-slate-100` used inline |

## Findings

### Tokens Are Minimal
Only `--background` and `--foreground` are formally defined. The primary brand color (`#4F46E5` / `indigo-600`) is not formalized as a CSS custom property or Tailwind theme extension.

### Color Usage Is Consistent But Not Tokenized
Despite the lack of formal tokens, color usage across the codebase is reasonably consistent:
- Candidate and Recruiter portals correctly use `indigo-600` for active/primary states
- Admin console uses `purple-600` as its active color (different from the approved primary `#4F46E5`)
- Public pages use `blue-600` for the Navbar brand logo and links (different from approved `indigo-600`)

### Three Color Inconsistencies Found
1. **Public Navbar**: Uses `blue-600` for brand (`text-blue-600`) — should be `indigo-600`
2. **Admin Console**: Uses `purple-600` for active state — should be `indigo-600`
3. **Admin Console**: Uses dark theme (`bg-slate-950`) — should be light theme

### No Tailwind Config Customization
No `tailwind.config.ts` or `tailwind.config.js` exists. Color extensions or theme customizations have not been applied.

## Deferred Actions
Formalizing design tokens into a `tailwind.config.ts` with named theme extensions is deferred to a dedicated design token phase.
