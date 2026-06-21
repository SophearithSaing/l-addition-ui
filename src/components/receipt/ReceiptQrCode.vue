<script setup lang="ts">
import type { ReceiptQrCodeProps } from './types/receipt-qr-code'

defineProps<ReceiptQrCodeProps>()
</script>

<template>
  <aside class="receipt-qr" aria-label="Payment QR code">
    <img :src="imageUrl" alt="Uploaded payment QR code" />
  </aside>
</template>

<style scoped>
.receipt-qr {
  width: calc(var(--space-2xl) * 2);
  aspect-ratio: 1;
  justify-self: center;
  border: var(--border-subtle);
  padding: var(--space-xs);
  background: var(--color-surface-container-lowest);
}

.receipt-qr img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
