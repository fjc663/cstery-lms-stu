import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('../views/layout/LayoutView.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/layout/components/HomeView.vue')
        },
        {
          path: 'class',
          name: 'class',
          component: () => import('@/views/class/ClassView.vue'),
          children: [
            {
              path: '',
              name: 'classOverView',
              component: () => import('@/views/class/components/ClassOverView.vue')
            },
            {
              path: ':id',
              name: 'classDetailView',
              component: () => import('@/views/class/components/ClassDetailView.vue')
            },
          ]
        },
        {
          path: 'task',
          name: 'task',
          component: () => import('@/views/task/taskView.vue'),
          children: [
            {
              path: '',
              name: 'taskOverView',
              component: () => import('@/views/task/components/taskOverView.vue')
            },
            {
              path: ':id',
              name: 'taskDetailView',
              component: () => import('@/views/task/components/taskDetailView.vue')
            },
          ]
        },
        {
          path: '/personal',
          name: 'personal',
          component: () => import('@/views/user/PersonalCenter.vue'),
          children: [
            {
              path: '',
              name: 'userInfo',
              component: () => import('@/views/user/components/UserInfoView.vue')
            },
            {
              path: 'editPassword',
              name: 'editPassword',
              component: () => import('@/views/user/components/EditPassword.vue')
            },
          ]
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    }
  ]
})

export default router
