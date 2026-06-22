<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  void authStore.loadSession()
})

/**
 * Logs out the active user and returns to the public home page.
 */
async function handleLogout(): Promise<void> {
  await authStore.logout()
  await router.push('/')
}
</script>

<template>
  <header class="public-header">
    <nav class="public-nav app-container" aria-label="Primary navigation">
      <RouterLink class="public-brand" to="/">L'Addition</RouterLink>

      <div class="public-nav__links cluster">
        <RouterLink class="public-header-link type-label" to="/design-system/philosophy">
          Design System
        </RouterLink>
        <span class="public-nav__divider" aria-hidden="true"></span>
        <button
          v-if="authStore.isAuthenticated"
          class="public-header-link type-label"
          type="button"
          @click="handleLogout"
        >
          Log out
        </button>
        <template v-else>
          <RouterLink class="public-header-link type-label" to="/login"> Log in </RouterLink>
          <RouterLink class="button button--gold-leaf button--compact" to="/sign-up">
            Sign up
          </RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.public-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: var(--border-subtle);
  background: var(--color-surface);
}

.public-nav {
  min-height: var(--top-bar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.public-nav__links {
  justify-content: flex-end;
}

.public-nav__divider {
  width: 1px;
  align-self: stretch;
  background: var(--color-outline-variant);
}

.public-brand {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: var(--type-headline-md-size);
  font-style: italic;
  font-weight: var(--type-headline-md-weight);
  line-height: var(--type-headline-md-line);
  text-decoration: none;
}

.public-header-link {
  border: 0;
  background: transparent;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  text-decoration: none;
  transition:
    color var(--motion-smooth),
    opacity var(--motion-smooth);
}

.public-header-link:hover {
  color: var(--color-primary);
}
</style>
