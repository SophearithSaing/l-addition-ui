<template>
  <div class="recent-receipt-list">
    <slot></slot>
  </div>
</template>

<style scoped>
.recent-receipt-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-gutter);
}

@media (min-width: 768px) {
  .recent-receipt-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
