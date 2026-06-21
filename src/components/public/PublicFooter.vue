<template>
  <footer class="public-footer">
    <div class="public-footer__inner app-container">
      <p class="type-body-md text-muted">© 2026 L'Addition. Not a real company.</p>
    </div>
  </footer>
</template>

<style scoped>
.public-footer {
  margin-top: auto;
  border-top: var(--border-subtle);
  padding-block: var(--space-section);
  background: var(--color-surface-container);
}

.public-footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  text-align: center;
}
</style>
