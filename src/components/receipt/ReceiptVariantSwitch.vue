<script setup lang="ts">
import {
  ReceiptVariant,
  type ReceiptVariantSwitchEmits,
  type ReceiptVariantSwitchProps,
} from './types/receipt-variant-switch'

defineProps<ReceiptVariantSwitchProps>()

const emit = defineEmits<ReceiptVariantSwitchEmits>()
</script>

<template>
  <div class="receipt-variant-controls">
    <div class="receipt-variant-switch" aria-label="Receipt style">
      <button
        class="receipt-variant-switch__option"
        :class="{
          'receipt-variant-switch__option--active':
            modelValue === ReceiptVariant.Classic,
        }"
        type="button"
        :aria-pressed="modelValue === ReceiptVariant.Classic"
        @click="emit('update:modelValue', ReceiptVariant.Classic)"
      >
        Classic
      </button>
      <button
        class="receipt-variant-switch__option"
        :class="{
          'receipt-variant-switch__option--active':
            modelValue === ReceiptVariant.Polished,
        }"
        type="button"
        :aria-pressed="modelValue === ReceiptVariant.Polished"
        @click="emit('update:modelValue', ReceiptVariant.Polished)"
      >
        Polished
      </button>
    </div>
  </div>
</template>

<style scoped>
.receipt-variant-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  margin-top: var(--space-section);
}

.receipt-variant-switch {
  display: flex;
  width: fit-content;
  border: var(--border-subtle);
  border-radius: var(--radius-pill);
  padding: var(--space-2xs);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-ambient);
}

.receipt-variant-switch__option {
  border: 0;
  border-radius: var(--radius-pill);
  padding: var(--space-xs) var(--space-sm);
  background: transparent;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: var(--type-label-sm-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-sm-line);
  letter-spacing: var(--type-label-md-tracking);
  text-transform: uppercase;
  transition:
    background var(--motion-smooth),
    color var(--motion-smooth);
}

.receipt-variant-switch__option--active {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
</style>
