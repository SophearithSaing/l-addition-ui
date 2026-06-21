<script setup lang="ts">
import TotalRow from '@/components/common/TotalRow.vue'
import { TotalRowType } from '@/components/common/types/total-row'
import ReceiptQrCode from './ReceiptQrCode.vue'
import type { ClassicReceiptSummaryProps } from './types/classic-receipt-summary'

defineProps<ClassicReceiptSummaryProps>()
</script>

<template>
  <section
    class="receipt-summary"
    :class="{ 'receipt-summary--with-qr': qrCodeImageUrl }"
    aria-label="Receipt total summary"
  >
    <ReceiptQrCode v-if="qrCodeImageUrl" :image-url="qrCodeImageUrl" />
    <div class="receipt-summary__inner stack-sm">
      <TotalRow label="Subtotal" :value="formatCurrency(calculation.subtotal)" />
      <TotalRow label="Service" :value="formatCurrency(calculation.service)" />
      <TotalRow label="VAT" :value="formatCurrency(calculation.tax)" />
      <TotalRow
        v-if="calculation.adjustments > 0"
        label="Adjustments"
        :value="formatCurrency(calculation.adjustments)"
      />
      <TotalRow
        v-if="calculation.discount > 0"
        label="Discount"
        :value="`-${formatCurrency(calculation.discount)}`"
      />
      <TotalRow
        v-if="isRoundingEnabled"
        label="Rounding"
        :value="formatSignedCurrency(calculation.rounding)"
      />
      <TotalRow
        label="Grand Total"
        :value="formatCurrency(calculation.total)"
        :type="TotalRowType.GrandTotal"
      />
    </div>
  </section>
</template>

<style scoped>
.receipt-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--space-lg);
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent);
  padding-top: var(--space-lg);
}

.receipt-summary--with-qr {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.receipt-summary--with-qr .receipt-summary__inner {
  grid-column: 2;
}

.receipt-summary--with-qr .receipt-qr {
  width: calc(var(--space-2xl) * 4);
}

.receipt-summary__inner {
  width: min(100%, 420px);
}

@media (max-width: 767px) {
  .receipt-summary--with-qr {
    grid-template-columns: 1fr;
  }

  .receipt-summary--with-qr .receipt-summary__inner {
    grid-column: 1;
    grid-row: 1;
    width: 100%;
  }

  .receipt-summary--with-qr .receipt-qr {
    grid-row: 2;
    width: calc(var(--space-2xl) * 3);
    margin-top: var(--space-md);
  }
}
</style>
