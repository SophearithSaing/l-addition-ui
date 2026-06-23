import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const isInitialRouteLoading = ref(true)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/scan',
      meta: { requiresAuth: true },
      component: () => import('@/views/ScanView.vue'),
    },
    {
      path: '/manual',
      component: () => import('@/views/ManualView.vue'),
    },
    {
      path: '/sign-up',
      component: () => import('@/views/SignUpView.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/design-system',
      alias: '/design-sytem',
      component: () => import('@/views/design-system/DesignSystemLayout.vue'),
      redirect: '/design-system/philosophy',
      children: [
        {
          path: 'philosophy',
          component: () => import('@/views/design-system/DesignSystemPhilosophyView.vue'),
        },
        {
          path: 'foundations',
          component: () => import('@/views/design-system/DesignSystemFoundationsView.vue'),
        },
        {
          path: 'colors',
          component: () => import('@/views/design-system/DesignSystemColorsView.vue'),
        },
        {
          path: 'typography',
          component: () => import('@/views/design-system/DesignSystemTypographyView.vue'),
        },
        {
          path: 'components',
          component: () => import('@/views/design-system/DesignSystemComponentsView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && !authStore.isCheckingSession) {
    await authStore.loadSession()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
})

router.afterEach(() => {
  isInitialRouteLoading.value = false
})

router.onError(() => {
  isInitialRouteLoading.value = false
})

export default router
