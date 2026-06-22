<script setup lang="ts">
import type { SwitchControlEmits, SwitchControlProps } from './types/switch-control'

defineProps<SwitchControlProps>()

const emit = defineEmits<SwitchControlEmits>()

/**
 * Emits the checked state for the switch input.
 *
 * @param event Change event from the switch input.
 */
function updateModelValue(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <span class="switch-control">
    <small v-if="detail">{{ detail }}</small>
    <input :checked="modelValue" type="checkbox" @change="updateModelValue" />
    <span aria-hidden="true"></span>
  </span>
</template>

<style scoped>
.switch-control {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-on-surface-variant);
}

.switch-control small {
  font-size: var(--type-label-sm-size);
  line-height: var(--type-label-sm-line);
}

.switch-control input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.switch-control span {
  position: relative;
  width: var(--space-xl);
  height: var(--space-md);
  border: var(--border-subtle);
  border-radius: var(--radius-pill);
  background: var(--color-surface-container-highest);
  transition:
    background var(--motion-smooth),
    border-color var(--motion-smooth);
}

.switch-control span::after {
  position: absolute;
  top: 50%;
  left: var(--space-2xs);
  width: var(--space-sm);
  height: var(--space-sm);
  border-radius: var(--radius-pill);
  background: var(--color-outline);
  content: '';
  transform: translateY(-50%);
  transition:
    background var(--motion-smooth),
    transform var(--motion-smooth);
}

.switch-control input:checked + span {
  border-color: var(--color-secondary);
  background: var(--color-secondary-fixed);
}

.switch-control input:checked + span::after {
  background: var(--color-secondary);
  transform: translate(calc(var(--space-md) - var(--space-2xs)), -50%);
}
</style>
