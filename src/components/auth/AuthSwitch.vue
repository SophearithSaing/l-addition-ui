<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { AuthSwitchProps } from './types/auth-switch'

defineProps<AuthSwitchProps>()
</script>

<template>
  <p class="auth-switch type-body-md text-muted">
    {{ prompt }}
    <RouterLink class="form-link" :to="to">{{ label }}</RouterLink>
  </p>
</template>

<style scoped>
.auth-switch {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
