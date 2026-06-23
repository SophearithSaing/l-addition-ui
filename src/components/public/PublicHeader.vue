<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

/**
 * Toggles the mobile navigation menu.
 */
function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value
}

/**
 * Closes the mobile navigation menu.
 */
function closeMenu(): void {
  isMenuOpen.value = false
}

/**
 * Logs out the active user and returns to the public home page.
 */
async function handleLogout(): Promise<void> {
  closeMenu()
  await authStore.logout()
  await router.push('/')
}
</script>

<template>
  <header class="public-header">
    <nav class="public-nav app-container" aria-label="Primary navigation">
      <RouterLink class="public-brand" to="/" @click="closeMenu">L'Addition</RouterLink>

      <div class="public-nav__desktop-links">
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

      <button
        class="public-menu-button button button--ghost button--icon"
        type="button"
        aria-controls="public-mobile-navigation"
        :aria-expanded="isMenuOpen"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <span class="material-symbols-outlined" aria-hidden="true">
          {{ isMenuOpen ? 'close' : 'menu' }}
        </span>
      </button>

      <div
        id="public-mobile-navigation"
        class="public-nav__mobile-menu"
        :class="{ 'public-nav__mobile-menu--open': isMenuOpen }"
      >
        <RouterLink
          class="public-header-link type-label"
          to="/design-system/philosophy"
          @click="closeMenu"
        >
          Design System
        </RouterLink>
        <span class="public-nav__mobile-divider" aria-hidden="true"></span>
        <button
          v-if="authStore.isAuthenticated"
          class="public-header-link type-label"
          type="button"
          @click="handleLogout"
        >
          Log out
        </button>
        <template v-else>
          <RouterLink class="public-header-link type-label" to="/login" @click="closeMenu">
            Log in
          </RouterLink>
          <RouterLink
            class="button button--gold-leaf button--compact"
            to="/sign-up"
            @click="closeMenu"
          >
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
  position: relative;
  min-height: var(--top-bar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.public-nav__desktop-links {
  display: none;
}

.public-nav__mobile-menu {
  position: absolute;
  top: 100%;
  right: var(--space-container-mobile);
  left: var(--space-container-mobile);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  border: var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-sm);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-ambient);
  opacity: 0;
  pointer-events: none;
  transform: translateY(calc(var(--space-xs) * -1));
  transition:
    opacity var(--motion-smooth),
    transform var(--motion-smooth);
}

.public-nav__mobile-menu--open {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(var(--space-xs));
}

.public-nav__divider {
  width: 1px;
  align-self: stretch;
  background: var(--color-outline-variant);
}

.public-nav__mobile-divider {
  width: 100%;
  height: 1px;
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

.public-menu-button {
  flex: 0 0 auto;
}

.public-header-link {
  width: 100%;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  text-decoration: none;
  transition:
    background var(--motion-smooth),
    color var(--motion-smooth),
    opacity var(--motion-smooth);
}

.public-header-link:hover {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
}

.public-nav__mobile-menu .button {
  width: 100%;
  text-align: center;
}

@media (min-width: 640px) {
  .public-menu-button,
  .public-nav__mobile-menu {
    display: none;
  }

  .public-nav__desktop-links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-sm);
  }

  .public-header-link {
    width: auto;
    min-height: auto;
    border-radius: 0;
  }

  .public-header-link:hover {
    background: transparent;
  }
}

</style>
