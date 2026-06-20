<script setup lang="ts">
import PageHero from '@/components/common/PageHero.vue'
import { PageHeroType } from '@/components/common/types/page-hero'
import HomeChoiceCard from '@/components/home/HomeChoiceCard.vue'
import { HomeChoiceCardType } from '@/components/home/types/home-choice-card'
import PublicLayout from '@/components/public/PublicLayout.vue'
</script>

<template>
  <PublicLayout>
    <main class="home-select app-container">
      <PageHero
        title-id="home-title"
        title="The Art of the Split"
        eyebrow="Choose How to Start"
        description="Upload your bill or enter items manually to begin a seamless division of the expenses."
        :type="PageHeroType.Home"
      />

      <section class="home-choice-grid" aria-label="Bill entry options">
        <HomeChoiceCard
          icon="receipt_long"
          title="Upload Receipt"
          description="We'll automatically itemize the bill so you can review and assign them."
          to="/scan"
          :type="HomeChoiceCardType.Scan"
          disabled
        />
        <div class="home-choice-divider type-label text-muted" aria-hidden="true">or</div>

        <HomeChoiceCard
          icon="edit_square"
          title="Start Manual Entry"
          description="Input items and assign them to diners yourself."
          to="/manual"
        />
      </section>
    </main>
  </PublicLayout>
</template>
