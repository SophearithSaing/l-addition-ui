<script setup lang="ts">
import { computed } from 'vue'
import { InlineActionType, type InlineActionProps } from './types/inline-action'

const props = withDefaults(defineProps<InlineActionProps>(), {
  ariaLabel: undefined,
  disabled: false,
  icon: undefined,
  text: undefined,
  type: InlineActionType.Accent,
})

const accessibleLabel = computed(() => {
  return props.ariaLabel ?? props.text
})
</script>

<template>
  <button
    class="inline-action"
    :class="`inline-action--${type}`"
    type="button"
    :aria-label="accessibleLabel"
    :disabled="disabled"
  >
    <span v-if="icon" class="material-symbols-outlined" aria-hidden="true">
      {{ icon }}
    </span>
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<style scoped>
.inline-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  cursor: pointer;
  transition:
    color var(--motion-smooth),
    background var(--motion-smooth);
}

.inline-action--accent,
.inline-action--muted {
  width: max-content;
  gap: var(--space-xs);
  color: var(--color-secondary);
  font-family: var(--font-body);
  font-size: var(--type-label-sm-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-sm-line);
  letter-spacing: var(--type-label-md-tracking);
  text-transform: uppercase;
}

.inline-action--muted {
  color: var(--color-on-surface-variant);
}

.inline-action--icon {
  display: inline-flex;
  flex: 0 0 auto;
  width: var(--space-lg);
  height: var(--space-lg);
  border-radius: var(--radius-pill);
  color: var(--color-outline);
}

.inline-action .material-symbols-outlined {
  font-size: var(--type-body-md-size);
}

.inline-action:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.inline-action--muted:hover {
  color: var(--color-primary);
}

.inline-action--icon:hover {
  background: var(--color-error-container);
  color: var(--color-error);
}
</style>
