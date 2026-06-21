<script setup lang="ts">
import { ref } from 'vue'
import ReceiptQrCode from './ReceiptQrCode.vue'
import type {
  PolishedReceiptExpose,
  PolishedReceiptProps,
} from './types/polished-receipt'

defineProps<PolishedReceiptProps>()

const panelElement = ref<HTMLElement | null>(null)

/**
 * Gets the sign for an amount.
 *
 * @param amount Amount to inspect.
 * @returns Minus sign for negative amounts, otherwise plus sign.
 */
function getAmountSign(amount: number): string {
  if (amount < 0) {
    return '-'
  }

  return '+'
}

/**
 * Formats an absolute amount without a currency symbol.
 *
 * @param amount Amount to format.
 * @returns Absolute formatted amount label.
 */
function formatAbsoluteAmount(amount: number): string {
  return Math.abs(amount).toFixed(2)
}

/**
 * Gets the polished receipt panel element.
 *
 * @returns Polished receipt panel element, or null when unavailable.
 */
function getElement(): HTMLElement | null {
  return panelElement.value
}

defineExpose<PolishedReceiptExpose>({
  getElement,
})
</script>

<template>
  <article ref="panelElement" class="receipt-polished" aria-labelledby="polished-title">
    <header class="receipt-polished__header">
      <img class="receipt-polished__logo" src="/receipt-logo.png" alt="L'Addition" />
      <h2 id="polished-title" class="receipt-polished__title">
        {{ restaurantName || "L'Addition" }}
      </h2>
      <div class="receipt-polished__header-divider type-label text-muted">
        <span aria-hidden="true"></span>
        <span>{{ receiptDate }}</span>
        <span aria-hidden="true"></span>
      </div>
    </header>

    <section class="receipt-polished__guest-list" aria-label="Guest totals">
      <div class="receipt-polished__guest receipt-polished__guest--header">
        <span>Name</span>
        <span>Details</span>
        <span>Subtotal</span>
      </div>
      <article
        v-for="(diner, index) in calculation.diners"
        :key="diner.id"
        class="receipt-polished__guest"
      >
        <h3>{{ diner.name || `Diner ${index + 1}` }}</h3>
        <p>
          {{ diner.subtotal.toFixed(2) }}
          <span v-if="diner.fees !== 0" class="receipt-polished__detail-adjustment">
            <span>{{ getAmountSign(diner.fees) }}</span>
            <span>{{ formatAbsoluteAmount(diner.fees) }}</span>
          </span>
          <span v-if="isRoundingEnabled" class="receipt-polished__detail-adjustment">
            <span>{{ getAmountSign(diner.rounding) }}</span>
            <span>{{ formatAbsoluteAmount(diner.rounding) }}</span>
          </span>
        </p>
        <strong>{{ formatCurrency(diner.total) }}</strong>
      </article>
    </section>

    <section class="receipt-polished__summary" aria-label="Receipt summary">
      <div>
        <span>Subtotal</span>
        <strong>{{ formatCurrency(calculation.subtotal) }}</strong>
      </div>
      <div>
        <span>Service &amp; VAT</span>
        <strong>{{ formatCurrency(calculation.service + calculation.tax) }}</strong>
      </div>
      <div v-if="calculation.adjustments > 0">
        <span>Adjustments</span>
        <strong>{{ formatCurrency(calculation.adjustments) }}</strong>
      </div>
      <div v-if="calculation.discount > 0">
        <span>Discount</span>
        <strong>-{{ formatCurrency(calculation.discount) }}</strong>
      </div>
      <div v-if="isRoundingEnabled">
        <span>Rounding</span>
        <strong>{{ formatSignedCurrency(calculation.rounding) }}</strong>
      </div>
    </section>

    <div
      class="receipt-polished__settlement"
      :class="{ 'receipt-polished__settlement--with-qr': qrCodeImageUrl }"
    >
      <ReceiptQrCode v-if="qrCodeImageUrl" :image-url="qrCodeImageUrl" />

      <section class="receipt-polished__hero" aria-label="Grand total">
        <span class="receipt-polished__hero-label">Grand Total</span>
        <strong>{{ formatCurrency(calculation.total) }}</strong>
      </section>
    </div>

    <footer class="receipt-polished__footer">
      <span aria-hidden="true"></span>
      <p>L'Addition</p>
      <span aria-hidden="true"></span>
    </footer>
  </article>
</template>

<style scoped>
.receipt-polished {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 640px;
  margin: 0;
  flex-direction: column;
  gap: var(--space-lg);
  border: 0;
  border-radius: calc(var(--radius-xl) + var(--space-sm));
  padding: calc(var(--space-xl) + var(--space-xs));
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-elevated);
}

.receipt-polished::before,
.receipt-polished::after {
  position: absolute;
  border: 1px solid var(--color-secondary);
  border-radius: var(--radius-xl);
  content: '';
  pointer-events: none;
}

.receipt-polished::before {
  inset: var(--space-md);
}

.receipt-polished::after {
  inset: calc(var(--space-md) + var(--space-xs));
  opacity: 0.72;
}

.receipt-polished > * {
  position: relative;
  z-index: 1;
}

.receipt-polished__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  text-align: center;
}

