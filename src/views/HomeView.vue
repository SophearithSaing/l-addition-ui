<script setup lang="ts">
import PublicLayout from '@/components/public/PublicLayout.vue'
</script>

<template>
  <PublicLayout>
    <main class="home-select app-container">
      <section class="home-select__hero stack-sm" aria-labelledby="home-title">
        <div class="eyebrow-divider type-label text-muted">
          <span aria-hidden="true"></span>
          Select Establishment
          <span aria-hidden="true"></span>
        </div>
        <h1 id="home-title" class="type-display-lg text-primary">The Art of the Split</h1>
        <p class="type-body-md text-muted">
          Upload your bill or enter items manually to begin a seamless division of the evening's
          expenses.
        </p>
      </section>

      <section class="home-choice-grid" aria-label="Bill entry options">
        <RouterLink class="home-choice-card home-choice-card--scan" to="/scan">
          <span class="home-choice-card__glow" aria-hidden="true"></span>
          <span class="home-choice-card__icon" aria-hidden="true">
            <span class="material-symbols-outlined icon-lg">receipt_long</span>
          </span>
          <span class="home-choice-card__copy stack-xs">
            <span class="type-body-lg text-primary">Scan or Upload Receipt</span>
            <span class="type-body-md text-muted">
              We'll automatically itemize the bill using smart recognition.
            </span>
          </span>
        </RouterLink>

        <div class="home-choice-divider type-label text-muted" aria-hidden="true">or</div>

        <RouterLink class="home-choice-card" to="/manual">
          <span class="home-choice-card__icon" aria-hidden="true">
            <span class="material-symbols-outlined icon-lg">edit_square</span>
          </span>
          <span class="home-choice-card__copy stack-xs">
            <span class="type-body-lg text-primary">Start Manual Entry</span>
            <span class="type-body-md text-muted"
              >Input items and assign them to diners yourself.</span
            >
          </span>
        </RouterLink>
      </section>
    </main>
  </PublicLayout>
</template>
