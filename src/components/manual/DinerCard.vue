<script setup lang="ts">
import InlineAction from '@/components/common/InlineAction.vue'
import ManualItemRow from './ManualItemRow.vue'
import type { DinerCardProps } from './types/diner-card'

withDefaults(defineProps<DinerCardProps>(), {
  itemRowType: undefined,
})

const emit = defineEmits<{
  'amount-keydown': [event: KeyboardEvent]
  'add-item': []
  'remove-diner': []
  'remove-item': [itemId: number]
}>()
</script>

<template>
  <article class="diner-card">
    <div class="diner-card__header split-row">
      <label class="quiet-field diner-card__name">
        <span class="field__label">Diner Name</span>
        <input
          v-model="diner.name"
          class="input input--stationery type-headline-md"
          placeholder="Enter name..."
        />
      </label>
      <button
        class="button button--ghost button--icon"
        type="button"
        aria-label="Remove diner"
        @click="emit('remove-diner')"
      >
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>

    <div class="stack-sm">
      <p v-if="diner.items.length === 0" class="type-body-md text-muted">
        No items assigned to this diner yet.
      </p>

      <ManualItemRow
        v-for="item in diner.items"
        :key="item.id"
        v-model:name="item.name"
        v-model:amount="item.amount"
        :currency-symbol="currencySymbol"
        name-placeholder="Item name"
        remove-label="Remove item"
        :type="itemRowType"
        @amount-keydown="emit('amount-keydown', $event)"
        @remove="emit('remove-item', item.id)"
      />

      <InlineAction icon="add" text="Add Item" @click="emit('add-item')" />
    </div>
  </article>
</template>

<style scoped>
.diner-card {
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

.diner-card:hover {
  border-color: var(--color-outline);
}

.diner-card__header {
  flex-wrap: nowrap;
  align-items: flex-end;
}

.diner-card__name {
  min-width: 0;
  flex: 1 1 auto;
}

@media (min-width: 768px) {
  .diner-card {
    padding: var(--space-lg);
  }
}
</style>
