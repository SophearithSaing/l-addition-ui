<script setup lang="ts">
import CurrencySelector from './CurrencySelector.vue'
import type { CurrencyCode } from './types/currency-selector'
import type { ManualContextFormProps } from './types/manual-context-form'

defineProps<ManualContextFormProps>()

const emit = defineEmits<{
  'update:currency': [currency: CurrencyCode]
  'update:customCurrency': [customCurrency: string]
  'update:restaurantName': [restaurantName: string]
}>()
</script>

<template>
  <div class="manual-context-form">
    <label class="manual-context-form__restaurant quiet-field">
      <span class="manual-context-form__label">Restaurant Name</span>
      <input
        class="input input--stationery type-headline-md"
        :value="restaurantName"
        placeholder="e.g. Le Meurice"
        @input="emit('update:restaurantName', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <CurrencySelector
      :currency="currency"
      :custom-currency="customCurrency"
      label="Currency"
      @update:currency="emit('update:currency', $event)"
      @update:custom-currency="emit('update:customCurrency', $event)"
    />
  </div>
</template>

<style scoped>
.manual-context-form {
  display: grid;
  grid-template-columns: 1fr;
  align-items: end;
  gap: var(--space-md);
}

.manual-context-form__restaurant {
  min-width: 0;
}

.manual-context-form__label {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: var(--type-headline-md-size);
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-headline-md-line);
}

@media (min-width: 768px) {
  .manual-context-form {
    grid-template-columns: minmax(0, 1fr) max-content;
  }
}
</style>
