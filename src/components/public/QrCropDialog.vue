<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

defineProps<{
  imageSrc: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  cancel: []
  confirm: [croppedDataUrl: string]
}>()

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)

/**
 * Extracts the cropped image and emits the result.
 */
function confirmCrop(): void {
  if (!cropperRef.value) {
    return
  }

  const { canvas } = cropperRef.value.getResult()

  if (!canvas) {
    return
  }

  emit('confirm', canvas.toDataURL('image/png'))
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="dialog-backdrop" role="presentation">
      <section
        class="dialog-panel dialog-panel--crop stack-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-crop-dialog-title"
      >
        <div class="stack-xs">
          <h2 id="qr-crop-dialog-title" class="type-headline-md text-primary">
            Adjust QR Code
          </h2>
          <p class="type-body-md text-muted">
            Make sure the QR code is fully visible. Drag, resize, or zoom to adjust.
          </p>
        </div>

        <div class="qr-crop-container">
          <Cropper
            ref="cropperRef"
            class="qr-crop-cropper"
            :src="imageSrc"
            :stencil-props="{ aspectRatio: 1 }"
            image-restriction="stencil"
          />
        </div>

        <div class="dialog-actions">
          <button
            class="button button--ghost"
            type="button"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            class="button button--primary"
            type="button"
            @click="confirmCrop"
          >
            Crop
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
