<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { AuthShellProps } from './types/auth-shell'

defineProps<AuthShellProps>()
</script>

<template>
  <main class="auth-shell surface-page">
    <section class="auth-shell__content stack-lg" aria-labelledby="auth-title">
      <RouterLink class="auth-shell__brand type-headline-md text-primary" to="/">
        L'Addition
      </RouterLink>

      <article class="auth-shell__card surface-panel surface-ambient stack-lg">
        <header class="auth-shell__header stack-xs">
          <h1 id="auth-title" class="type-headline-lg text-primary">
            {{ title }}
          </h1>
          <p class="type-body-md text-muted">
            {{ description }}
          </p>
        </header>

        <slot />
      </article>
    </section>
  </main>
</template>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-container-mobile);
}

.auth-shell__content {
  width: min(100%, var(--container-auth));
  align-items: center;
}

.auth-shell__brand {
  text-decoration: none;
}

.auth-shell__card {
  width: 100%;
  padding: var(--space-lg);
}

.auth-shell__header {
  align-items: center;
  text-align: center;
}

@media (min-width: 768px) {
  .auth-shell {
    padding: var(--space-container-desktop);
  }

  .auth-shell__card {
    padding: var(--space-xl);
  }
}
</style>
