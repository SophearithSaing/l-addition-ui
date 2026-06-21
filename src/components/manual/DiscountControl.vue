<script setup lang="ts">
import type {
  DiscountControlProps,
  DiscountUnit,
} from './types/discount-control'

defineProps<DiscountControlProps>()

const emit = defineEmits<{
  'amount-keydown': [event: KeyboardEvent]
  'update:discount': [discount: string]
  'update:discountUnit': [discountUnit: DiscountUnit]
}>()

/**
 * Emits the current input value as the discount amount.
 *
 * @param event Input event from the discount field.
 */
function updateDiscount(event: Event): void {
  emit('update:discount', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <span class="discount-control">
    <button
      class="discount-control__unit"
      :class="{ 'discount-control__unit--active': discountUnit === 'fixed' }"
      type="button"
      aria-label="Use fixed discount"
      :aria-pressed="discountUnit === 'fixed'"
      @click="emit('update:discountUnit', 'fixed')"
    >
      {{ currencySymbol }}
    </button>
    <input
      class="discount-control__input"
      :value="discount"
      inputmode="decimal"
      min="0"
      placeholder="0.00"
      step="0.01"
      type="number"
      @input="updateDiscount"
      @keydown="emit('amount-keydown', $event)"
    />
    <button
      class="discount-control__unit"
      :class="{
        'discount-control__unit--active': discountUnit === 'percentage',
      }"
      type="button"
      aria-label="Use percentage discount"
      :aria-pressed="discountUnit === 'percentage'"
      @click="emit('update:discountUnit', 'percentage')"
    >
      %
    </button>
  </span>
</template>

<style scoped>
.discount-control {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  color: var(--color-on-surface-variant);
}

.discount-control__input {
  min-width: 0;
  width: 3.75rem;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: var(--type-number-md-size);
  font-variant-numeric: tabular-nums lining-nums;
  line-height: var(--type-number-md-line);
  text-align: right;
}

.discount-control__input:focus {
  outline: none;
}

.discount-control__unit {
  min-width: var(--space-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: var(--type-body-md-size);
  line-height: var(--type-body-md-line);
  transition:
    color var(--motion-smooth),
    opacity var(--motion-smooth);
}

.discount-control__unit:hover,
.discount-control__unit--active {
  color: var(--color-secondary);
}

.discount-control__unit:not(.discount-control__unit--active) {
  opacity: 0.3;
}

@media (min-width: 768px) {
  .discount-control__input {
    width: 5rem;
  }
}
</style>
