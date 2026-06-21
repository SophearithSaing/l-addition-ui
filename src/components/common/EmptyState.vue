<script setup lang="ts">
import type { EmptyStateProps } from './types/empty-state'

withDefaults(defineProps<EmptyStateProps>(), {
  actionLabel: undefined,
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <article class="empty-state">
    <span class="empty-state__icon" aria-hidden="true">
      <span class="material-symbols-outlined icon-lg">{{ icon }}</span>
    </span>

    <div class="stack-xs">
      <h3 class="type-headline-md text-primary">{{ title }}</h3>
      <p class="type-body-md text-muted">{{ message }}</p>
    </div>

    <button
      v-if="actionLabel"
      class="button button--primary"
      type="button"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </article>
</template>

<style scoped>
.empty-state {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  gap: var(--space-md);
  border: var(--border-subtle);
  border-style: dashed;
  border-radius: var(--radius-lg);
  padding: var(--space-sm);
  background: var(--color-surface);
  box-shadow: var(--shadow-ambient);
  text-align: center;
}

.empty-state__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-2xl);
  height: var(--space-2xl);
  border-radius: var(--radius-pill);
  background: var(--color-surface-container);
  color: var(--color-on-surface-variant);
}

@media (min-width: 768px) {
  .empty-state {
    padding: var(--space-lg);
  }
}
</style>
