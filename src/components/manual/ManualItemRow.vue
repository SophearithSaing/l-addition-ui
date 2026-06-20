<script setup lang="ts">
import InlineAction from '@/components/common/InlineAction.vue'
import { InlineActionType } from '@/components/common/types/inline-action'
import {
  ManualItemRowType,
  type ManualItemRowProps,
} from './types/manual-item-row'

withDefaults(defineProps<ManualItemRowProps>(), {
  amountPlaceholder: '0.00',
  type: ManualItemRowType.Default,
})

const emit = defineEmits<{
  'amount-keydown': [event: KeyboardEvent]
  'update:amount': [amount: string]
  'update:name': [name: string]
  remove: []
}>()
</script>

<template>
  <div class="manual-item-row" :class="`manual-item-row--${type}`">
    <input
      class="manual-item-row__name"
      :value="name"
      :placeholder="namePlaceholder"
      @input="emit('update:name', ($event.target as HTMLInputElement).value)"
    />
    <span class="manual-item-row__price">
      <span class="text-muted">{{ currencySymbol }}</span>
      <input
        :value="amount"
        inputmode="decimal"
        min="0"
        :placeholder="amountPlaceholder"
        step="0.01"
        type="number"
        @input="emit('update:amount', ($event.target as HTMLInputElement).value)"
        @keydown="emit('amount-keydown', $event)"
      />
    </span>
    <InlineAction
      icon="close"
      :aria-label="removeLabel"
      :type="InlineActionType.Icon"
      @click="emit('remove')"
    />
  </div>
</template>

<style scoped>
.manual-item-row {
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) max-content max-content;
  align-items: center;
  gap: var(--space-xs);
  border-bottom: var(--border-subtle);
  padding-block: var(--space-xs);
}

.manual-item-row--active {
  border-bottom-color: var(--color-primary);
}

.manual-item-row input {
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-family: var(--font-body);
}

.manual-item-row input:focus {
  outline: none;
}

.manual-item-row__name {
  flex: 1;
  font-size: var(--type-body-md-size);
  line-height: var(--type-body-md-line);
}

.manual-item-row--active .manual-item-row__name {
  font-family: var(--font-display);
  font-size: var(--type-headline-md-size);
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-headline-md-line);
}

.manual-item-row__price {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  color: var(--color-on-surface-variant);
}

.manual-item-row__price input {
  width: 3.75rem;
  font-size: var(--type-number-md-size);
  font-variant-numeric: tabular-nums lining-nums;
  line-height: var(--type-number-md-line);
  text-align: right;
}

@media (min-width: 768px) {
  .manual-item-row {
    gap: var(--space-sm);
  }

  .manual-item-row__price input {
    width: 5rem;
  }
}
</style>
