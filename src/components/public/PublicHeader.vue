<template>
  <header class="public-header">
    <nav class="public-nav app-container" aria-label="Primary navigation">
      <RouterLink class="public-brand" to="/">L'Addition</RouterLink>
      <RouterLink class="public-header-link type-label" to="/design-system/philosophy">
        Design System
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.public-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: var(--border-subtle);
  background: var(--color-surface);
}

.public-nav {
  min-height: var(--top-bar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.public-brand {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: var(--type-headline-md-size);
  font-style: italic;
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-headline-md-line);
  text-decoration: none;
}

.public-header-link {
  border: 0;
  background: transparent;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  text-decoration: none;
  transition:
    color var(--motion-smooth),
    opacity var(--motion-smooth);
}

.public-header-link:hover {
  color: var(--color-primary);
}
</style>
