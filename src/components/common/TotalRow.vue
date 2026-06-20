<script setup lang="ts">
import { TotalRowType } from './total-row'

withDefaults(
  defineProps<{
    label: string
    type?: TotalRowType
    value: string
  }>(),
  {
    type: TotalRowType.Default,
  },
)
</script>

<template>
  <div class="total-row" :class="`total-row--${type}`">
    <span class="total-row__label">{{ label }}</span>
    <span class="total-row__value">{{ value }}</span>
  </div>
</template>

<style scoped>
.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.total-row__label {
  color: var(--color-on-surface-variant);
  font-family: var(--font-body);
  font-size: var(--type-body-md-size);
  font-weight: 400;
  line-height: var(--type-body-md-line);
}

.total-row__value {
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: var(--type-number-md-size);
  font-weight: var(--type-number-md-weight);
  font-variant-numeric: tabular-nums lining-nums;
  line-height: var(--type-number-md-line);
}

.total-row--total {
  padding-top: var(--space-sm);
}

.total-row--total .total-row__label {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: var(--type-headline-md-size);
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-headline-md-line);
}

.total-row--total .total-row__value,
.total-row--grand-total .total-row__value {
  color: var(--color-primary);
  font-size: var(--type-headline-lg-mobile-size);
  font-weight: var(--type-number-xl-weight);
  line-height: var(--type-headline-lg-mobile-line);
  letter-spacing: var(--type-number-xl-tracking);
}

.total-row--grand-total {
  border-top: var(--border-strong);
  margin-top: var(--space-sm);
  padding-top: var(--space-md);
}

.total-row--grand-total .total-row__label {
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: var(--type-label-md-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-md-line);
  letter-spacing: var(--type-label-md-tracking);
  text-transform: uppercase;
}

@media (min-width: 768px) {
  .total-row--total .total-row__value,
  .total-row--grand-total .total-row__value {
    font-size: var(--type-display-lg-size);
    line-height: var(--type-display-lg-line);
  }
}
</style>
