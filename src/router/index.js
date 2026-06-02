import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import CreateTaskView from '../views/CreateTaskView.vue'
import TasksView from '../views/TasksView.vue'
import UserDetailView from '../views/UserDetailView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import TaskDetailView from '../views/TaskDetailView.vue'
import DepartamentsTeam from '../views/DepartamentsTeam.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/tasks/create', name: 'tasks/create', component: CreateTaskView, meta: { requiresAuth: true } },
  { path: '/tasks', name: 'tasks', component: TasksView, meta: { requiresAuth: true } },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/TeamView.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/team/:id', name: 'user-detail', component: UserDetailView, meta: { requiresAuth: true } },
  {
    path: '/tasks/:id',
    name: 'task-detail',
    component: TaskDetailView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/departament_team',
    name: 'departament-team',
    component: DepartamentsTeam,
    meta: { requiresAuth: true },
  },
  {
    path: '/tasks/edit/:id', // :id — это динамический параметр, который мы забираем через route.params.id
    name: 'TaskEdit',
    component: CreateTaskView, // Тот же самый файл формы!
    meta: { requiresAuth: true },
  },

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
