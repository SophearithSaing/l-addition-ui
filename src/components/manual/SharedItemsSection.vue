<script setup lang="ts">
import InlineAction from '@/components/common/InlineAction.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import { SectionHeaderType } from '@/components/common/types/section-header'
import ManualItemRow from './ManualItemRow.vue'
import SharedParticipantSelector from './SharedParticipantSelector.vue'
import { ManualItemRowType } from './types/manual-item-row'
import type {
  SharedItemsSectionItem,
  SharedItemsSectionProps,
} from './types/shared-items-section'

defineProps<SharedItemsSectionProps>()

const emit = defineEmits<{
  'add-shared-item': []
  'amount-keydown': [event: KeyboardEvent]
  'remove-shared-item': [itemId: number]
  'toggle-participant': [item: SharedItemsSectionItem, dinerId: number]
}>()
</script>

<template>
  <section class="shared-items-section stack-md" aria-labelledby="shared-items-title">
    <SectionHeader
      title-id="shared-items-title"
      title="Shared Items"
      :type="SectionHeaderType.Baseline"
    >
      <template #actions>
        <InlineAction
          icon="add"
          text="Add Shared Item"
          @click="emit('add-shared-item')"
        />
      </template>
    </SectionHeader>

    <p v-if="sharedItems.length === 0" class="type-body-md text-muted">
      Add items that should be split across multiple diners.
    </p>

    <article
      v-for="item in sharedItems"
      :key="item.id"
      class="shared-items-section__card"
    >
      <ManualItemRow
        v-model:name="item.name"
        v-model:amount="item.amount"
        :currency-symbol="currencySymbol"
        name-placeholder="Shared item name"
        remove-label="Remove shared item"
        :type="ManualItemRowType.Active"
        @amount-keydown="emit('amount-keydown', $event)"
        @remove="emit('remove-shared-item', item.id)"
      />

      <SharedParticipantSelector
        :diners="diners"
        :participant-ids="item.participantIds"
        @toggle-participant="emit('toggle-participant', item, $event)"
      />
    </article>
  </section>
</template>

<style scoped>
.shared-items-section {
  margin-top: var(--space-md);
}

.shared-items-section__card {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  gap: var(--space-md);
  border: var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-sm);
  background: var(--color-surface);
  box-shadow: var(--shadow-ambient);
  transition: border-color var(--motion-smooth);
}

.shared-items-section__card:hover {
  border-color: var(--color-outline);
}

@media (min-width: 768px) {
  .shared-items-section__card {
    padding: var(--space-lg);
  }
}
</style>
