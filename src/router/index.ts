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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router