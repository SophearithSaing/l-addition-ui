<script setup lang="ts">
import PageHero from '@/components/common/PageHero.vue'
import { PageHeroType } from '@/components/common/types/page-hero'
import HomeChoiceCard from '@/components/home/HomeChoiceCard.vue'
import HomeStartOptions from '@/components/home/HomeStartOptions.vue'
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

      <HomeStartOptions>
        <template #scan>
          <HomeChoiceCard
            icon="receipt_long"
            title="Upload Receipt"
            description="We'll automatically itemize the bill so you can review and assign them."
            to="/scan"
            :type="HomeChoiceCardType.Scan"
            disabled
          />
        </template>

        <template #manual>
          <HomeChoiceCard
            icon="edit_square"
            title="Start Manual Entry"
            description="Input items and assign them to diners yourself."
            to="/manual"
          />
        </template>
      </HomeStartOptions>
    </main>
  </PublicLayout>
</template>

<style scoped>
.home-select {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-section);
  padding-block: var(--space-section);
}
</style>
