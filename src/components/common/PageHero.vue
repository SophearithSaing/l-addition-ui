<script setup lang="ts">
import { PageHeroType, type PageHeroProps } from './types/page-hero'

withDefaults(defineProps<PageHeroProps>(), {
  description: undefined,
  eyebrow: undefined,
  type: PageHeroType.Standard,
})
</script>

<template>
  <section class="page-hero stack-sm" :class="`page-hero--${type}`" :aria-labelledby="titleId">
    <div v-if="eyebrow" class="page-hero__eyebrow">
      <span aria-hidden="true"></span>
      {{ eyebrow }}
      <span aria-hidden="true"></span>
    </div>

    <h1 :id="titleId" class="type-display-lg text-primary">{{ title }}</h1>

    <p v-if="description" class="page-hero__description">
      {{ description }}
    </p>
  </section>
</template>

<style scoped>
.page-hero {
  align-items: center;
  margin-bottom: var(--space-xl);
  text-align: center;
}

.page-hero--home {
  max-width: var(--container-reading);
  margin-bottom: 0;
}

.page-hero__description {
  max-width: var(--container-reading);
  color: var(--color-on-surface-variant);
  font-family: var(--font-body);
  font-size: var(--type-body-lg-size);
  font-weight: 400;
  line-height: var(--type-body-lg-line);
}

.page-hero--home .page-hero__description {
  max-width: var(--container-reading);
  font-size: var(--type-body-md-size);
  line-height: var(--type-body-md-line);
}

.page-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  color: var(--color-on-surface-variant);
  font-family: var(--font-body);
  font-size: var(--type-label-md-size);
  font-weight: var(--type-label-md-weight);
  line-height: var(--type-label-md-line);
  letter-spacing: var(--type-label-md-tracking);
  text-transform: uppercase;
}

.page-hero__eyebrow span {
  width: var(--space-lg);
  height: 1px;
  background: var(--color-outline-variant);
}
</style>
