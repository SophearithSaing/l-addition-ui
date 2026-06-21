<script setup lang="ts">
import { ref } from 'vue'
import type {
  ReceiptExportFrameExpose,
  ReceiptExportFrameProps,
} from './types/receipt-export-frame'

defineProps<ReceiptExportFrameProps>()

const frameElement = ref<HTMLElement | null>(null)

/**
 * Gets the receipt export frame element.
 *
 * @returns Receipt export frame element, or null when unavailable.
 */
function getElement(): HTMLElement | null {
  return frameElement.value
}

defineExpose<ReceiptExportFrameExpose>({
  getElement,
})
</script>

<template>
  <div
    ref="frameElement"
    class="receipt-export-frame"
    :class="{ 'receipt-export-frame--polished': isPolished }"
  >
    <slot />
  </div>
</template>

<style scoped>
.receipt-export-frame {
  width: min(100%, 1120px);
  margin: var(--space-md) auto 0;
  overflow: hidden;
  padding: var(--space-sm) var(--space-sm) var(--space-lg);
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-secondary-fixed) 18%, transparent),
      transparent 42%
    ),
    var(--color-surface-container-low);
}

.receipt-export-frame--polished {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 760px;
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--color-secondary-fixed) 34%, transparent),
      transparent 48%
    ),
    var(--color-surface-container-highest);
}

@media (min-width: 768px) {
  .receipt-export-frame {
    padding: var(--space-xl) var(--space-xl) var(--space-2xl);
  }
}
</style>
