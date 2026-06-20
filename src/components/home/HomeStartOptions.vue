<template>
  <section class="home-start-options" aria-label="Bill entry options">
    <slot name="scan"></slot>
    <div class="home-start-options__divider type-label text-muted" aria-hidden="true">or</div>
    <slot name="manual"></slot>
  </section>
</template>

<style scoped>
.home-start-options {
  display: flex;
  width: min(100%, 56rem);
  flex-direction: column;
  gap: var(--space-gutter);
}

.home-start-options__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
}

@media (min-width: 768px) {
  .home-start-options {
    flex-direction: row;
    align-items: stretch;
  }

  .home-start-options__divider {
    padding-inline: var(--space-xs);
  }
}
</style>
