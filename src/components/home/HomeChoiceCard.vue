<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  HomeChoiceCardType,
  type HomeChoiceCardProps,
} from './types/home-choice-card'

withDefaults(defineProps<HomeChoiceCardProps>(), {
  disabled: false,
  to: undefined,
  type: HomeChoiceCardType.Default,
})
</script>

<template>
  <component
    :is="to && !disabled ? RouterLink : 'div'"
    class="home-choice-card"
    :class="{
      'home-choice-card--disabled': disabled,
      'home-choice-card--scan': type === HomeChoiceCardType.Scan,
    }"
    :to="to && !disabled ? to : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <span
      v-if="type === HomeChoiceCardType.Scan"
      class="home-choice-card__glow"
      aria-hidden="true"
    ></span>
    <span class="home-choice-card__icon" aria-hidden="true">
      <span class="material-symbols-outlined icon-lg">{{ icon }}</span>
    </span>
    <span class="home-choice-card__copy stack-xs">
      <span class="type-body-lg text-primary">{{ title }}</span>
      <span class="type-body-md text-muted">{{ description }}</span>
    </span>
  </component>
</template>

<style scoped>
.home-choice-card {
  position: relative;
  display: flex;
  flex: 1;
  min-height: calc((var(--space-2xl) * 4) + var(--space-md));
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  gap: var(--space-md);
  border: var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  background: var(--color-surface-container-lowest);
  color: inherit;
  text-align: center;
  text-decoration: none;
  transition:
    background var(--motion-smooth),
    border-color var(--motion-smooth),
    box-shadow var(--motion-smooth);
}

.home-choice-card--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.home-choice-card--scan {
  border-width: 2px;
  border-style: dashed;
}

.home-choice-card:hover {
  border-color: var(--color-outline);
  box-shadow: var(--shadow-ambient);
}

.home-choice-card__glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, var(--color-surface-variant));
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--motion-smooth);
}

.home-choice-card:hover .home-choice-card__glow {
  opacity: 0.1;
}

.home-choice-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-2xl);
  height: var(--space-2xl);
  border-radius: var(--radius-pill);
  background: var(--color-surface-container);
  color: var(--color-on-surface-variant);
  transition:
    color var(--motion-smooth),
    transform var(--motion-smooth);
}

.home-choice-card:hover .home-choice-card__icon {
  color: var(--color-primary);
  transform: scale(1.1);
}

.home-choice-card__copy {
  position: relative;
  z-index: 1;
  align-items: center;
}
</style>
