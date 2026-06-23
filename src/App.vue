<script setup lang="ts">
import AppLoadingScreen from '@/components/common/AppLoadingScreen.vue'
import { isInitialRouteLoading } from '@/router'
</script>

<template>
  <AppLoadingScreen v-if="isInitialRouteLoading" />
  <RouterView v-else />
</template>
