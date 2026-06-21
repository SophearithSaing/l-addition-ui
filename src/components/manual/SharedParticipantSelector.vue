<script setup lang="ts">
import type {
  SharedParticipantSelectorDiner,
  SharedParticipantSelectorProps,
} from './types/shared-participant-selector'

defineProps<SharedParticipantSelectorProps>()

const emit = defineEmits<{
  'toggle-participant': [dinerId: number]
}>()

/**
 * Gets a diner display label.
 *
 * @param diner Diner to label.
 * @param index Diner index.
 * @returns Diner name, or fallback label.
 */
function getDinerLabel(
  diner: SharedParticipantSelectorDiner,
  index: number,
): string {
  return diner.name.trim() || `Diner ${index + 1}`
}
</script>

<template>
  <div class="stack-xs">
    <p class="shared-participant-selector__label type-label text-muted">
      Participating Diners
    </p>
    <p v-if="diners.length === 0" class="type-body-md text-muted">
      Add diners to choose who participates.
    </p>
    <div v-else class="shared-participant-selector__list">
      <button
        v-for="(diner, index) in diners"
        :key="diner.id"
        class="shared-participant-selector__option"
        :class="{
          'shared-participant-selector__option--active':
            participantIds.includes(diner.id),
        }"
        type="button"
        @click="emit('toggle-participant', diner.id)"
      >
        {{ getDinerLabel(diner, index) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.shared-participant-selector__label {
  font-size: var(--type-label-sm-size);
  line-height: var(--type-label-sm-line);
}

.shared-participant-selector__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.shared-participant-selector__option {
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xs) var(--space-sm);
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: var(--type-label-sm-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-sm-line);
  opacity: 0.5;
  text-transform: uppercase;
  transition:
    background var(--motion-smooth),
    color var(--motion-smooth),
    opacity var(--motion-smooth);
}

.shared-participant-selector__option--active {
  opacity: 1;
}
</style>
