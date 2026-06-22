<script setup lang="ts">
import type { AdjustmentRowEmits, AdjustmentRowProps } from './types/adjustment-row'

defineProps<AdjustmentRowProps>()

const emit = defineEmits<AdjustmentRowEmits>()

/**
 * Emits the current input value as the adjustment label.
 *
 * @param event Input event from the label field.
 */
function updateLabel(event: Event): void {
  emit('update:label', (event.target as HTMLInputElement).value)
}

/**
 * Emits the current input value as the adjustment amount.
 *
 * @param event Input event from the amount field.
 */
function updateAmount(event: Event): void {
  emit('update:amount', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="adjustment-row">
    <input class="adjustment-row__label" :value="label" placeholder="Label" @input="updateLabel" />
    <span class="adjustment-row__control">
      <span class="adjustment-row__unit">{{ currencySymbol }}</span>
      <input
        class="adjustment-row__amount"
        :value="amount"
        inputmode="decimal"
        min="0"
        placeholder="0.00"
        step="0.01"
        type="number"
        @input="updateAmount"
        @keydown="emit('amount-keydown', $event)"
      />
      <button
        class="adjustment-row__remove"
        type="button"
        aria-label="Remove adjustment"
        @click="emit('remove')"
      >
        ×
      </button>
    </span>
  </div>
</template>

<style scoped>
.adjustment-row {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  border-bottom: var(--border-subtle);
  color: var(--color-on-surface);
  padding-block: var(--space-xs);
}

.adjustment-row__label,
.adjustment-row__amount {
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-family: var(--font-body);
}

.adjustment-row__label:focus,
.adjustment-row__amount:focus {
  outline: none;
}

.adjustment-row__label {
  width: auto;
  flex: 1;
  font-size: var(--type-body-md-size);
  font-weight: 400;
  font-variant-numeric: normal;
  line-height: var(--type-body-md-line);
  text-align: left;
}

.adjustment-row__control {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  color: var(--color-on-surface-variant);
}

.adjustment-row__unit,
.adjustment-row__remove {
  min-width: var(--space-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  font-family: var(--font-body);
  line-height: var(--type-body-md-line);
}

.adjustment-row__unit {
  color: var(--color-secondary);
  font-size: var(--type-body-md-size);
}

.adjustment-row__amount {
  width: 3.75rem;
  font-size: var(--type-number-md-size);
  font-variant-numeric: tabular-nums lining-nums;
  line-height: var(--type-number-md-line);
  text-align: right;
}

.adjustment-row__remove {
  color: var(--color-outline);
  cursor: pointer;
  font-size: var(--type-number-md-size);
  opacity: 1;
  transition: color var(--motion-smooth);
}

.adjustment-row__remove:hover {
  color: var(--color-error);
}

@media (min-width: 768px) {
  .adjustment-row {
    gap: var(--space-sm);
  }

  .adjustment-row__amount {
    width: 5rem;
  }
}
</style>
