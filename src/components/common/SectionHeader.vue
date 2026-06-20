<script setup lang="ts">
import {
  SectionHeaderLevel,
  SectionHeaderType,
  type SectionHeaderProps,
} from './types/section-header'

withDefaults(defineProps<SectionHeaderProps>(), {
  level: SectionHeaderLevel.Two,
  type: SectionHeaderType.Default,
})
</script>

<template>
  <header class="section-header" :class="`section-header--${type}`">
    <component :is="level" :id="titleId" class="section-header__title">
      {{ title }}
    </component>

    <div v-if="$slots.actions" class="section-header__actions">
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<style scoped>
.section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  border-bottom: var(--border-subtle);
  padding-bottom: var(--space-sm);
}

.section-header--baseline,
.section-header--receipt {
  align-items: baseline;
}

.section-header--receipt {
  gap: var(--space-sm);
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent);
}

.section-header__title {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: var(--type-headline-md-size);
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-headline-md-line);
}

.section-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
}
</style>
