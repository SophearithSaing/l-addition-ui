<script setup lang="ts">
import EmptyState from '@/components/common/EmptyState.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import DinerCard from './DinerCard.vue'
import type { DinerCardDiner } from './types/diner-card'
import type { DinerSectionProps } from './types/diner-section'

defineProps<DinerSectionProps>()

const emit = defineEmits<{
  'add-diner': []
  'add-item': [diner: DinerCardDiner]
  'amount-keydown': [event: KeyboardEvent]
  'remove-diner': [dinerId: number]
  'remove-item': [diner: DinerCardDiner, itemId: number]
  'remove-last-diner': []
}>()
</script>

<template>
  <SectionHeader title-id="diners-title" title="Diners">
    <template #actions>
      <button
        class="button button--outline button--icon"
        type="button"
        aria-label="Remove last diner"
        :disabled="diners.length === 0"
        @click="emit('remove-last-diner')"
      >
        <span class="material-symbols-outlined" aria-hidden="true">remove</span>
      </button>
      <button
        class="button button--primary button--icon"
        type="button"
        aria-label="Add diner"
        @click="emit('add-diner')"
      >
        <span class="material-symbols-outlined" aria-hidden="true">add</span>
      </button>
    </template>
  </SectionHeader>

  <EmptyState
    v-if="diners.length === 0"
    icon="group_add"
    title="No diners yet"
    message="Add a diner to begin entering items and building the split."
    action-label="Add Diner"
    @action="emit('add-diner')"
  />

  <DinerCard
    v-for="diner in diners"
    :key="diner.id"
    :diner="diner"
    :currency-symbol="currencySymbol"
    @amount-keydown="emit('amount-keydown', $event)"
    @add-item="emit('add-item', diner)"
    @remove-item="emit('remove-item', diner, $event)"
    @remove-diner="emit('remove-diner', diner.id)"
  />
</template>
