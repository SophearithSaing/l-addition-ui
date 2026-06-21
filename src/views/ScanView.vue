<script setup lang="ts">
import PageHero from '@/components/common/PageHero.vue'
import PublicLayout from '@/components/public/PublicLayout.vue'
import RecentReceiptCard from '@/components/scan/RecentReceiptCard.vue'
import RecentReceiptList from '@/components/scan/RecentReceiptList.vue'
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
        <RecentReceiptList>
          <RecentReceiptCard icon="restaurant" title="Le Cinq" meta="Oct 24, 2023 • €420.00" />
          <RecentReceiptCard
            icon="local_cafe"
            title="Café de Flore"
            meta="Oct 22, 2023 • €45.50"
          />
          <RecentReceiptCard icon="wine_bar" title="Septime" meta="Oct 15, 2023 • €180.00" />
        </RecentReceiptList>
      </section>
    </main>
  </PublicLayout>
</template>

<style scoped>
.scan-page {
  width: 100%;
  padding-block: var(--space-section);
}

.recent-section__title {
  border-bottom: var(--border-subtle);
  padding-bottom: var(--space-sm);
}
</style>
