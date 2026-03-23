import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import CreateTaskView from '../views/CreateTaskView.vue'
import TasksView from '../views/TasksView.vue'
import UserDetailView from '../views/UserDetailView.vue'

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/create-task', name: 'create-task', component: CreateTaskView },
  { path: '/tasks', name: 'tasks', component: TasksView },
  { path: '/team', name: 'team', component: () => import('../views/TeamView.vue') },
  { path: '/team/:id', name: 'user-detail', component: UserDetailView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
