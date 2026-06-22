<script setup lang="ts">
import type { ReceiptActionsEmits, ReceiptActionsProps } from './types/receipt-actions'

defineProps<ReceiptActionsProps>()

const emit = defineEmits<ReceiptActionsEmits>()
</script>

<template>
  <div class="receipt-actions">
    <label class="button button--outline receipt-actions__qr-upload">
      Upload QR Code
      <span class="material-symbols-outlined" aria-hidden="true">qr_code_2</span>
      <input accept="image/*" type="file" @change="emit('upload-qr', $event)" />
    </label>
    <button v-if="hasQrCode" class="button button--ghost" type="button" @click="emit('remove-qr')">
      Remove QR
      <span class="material-symbols-outlined" aria-hidden="true">close</span>
    </button>
    <button
      class="button button--outline"
      type="button"
      :disabled="isDownloading"
      @click="emit('download')"
    >
      {{ isDownloading ? 'Preparing Image…' : 'Download Image' }}
      <span class="material-symbols-outlined" aria-hidden="true">download</span>
    </button>
  </div>
</template>

<style scoped>
.receipt-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

.receipt-actions__qr-upload {
  cursor: pointer;
}

.receipt-actions__qr-upload input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
