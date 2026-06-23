<script setup lang="ts">
import { ref } from 'vue'
import InlineAction from '@/components/common/InlineAction.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import { SectionHeaderLevel, SectionHeaderType } from '@/components/common/types/section-header'
import ClassicReceiptDinerCard from './ClassicReceiptDinerCard.vue'
import ClassicReceiptSummary from './ClassicReceiptSummary.vue'
import type {
  ClassicReceiptEmits,
  ClassicReceiptExpose,
  ClassicReceiptProps,
} from './types/classic-receipt'

const props = defineProps<ClassicReceiptProps>()

const emit = defineEmits<ClassicReceiptEmits>()
const panelElement = ref<HTMLElement | null>(null)

/**
 * Gets whether a diner breakdown is expanded.
 *
 * @param dinerId Diner id to check.
 * @returns Whether the diner is expanded.
 */
function isDinerExpanded(dinerId: number): boolean {
  return props.expandedDinerIds.includes(dinerId)
}

/**
 * Gets the classic receipt panel element.
 *
 * @returns Classic receipt panel element, or null when unavailable.
 */
function getElement(): HTMLElement | null {
  return panelElement.value
}

defineExpose<ClassicReceiptExpose>({
  getElement,
})
</script>

<template>
  <article ref="panelElement" class="receipt-panel" aria-labelledby="receipt-title">
    <header class="receipt-panel__header stack-sm">
      <img class="receipt-panel__logo" src="/l-addition-logo.png" alt="L'Addition" />
      <h2 id="receipt-title" class="type-display-lg text-primary">
        {{ restaurantName || "L'Addition Receipt" }}
      </h2>
      <div class="receipt-panel__meta type-label text-muted">
        <span>{{ receiptDate }}</span>
      </div>
    </header>

    <section class="receipt-section stack-md" aria-labelledby="receipt-breakdown-title">
      <SectionHeader
        title-id="receipt-breakdown-title"
        title="Guest Breakdown"
        :level="SectionHeaderLevel.Three"
        :type="SectionHeaderType.Receipt"
      >
        <template #actions>
          <InlineAction
            :text="areAllDinersExpanded ? 'Collapse All' : 'Expand All'"
            @click="emit('toggle-all-diners')"
          />
        </template>
      </SectionHeader>

      <div class="receipt-diner-grid">
        <ClassicReceiptDinerCard
          v-for="(diner, index) in calculation.diners"
          :key="diner.id"
          :diner="diner"
          :diner-index="index"
          :format-currency="formatCurrency"
          :format-signed-currency="formatSignedCurrency"
          :is-expanded="isDinerExpanded(diner.id)"
          :is-rounding-enabled="isRoundingEnabled"
          @toggle="emit('toggle-diner', $event)"
        />
      </div>
    </section>

    <ClassicReceiptSummary
      :calculation="calculation"
      :format-currency="formatCurrency"
      :format-signed-currency="formatSignedCurrency"
      :is-rounding-enabled="isRoundingEnabled"
      :qr-code-image-url="qrCodeImageUrl"
    />

    <footer class="receipt-signature">
      <span aria-hidden="true"></span>
      <p>L'Addition</p>
      <span aria-hidden="true"></span>
    </footer>
  </article>
</template>

<style scoped>
.receipt-panel {
  position: relative;
  width: min(100%, 1000px);
  margin: 0 auto var(--space-sm);
  border: 1px solid color-mix(in srgb, var(--color-outline-variant) 45%, transparent);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: var(--space-md) var(--space-sm);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-surface) 92%, var(--color-secondary-fixed)),
    var(--color-surface-container-lowest)
  );
  box-shadow: var(--shadow-elevated);
}

.receipt-panel__header {
  min-width: 0;
  align-items: center;
  margin-bottom: var(--space-2xl);
  text-align: center;
}

.receipt-panel__logo {
  width: calc(var(--space-2xl) * 2);
  height: calc(var(--space-2xl) * 2);
  object-fit: contain;
}

.receipt-panel__header h2 {
  max-width: 100%;
  overflow-wrap: anywhere;
}

.receipt-panel__meta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
}

.receipt-panel__meta span[aria-hidden='true'] {
  width: var(--space-2xs);
  height: var(--space-2xs);
  border-radius: var(--radius-pill);
  background: var(--color-outline-variant);
}

.receipt-section {
  margin-bottom: var(--space-2xl);
}

.receipt-diner-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl) var(--space-2xl);
}

.receipt-signature {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-xl);
  text-align: center;
}

.receipt-signature > span {
  height: 1px;
  flex: 1;
  background: var(--color-secondary);
}

.receipt-signature p {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-secondary);
  font-family: var(--font-display);
  font-size: var(--type-headline-sm-size);
  font-style: italic;
  line-height: var(--type-headline-sm-line);
  white-space: nowrap;
}

.receipt-signature p::before,
.receipt-signature p::after {
  color: var(--color-secondary);
  content: '✦';
  font-family: var(--font-body);
  font-size: var(--type-label-sm-size);
  font-style: normal;
  line-height: var(--type-label-sm-line);
}

@media (min-width: 768px) {
  .receipt-panel {
    padding: var(--space-2xl);
  }

  .receipt-diner-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .receipt-diner-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
