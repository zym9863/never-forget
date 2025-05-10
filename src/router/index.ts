import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/note/:id',
      name: 'note',
      component: () => import('../views/NoteView.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryView.vue')
    },
    {
      path: '/reminders',
      name: 'reminders',
      component: () => import('../views/ReminderView.vue')
    }
  ]
})

export default router
