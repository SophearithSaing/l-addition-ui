<script setup lang="ts">
import InlineAction from '@/components/common/InlineAction.vue'
import { InlineActionType } from '@/components/common/types/inline-action'
import TotalRow from '@/components/common/TotalRow.vue'
import { TotalRowType } from '@/components/common/types/total-row'
import AdjustmentRow from './AdjustmentRow.vue'
import DiscountControl from './DiscountControl.vue'
import SwitchControl from './SwitchControl.vue'
import type { ManualSummaryPanelEmits, ManualSummaryPanelProps } from './types/manual-summary-panel'

defineProps<ManualSummaryPanelProps>()

const emit = defineEmits<ManualSummaryPanelEmits>()

/**
 * Emits the current input value as the service charge.
 *
 * @param event Input event from the service charge field.
 */
function updateServiceCharge(event: Event): void {
  emit('update:serviceCharge', (event.target as HTMLInputElement).value)
}

/**
 * Emits the current input value as the tax rate.
 *
 * @param event Input event from the tax rate field.
 */
function updateTaxRate(event: Event): void {
  emit('update:taxRate', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <aside class="manual-summary stack-lg" aria-label="Bill summary">
    <section class="stack-md">
      <h2 class="type-label text-muted">Adjustments</h2>
      <label class="summary-input-row">
        <span>Service Charge</span>
        <span>
          <input
            :value="serviceCharge"
            inputmode="decimal"
            min="0"
            placeholder="0"
            step="0.01"
            type="number"
            @input="updateServiceCharge"
            @keydown="emit('amount-keydown', $event)"
          />%
        </span>
      </label>
      <label class="summary-input-row">
        <span>VAT</span>
        <span>
          <input
            :value="taxRate"
            inputmode="decimal"
            min="0"
            placeholder="0"
            step="0.01"
            type="number"
            @input="updateTaxRate"
            @keydown="emit('amount-keydown', $event)"
          />%
        </span>
      </label>
      <div class="summary-input-row">
        <span>Discount</span>
        <DiscountControl
          :discount="discount"
          :discount-unit="discountUnit"
          :currency-symbol="currencySymbol"
          @update:discount="emit('update:discount', $event)"
          @update:discount-unit="emit('update:discountUnit', $event)"
          @amount-keydown="emit('amount-keydown', $event)"
        />
      </div>
      <AdjustmentRow
        v-for="adjustment in adjustments"
        :key="adjustment.id"
        v-model:label="adjustment.label"
        v-model:amount="adjustment.amount"
        :currency-symbol="currencySymbol"
        @amount-keydown="emit('amount-keydown', $event)"
        @remove="emit('remove-adjustment', adjustment.id)"
      />
      <InlineAction
        icon="add"
        text="Add Adjustment"
        :type="InlineActionType.Muted"
        @click="emit('add-adjustment')"
      />
      <label class="summary-toggle-row summary-toggle-row--switch">
        <span>Round Totals</span>
        <SwitchControl
          :model-value="isRoundingEnabled"
          :detail="`Nearest ${currencySymbol}`"
          @update:model-value="emit('update:isRoundingEnabled', $event)"
        />
      </label>
    </section>

    <section class="stack-sm">
      <TotalRow label="Subtotal" :value="subtotal" />
      <TotalRow label="VAT &amp; Fees" :value="taxAndFees" />
      <TotalRow
        v-if="additionalAdjustmentsTotal"
        label="Adjustments"
        :value="additionalAdjustmentsTotal"
      />
      <TotalRow label="Total" :value="total" :type="TotalRowType.Total" />
    </section>

    <div class="manual-summary__actions">
      <button
        class="button button--primary manual-summary__action"
        type="button"
        :disabled="!hasItems"
        @click="emit('generate-receipt')"
      >
        Generate Receipt
        <span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>
      </button>
      <button
        class="button button--outline manual-summary__action"
        type="button"
        :disabled="!hasBillData"
        @click="emit('clear-bill')"
      >
        Clear
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.manual-summary {
  min-width: 0;
  border: var(--border-subtle);
  padding: var(--space-sm);
  background: var(--color-surface-container-low);
}

.summary-input-row {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  border-bottom: var(--border-subtle);
  color: var(--color-on-surface);
  padding-block: var(--space-xs);
}

.summary-input-row input {
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

.summary-input-row input:focus {
  outline: none;
}

.summary-input-row span:last-child {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  color: var(--color-on-surface-variant);
}

.summary-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  border-bottom: var(--border-subtle);
  color: var(--color-on-surface);
  padding-block: var(--space-xs);
}

.summary-toggle-row > span:first-child {
  font-size: var(--type-body-md-size);
  line-height: var(--type-body-md-line);
}

.manual-summary__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.manual-summary__action {
  width: 100%;
}

@media (min-width: 768px) {
  .manual-summary {
    padding: var(--space-lg);
  }

  .summary-input-row {
    gap: var(--space-sm);
  }

  .summary-input-row input {
    width: 5rem;
  }
}

@media (min-width: 1024px) {
  .manual-summary {
    position: sticky;
    top: calc(var(--top-bar-height) + var(--space-lg));
  }
}
</style>
