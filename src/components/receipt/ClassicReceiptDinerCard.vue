<script setup lang="ts">
import type {
  ClassicReceiptDinerCardEmits,
  ClassicReceiptDinerCardProps,
} from './types/classic-receipt-diner-card'

defineProps<ClassicReceiptDinerCardProps>()

const emit = defineEmits<ClassicReceiptDinerCardEmits>()
</script>

<template>
  <section class="receipt-diner-card">
    <button
      class="receipt-diner-card__header"
      type="button"
      :aria-expanded="isExpanded"
      @click="emit('toggle', diner.id)"
    >
      <span>{{ diner.name || `Diner ${dinerIndex + 1}` }}</span>
      <span class="material-symbols-outlined" aria-hidden="true">
        {{ isExpanded ? 'expand_less' : 'expand_more' }}
      </span>
    </button>

    <ul class="receipt-line-list">
      <li class="receipt-line">
        <span>Food Total</span>
        <span aria-hidden="true"></span>
        <span>{{ formatCurrency(diner.subtotal) }}</span>
      </li>
      <li class="receipt-line">
        <span>Fees &amp; VAT</span>
        <span aria-hidden="true"></span>
        <span>{{ formatCurrency(diner.fees) }}</span>
      </li>
      <li v-if="isRoundingEnabled" class="receipt-line">
        <span>Rounding</span>
        <span aria-hidden="true"></span>
        <span>{{ formatSignedCurrency(diner.rounding) }}</span>
      </li>
      <template v-if="isExpanded">
        <li
          v-for="item in diner.items"
          :key="`${item.source}-${item.id}`"
          class="receipt-line receipt-line--itemized"
        >
          <span>{{ item.name || 'Untitled item' }}</span>
          <span aria-hidden="true"></span>
          <span>{{ formatCurrency(item.amount) }}</span>
        </li>
        <li class="receipt-line receipt-line--itemized">
          <span>Service</span>
          <span aria-hidden="true"></span>
          <span>{{ formatCurrency(diner.service) }}</span>
        </li>
        <li class="receipt-line receipt-line--itemized">
          <span>VAT</span>
          <span aria-hidden="true"></span>
          <span>{{ formatCurrency(diner.tax) }}</span>
        </li>
        <li v-if="diner.adjustments > 0" class="receipt-line receipt-line--itemized">
          <span>Adjustments</span>
          <span aria-hidden="true"></span>
          <span>{{ formatCurrency(diner.adjustments) }}</span>
        </li>
        <li v-if="diner.discount > 0" class="receipt-line receipt-line--itemized">
          <span>Discount</span>
          <span aria-hidden="true"></span>
          <span>-{{ formatCurrency(diner.discount) }}</span>
        </li>
        <li v-if="isRoundingEnabled" class="receipt-line receipt-line--itemized">
          <span>Rounding</span>
          <span aria-hidden="true"></span>
          <span>{{ formatSignedCurrency(diner.rounding) }}</span>
        </li>
      </template>
    </ul>

    <div class="receipt-diner-card__total type-label text-primary">
      <span>Total</span>
      <span>{{ formatCurrency(diner.total) }}</span>
    </div>
  </section>
</template>

<style scoped>
.receipt-diner-card {
  display: flex;
  min-height: 100%;
  flex-direction: column;
}

.receipt-diner-card__header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  border: 0;
  margin-bottom: var(--space-md);
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: var(--type-label-md-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-md-line);
  letter-spacing: var(--type-label-md-tracking);
  text-align: left;
  text-transform: uppercase;
}

.receipt-diner-card__header span:first-child {
  min-width: 0;
  overflow-wrap: anywhere;
}

.receipt-diner-card__header .material-symbols-outlined {
  flex: 0 0 auto;
  font-size: var(--type-body-lg-size);
}

.receipt-line-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-sm);
  margin: 0;
  padding: 0;
  list-style: none;
}

.receipt-line {
  display: flex;
  min-width: 0;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2xs);
  color: var(--color-on-surface-variant);
  font-family: var(--font-body);
  font-size: var(--type-body-md-size);
  line-height: var(--type-body-md-line);
}

.receipt-line span:first-child {
  min-width: 0;
  overflow-wrap: anywhere;
}

.receipt-line span:last-child {
  flex: 0 0 auto;
}

.receipt-line span[aria-hidden='true'] {
  min-width: var(--space-md);
  flex: 1;
  border-bottom: 1px dotted color-mix(in srgb, var(--color-outline-variant) 30%, transparent);
}

.receipt-line--itemized {
  font-style: italic;
  opacity: 0.6;
}

.receipt-diner-card__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent);
  margin-top: var(--space-md);
  padding-top: var(--space-sm);
}
</style>