.receipt-polished__logo {
  width: calc(var(--space-2xl) + var(--space-lg));
  height: calc(var(--space-2xl) + var(--space-lg));
  object-fit: contain;
}

.receipt-polished__hero-label,
.receipt-polished__footer p {
  color: var(--color-secondary);
  font-family: var(--font-body);
  font-size: var(--type-label-sm-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-sm-line);
  letter-spacing: var(--type-label-md-tracking);
  text-transform: uppercase;
}

.receipt-polished__title {
  max-width: 100%;
  color: var(--color-on-surface);
  font-family: var(--font-display);
  font-size: var(--type-headline-lg-mobile-size);
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-headline-lg-mobile-line);
  overflow-wrap: anywhere;
}

.receipt-polished__header-divider {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-size: var(--type-label-sm-size);
  line-height: var(--type-label-sm-line);
}

.receipt-polished__header-divider span[aria-hidden='true'] {
  display: none;
}

.receipt-polished__hero {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-xs);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  background:
    radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--color-secondary-fixed) 38%, transparent),
      transparent 48%
    ),
    var(--color-surface-container-low);
}

.receipt-polished__hero strong {
  color: var(--color-on-surface);
  font-family: var(--font-body);
  font-size: var(--type-number-xl-size);
  font-weight: var(--type-number-xl-weight);
  font-variant-numeric: tabular-nums;
  line-height: var(--type-number-xl-line);
  letter-spacing: var(--type-number-xl-tracking);
}

.receipt-polished__guest-list {
  display: grid;
}

.receipt-polished__guest {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 1fr);
  align-items: baseline;
  gap: var(--space-sm);
  border-bottom: 1px dotted var(--color-secondary-fixed-dim);
  padding-block: var(--space-sm);
}

.receipt-polished__guest--header {
  border-bottom: 1px solid var(--color-secondary);
  padding-top: 0;
  color: var(--color-secondary);
  font-family: var(--font-body);
  font-size: var(--type-label-sm-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-sm-line);
  letter-spacing: var(--type-label-md-tracking);
  text-transform: uppercase;
}

.receipt-polished__guest--header span:nth-child(2),
.receipt-polished__guest p {
  text-align: center;
}

.receipt-polished__guest--header span:last-child,
.receipt-polished__guest strong {
  text-align: right;
}

.receipt-polished__guest h3 {
  color: var(--color-on-surface);
  font-family: var(--font-display);
  font-size: var(--type-headline-sm-size);
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-headline-sm-line);
  overflow-wrap: anywhere;
}

.receipt-polished__guest p {
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-xs);
  color: var(--color-on-surface-variant);
  font-size: var(--type-body-sm-size);
  font-variant-numeric: tabular-nums;
  line-height: var(--type-body-sm-line);
  white-space: nowrap;
}

.receipt-polished__detail-adjustment {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2xs);
}

.receipt-polished__guest strong,
.receipt-polished__summary strong {
  color: var(--color-on-surface);
  font-variant-numeric: tabular-nums;
}

.receipt-polished__settlement {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.receipt-polished__settlement--with-qr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.receipt-polished__settlement--with-qr .receipt-qr {
  order: 2;
}

.receipt-polished__settlement--with-qr .receipt-polished__hero {
  flex: 1;
}

.receipt-polished__summary {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: var(--space-xs);
  border-radius: var(--radius-xl);
  padding: var(--space-sm);
  background: var(--color-surface-container-low);
}

.receipt-polished__summary div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  color: var(--color-on-surface-variant);
  font-size: var(--type-body-sm-size);
  line-height: var(--type-body-sm-line);
}

.receipt-polished__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  text-align: center;
}

.receipt-polished__footer span {
  height: 1px;
  flex: 1;
  background: var(--color-secondary);
}

.receipt-polished__footer p {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--color-surface-container-lowest);
  color: var(--color-secondary);
  font-family: var(--font-display);
  font-size: var(--type-label-sm-size);
  font-style: italic;
  font-weight: var(--type-headline-md-weight);
  letter-spacing: 0;
  text-transform: none;
  white-space: nowrap;
}

.receipt-polished__footer p::before,
.receipt-polished__footer p::after {
  color: var(--color-secondary);
  content: '✦';
  font-family: var(--font-body);
  font-size: var(--type-label-sm-size);
  font-style: normal;
  line-height: var(--type-label-sm-line);
}

@media (max-width: 767px) {
  .receipt-polished__guest {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .receipt-polished__guest--header span:nth-child(2),
  .receipt-polished__guest p {
    display: none;
  }

  .receipt-polished__settlement {
    min-width: 0;
  }

  .receipt-polished__settlement--with-qr {
    flex-direction: column;
  }

  .receipt-polished__settlement .receipt-polished__hero {
    min-width: 0;
    width: 100%;
    padding: var(--space-sm);
  }

  .receipt-polished__settlement .receipt-polished__hero strong {
    max-width: 100%;
    font-size: var(--type-headline-lg-mobile-size);
    line-height: var(--type-headline-lg-mobile-line);
    overflow-wrap: anywhere;
  }

  .receipt-polished__settlement--with-qr .receipt-polished__hero {
    order: 1;
    text-align: center;
  }

  .receipt-polished__settlement--with-qr .receipt-qr {
    order: 2;
    width: calc(var(--space-2xl) * 1.5);
  }
}
</style>
