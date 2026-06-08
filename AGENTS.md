# Project: L'Addition

**Goal:** Simplistic bill splitting application, built for fun as much as function.

## Technical Constraints

- **Frontend:** Vue.js, SCSS (Custom Styles only, NO Tailwind).
- **Backend:** Deno.
- **Database:** MongoDB (Mongoose).

## Design

For any design-related work, first read `DESIGN.md` and `design-system.scss`.

Follow `DESIGN.md` as the source of truth for UI, UX, styling, layout, components, and interaction patterns.

Follow `design-system.scss` as the source of truth for design tokens, variables, mixins, colors, spacing, typography, breakpoints, shadows, borders, and reusable style primitives.

Do not introduce new design patterns, hardcoded visual values, or duplicate style primitives unless explicitly requested.

## Code Style

- **Indentation:** 2 spaces (no tabs).
- **Quotes:** Use single quotes `'` for strings unless double quotes are required for JSON.
- **Line Width:** Keep code blocks under 80 characters per line where possible.
- **Comment:** Every function MUST have a return type and TS Doc header. Body comments are forbidden, except for complex algorithmic logic in long functions or non-obvious workarounds for third-party bugs.
- **TS Doc Format:** Include `@param` for each parameter and `@returns` only when the function returns a value. Do not write `@returns Nothing.` for `void` functions.

```ts
/**
 * Finds an item by id.
 *
 * @param itemId Item id to find.
 * @returns Matching item, or null when no item exists.
 */
private findItem(itemId: string): Item | null {
  return null;
}

/**
 * Clears the current state.
 */
public clearState(): void {
  this.state.set(null);
}
```

## Environment

- **Shell:** PowerShell. Use PowerShell-compatible syntax (e.g., `;` instead of `&&` for command chaining).
