<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

/**
 * Opens the mobile navigation menu.
 */
function openMobileMenu(): void {
  isMobileMenuOpen.value = true
}

/**
 * Closes the mobile navigation menu.
 */
function closeMobileMenu(): void {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="design-system-shell">
    <nav class="side-nav" aria-label="Design system navigation">
      <div class="side-nav__brand stack-xs">
        <RouterLink class="type-headline-md text-primary" to="/design-system/philosophy">
          L'Addition
        </RouterLink>
        <p class="type-label text-muted">Design System</p>
      </div>

      <div class="stack-xs">
        <RouterLink class="side-nav__item type-label" to="/">
          <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to App
        </RouterLink>
        <div class="divider"></div>
        <RouterLink
          class="side-nav__item type-label"
          active-class="side-nav__item--active"
          to="/design-system/typography"
        >
          <span class="material-symbols-outlined" aria-hidden="true">match_case</span>
          Typography
        </RouterLink>
        <RouterLink
          class="side-nav__item type-label"
          active-class="side-nav__item--active"
          to="/design-system/colors"
        >
          <span class="material-symbols-outlined" aria-hidden="true">palette</span>
          Colors
        </RouterLink>
        <RouterLink
          class="side-nav__item type-label"
          active-class="side-nav__item--active"
          to="/design-system/foundations"
        >
          <span class="material-symbols-outlined" aria-hidden="true">foundation</span>
          Foundations
        </RouterLink>
        <RouterLink
          class="side-nav__item type-label"
          active-class="side-nav__item--active"
          to="/design-system/components"
        >
          <span class="material-symbols-outlined" aria-hidden="true">extension</span>
          Components
        </RouterLink>
        <RouterLink
          class="side-nav__item type-label"
          active-class="side-nav__item--active"
          to="/design-system/philosophy"
        >
          <span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span>
          Philosophy
        </RouterLink>
      </div>
    </nav>

    <header class="mobile-app-bar">
      <RouterLink class="type-headline-md text-primary" to="/design-system/philosophy">
        L'Addition
      </RouterLink>
      <button
        class="button button--ghost button--icon"
        type="button"
        aria-controls="mobile-design-system-menu"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Open navigation menu"
        @click="openMobileMenu"
      >
        <span class="material-symbols-outlined" aria-hidden="true">menu</span>
      </button>
    </header>

    <div
      id="mobile-design-system-menu"
      class="mobile-menu"
      :class="{ 'mobile-menu--open': isMobileMenuOpen }"
      :aria-hidden="!isMobileMenuOpen"
      :inert="!isMobileMenuOpen"
      aria-label="Mobile design system navigation"
    >
      <nav class="mobile-menu__panel" aria-label="Mobile design system navigation">
        <div class="mobile-menu__header">
          <div class="stack-xs">
            <RouterLink
              class="type-headline-md text-primary"
              to="/design-system/philosophy"
              @click="closeMobileMenu"
            >
              L'Addition
            </RouterLink>
            <p class="type-label text-muted">Design System</p>
          </div>
          <button
            class="button button--ghost button--icon"
            type="button"
            aria-label="Close navigation menu"
            @click="closeMobileMenu"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        <div class="stack-xs">
          <RouterLink class="side-nav__item type-label" to="/" @click="closeMobileMenu">
            <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
            Back to App
          </RouterLink>
          <div class="divider"></div>
          <RouterLink
            class="side-nav__item type-label"
            active-class="side-nav__item--active"
            to="/design-system/typography"
            @click="closeMobileMenu"
          >
            <span class="material-symbols-outlined" aria-hidden="true">match_case</span>
            Typography
          </RouterLink>
          <RouterLink
            class="side-nav__item type-label"
            active-class="side-nav__item--active"
            to="/design-system/colors"
            @click="closeMobileMenu"
          >
            <span class="material-symbols-outlined" aria-hidden="true">palette</span>
            Colors
          </RouterLink>
          <RouterLink
            class="side-nav__item type-label"
            active-class="side-nav__item--active"
            to="/design-system/foundations"
            @click="closeMobileMenu"
          >
            <span class="material-symbols-outlined" aria-hidden="true">foundation</span>
            Foundations
          </RouterLink>
          <RouterLink
            class="side-nav__item type-label"
            active-class="side-nav__item--active"
            to="/design-system/components"
            @click="closeMobileMenu"
          >
            <span class="material-symbols-outlined" aria-hidden="true">extension</span>
            Components
          </RouterLink>
          <RouterLink
            class="side-nav__item type-label"
            active-class="side-nav__item--active"
            to="/design-system/philosophy"
            @click="closeMobileMenu"
          >
            <span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span>
            Philosophy
          </RouterLink>
        </div>
      </nav>

      <button
        class="mobile-menu__backdrop"
        type="button"
        aria-label="Close navigation menu"
        @click="closeMobileMenu"
      ></button>
    </div>

    <main class="design-system-main">
      <RouterView />
    </main>
  </div>
</template>
