import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import CreateTaskView from '../views/CreateTaskView.vue'
import TasksView from '../views/TasksView.vue'
import UserDetailView from '../views/UserDetailView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/dashboard', redirect: '/' },
  { path: '/create-task', name: 'create-task', component: CreateTaskView },
  { path: '/tasks', name: 'tasks', component: TasksView },
  { path: '/team', name: 'team', component: () => import('../views/TeamView.vue') },
  { path: '/team/:id', name: 'user-detail', component: UserDetailView },

  { path: '/login', component: LoginView, meta: { guest: true } },
  { path: '/register', component: RegisterView, meta: { guest: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Глобальный защитник переходов
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isAuthenticated = !!auth.token

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Если нужен вход, а токена нет — на логин
    next('/login')
  } else if (to.meta.guest && isAuthenticated) {
    // Если пользователь уже вошел, не пускаем его на страницу логина/регистрации
    next('/dashboard')
  } else {
    next()
  }
})

export default router
