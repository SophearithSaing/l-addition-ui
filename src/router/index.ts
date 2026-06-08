import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/design-system/philosophy',
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

export default router
