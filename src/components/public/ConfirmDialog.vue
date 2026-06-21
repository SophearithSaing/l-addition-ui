<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  cancelLabel?: string
  confirmLabel?: string
  isOpen: boolean
  message: string
  title: string
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()
const titleId = computed(() => {
  return `${props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dialog-title`
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="dialog-backdrop" role="presentation">
      <section
        class="dialog-panel stack-md"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div class="stack-xs">
          <h2 :id="titleId" class="type-headline-md text-primary">
            {{ title }}
          </h2>
          <p class="type-body-md text-muted">{{ message }}</p>
        </div>

        <div class="dialog-actions">
          <button class="button button--ghost" type="button" @click="emit('cancel')">
            {{ cancelLabel || 'Cancel' }}
          </button>
          <button class="button button--primary" type="button" @click="emit('confirm')">
            {{ confirmLabel || 'Confirm' }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-container-mobile);
  background: color-mix(in srgb, var(--color-on-surface) 32%, transparent);
}

.dialog-panel {
  width: min(100%, 420px);
  border: var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-elevated);
}

.dialog-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-sm);
}
</style>
