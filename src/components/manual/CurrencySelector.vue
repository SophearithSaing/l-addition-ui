<script setup lang="ts">
import { CurrencyCode, type CurrencySelectorProps } from './types/currency-selector'

defineProps<CurrencySelectorProps>()

const emit = defineEmits<{
  'update:currency': [currency: CurrencyCode]
  'update:customCurrency': [customCurrency: string]
}>()
</script>

<template>
  <fieldset class="currency-selector">
    <legend class="currency-selector__label">{{ label }}</legend>
    <div class="currency-selector__controls">
      <button
        class="currency-selector__choice"
        :class="{ 'currency-selector__choice--active': currency === CurrencyCode.Usd }"
        type="button"
        @click="emit('update:currency', CurrencyCode.Usd)"
      >
        USD ($)
      </button>
      <button
        class="currency-selector__choice"
        :class="{ 'currency-selector__choice--active': currency === CurrencyCode.Thb }"
        type="button"
        @click="emit('update:currency', CurrencyCode.Thb)"
      >
        THB (฿)
      </button>
      <label
        class="currency-selector__custom"
        :class="{ 'currency-selector__custom--active': currency === CurrencyCode.Custom }"
      >
        <input
          class="currency-selector__input"
          :value="customCurrency"
          placeholder="Custom"
          maxlength="4"
          @input="emit('update:customCurrency', ($event.target as HTMLInputElement).value)"
          @focus="emit('update:currency', CurrencyCode.Custom)"
        />
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.currency-selector {
  min-width: 0;
  border: 0;
}

.currency-selector__label {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: var(--type-headline-md-size);
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-headline-md-line);
}

.currency-selector__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
  padding-top: var(--space-sm);
}

.currency-selector__choice {
  border: 0;
  padding: 0 0 var(--space-2xs);
  background: transparent;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  font-family: var(--font-display);
  font-size: var(--type-label-md-size);
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-label-md-line);
  transition: color var(--motion-smooth);
}

.currency-selector__choice:hover,
.currency-selector__choice--active {
  color: var(--color-primary);
}

.currency-selector__choice--active {
  border-bottom: 1px solid var(--color-primary);
}

.currency-selector__custom {
  display: inline-flex;
  align-items: center;
  margin-left: var(--space-xs);
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 50%, transparent);
  transition: border-color var(--motion-smooth);
}

.currency-selector__custom:focus-within,
.currency-selector__custom--active {
  border-bottom-color: var(--color-primary);
}

.currency-selector__input {
  width: calc(var(--space-2xl) + var(--space-md));
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: var(--type-label-sm-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-md-line);
  letter-spacing: var(--type-label-md-tracking);
  text-transform: uppercase;
}

.currency-selector__input:focus {
  outline: none;
}

.currency-selector__input::placeholder {
  color: color-mix(in srgb, var(--color-outline-variant) 50%, transparent);
}
</style>
