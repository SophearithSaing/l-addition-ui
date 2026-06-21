<script setup lang="ts">
import type { UploadZoneProps } from './types/upload-zone'

defineProps<UploadZoneProps>()

const emit = defineEmits<{
  change: [event: Event]
}>()
</script>

<template>
  <label class="upload-zone" :for="inputId">
    <span class="upload-zone__glow" aria-hidden="true"></span>
    <span class="material-symbols-outlined upload-zone__icon" aria-hidden="true">
      {{ icon }}
    </span>
    <span class="type-label text-primary">{{ title }}</span>
    <span class="type-body-md text-muted">{{ helperText }}</span>
    <span class="upload-zone__action type-label">{{ actionLabel }}</span>
    <input
      :id="inputId"
      class="upload-zone__input"
      :accept="accept"
      type="file"
      @change="emit('change', $event)"
    />
  </label>
</template>

<style scoped>
.upload-zone {
  position: relative;
  display: flex;
  min-height: calc(var(--space-2xl) * 5);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  gap: var(--space-sm);
  margin-bottom: var(--space-section);
  border: 2px dashed var(--color-outline-variant);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  background:
    radial-gradient(rgb(68 71 72 / 3%) 1px, transparent 1px), var(--color-surface-container-low);
  background-size: var(--space-sm) var(--space-sm);
  cursor: pointer;
  text-align: center;
  transition:
    border-color var(--motion-smooth),
    background var(--motion-smooth);
}

.upload-zone:hover {
  border-color: var(--color-outline);
}

.upload-zone__glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, var(--color-surface-variant));
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--motion-smooth);
}

.upload-zone:hover .upload-zone__glow {
  opacity: 0.1;
}

.upload-zone__icon {
  color: var(--color-outline);
  font-size: var(--space-2xl);
  line-height: 1;
  transition: color var(--motion-smooth);
}

.upload-zone:hover .upload-zone__icon,
.upload-zone__action {
  color: var(--color-secondary);
}

.upload-zone__action {
  border-bottom: 1px solid currentColor;
  padding-bottom: var(--space-2xs);
}

.upload-zone__input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
