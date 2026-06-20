<script setup lang="ts">
import type { RecentReceiptCardProps } from './types/recent-receipt-card'

defineProps<RecentReceiptCardProps>()
</script>

<template>
  <article class="recent-receipt-card">
    <span class="recent-receipt-card__icon" aria-hidden="true">
      <span class="material-symbols-outlined">{{ icon }}</span>
    </span>
    <div class="stack-xs">
      <h3 class="type-body-md text-primary">{{ title }}</h3>
      <p class="type-label text-muted">{{ meta }}</p>
    </div>
  </article>
</template>

<style scoped>
.recent-receipt-card {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  border: var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-sm);
  background: var(--color-surface-container-low);
  transition: border-color var(--motion-smooth);
}

.recent-receipt-card:hover {
  border-color: var(--color-outline);
}

.recent-receipt-card__icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: var(--space-2xl);
  height: var(--space-2xl);
  border-radius: var(--radius-md);
  background: var(--color-surface-container-high);
  color: var(--color-outline);
}
</style>
