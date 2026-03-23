import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-vue-next'

export const mainNavigation = [
  { id: 'overview', name: 'Дашборд', icon: LayoutDashboard, path: '/' },
  { id: 'tasks', name: 'Задачи', icon: ClipboardList, path: '/tasks' },
  { id: 'team', name: 'Команда', icon: Users, path: '/team' },
  { id: 'reports', name: 'Отчеты', icon: BarChart3, path: '/reports' },
]

export const secondaryNavigation = [
  { id: 'settings', name: 'Настройки', icon: Settings },
  { id: 'help', name: 'Помощь', icon: HelpCircle },
]
