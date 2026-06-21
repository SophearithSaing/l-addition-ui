<script setup lang="ts">
import PublicFooter from './PublicFooter.vue'
import PublicHeader from './PublicHeader.vue'
</script>

<template>
  <div class="public-page surface-page">
    <PublicHeader />
    <slot />
    <PublicFooter />
  </div>
</template>

<style scoped>
.public-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
