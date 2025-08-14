// filepath: d:\opt\test_demo\AI-app\frontEnd\src\router\index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home/Home.vue')
  },
  {
    path: '/tool',
    name: 'Tool',
    component: () => import('@/views/Tool/Tool.vue')
  },
  {
    path: '/format',
    name: 'format',
    component: () => import('@/views/Format/Format.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router