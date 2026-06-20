<script setup lang="ts">
import PageHero from '@/components/common/PageHero.vue'
import PublicLayout from '@/components/public/PublicLayout.vue'
import UploadZone from '@/components/scan/UploadZone.vue'
</script>

<template>
  <PublicLayout>
    <main class="scan-page app-container">
      <PageHero
        title-id="scan-title"
        title="The Digital Concierge awaits."
        description="Drop your receipt here or select a file to begin the art of the split."
      />

      <UploadZone
        input-id="file-upload"
        icon="receipt_long"
        title="Upload Receipt"
        helper-text="JPG, PNG or PDF (Max 10MB)"
        action-label="Browse Files"
        accept="image/jpeg, image/png, application/pdf"
      />

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
