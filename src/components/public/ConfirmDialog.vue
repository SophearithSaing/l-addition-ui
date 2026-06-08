<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  cancelLabel?: string
  confirmLabel?: string
  isOpen: boolean
  message: string
  title: string
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()
const titleId = computed(() => {
  return `${props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dialog-title`
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="dialog-backdrop" role="presentation">
      <section
        class="dialog-panel stack-md"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div class="stack-xs">
          <h2 :id="titleId" class="type-headline-md text-primary">
            {{ title }}
          </h2>
          <p class="type-body-md text-muted">{{ message }}</p>
        </div>

        <div class="dialog-actions">
          <button class="button button--ghost" type="button" @click="emit('cancel')">
            {{ cancelLabel || 'Cancel' }}
          </button>
          <button class="button button--primary" type="button" @click="emit('confirm')">
            {{ confirmLabel || 'Confirm' }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
