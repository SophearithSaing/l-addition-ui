<script setup lang="ts">
import PublicLayout from '@/components/public/PublicLayout.vue'
</script>

<template>
  <PublicLayout>
    <main class="scan-page app-container">
      <section class="scan-hero stack-sm" aria-labelledby="scan-title">
        <h1 id="scan-title" class="type-display-lg text-primary">The Digital Concierge awaits.</h1>
        <p class="type-body-lg text-muted">
          Drop your receipt here or select a file to begin the art of the split.
        </p>
      </section>

      <label class="upload-zone" for="file-upload">
        <span class="upload-zone__glow" aria-hidden="true"></span>
        <span class="material-symbols-outlined upload-zone__icon" aria-hidden="true">
          receipt_long
        </span>
        <span class="type-label text-primary">Upload Receipt</span>
        <span class="type-body-md text-muted">JPG, PNG or PDF (Max 10MB)</span>
        <span class="upload-zone__action type-label">Browse Files</span>
        <input
          id="file-upload"
          class="visually-hidden"
          accept="image/jpeg, image/png, application/pdf"
          type="file"
        />
      </label>

      <section class="recent-section stack-md" aria-labelledby="recent-title">
        <h2 id="recent-title" class="recent-section__title type-headline-md text-primary">
          Recent Concierge Services
        </h2>
        <div class="recent-card-grid">
          <article class="recent-card">
            <span class="recent-card__icon" aria-hidden="true">
              <span class="material-symbols-outlined">restaurant</span>
            </span>
            <div class="stack-xs">
              <h3 class="type-body-md text-primary">Le Cinq</h3>
              <p class="type-label text-muted">Oct 24, 2023 • €420.00</p>
            </div>
          </article>
          <article class="recent-card">
            <span class="recent-card__icon" aria-hidden="true">
              <span class="material-symbols-outlined">local_cafe</span>
            </span>
            <div class="stack-xs">
              <h3 class="type-body-md text-primary">Café de Flore</h3>
              <p class="type-label text-muted">Oct 22, 2023 • €45.50</p>
            </div>
          </article>
          <article class="recent-card">
            <span class="recent-card__icon" aria-hidden="true">
              <span class="material-symbols-outlined">wine_bar</span>
            </span>
            <div class="stack-xs">
              <h3 class="type-body-md text-primary">Septime</h3>
              <p class="type-label text-muted">Oct 15, 2023 • €180.00</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  </PublicLayout>
</template>
