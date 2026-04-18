import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  HouseIcon,
} from 'lucide-vue-next'

export const mainNavigation = [
  { id: 'overview', name: 'Дашборд', icon: LayoutDashboard, path: '/' },
  { id: 'tasks', name: 'Задачи', icon: ClipboardList, path: '/tasks' },
  { id: 'team', name: 'Команда', icon: Users, path: '/team' },
  { id: 'reports', name: 'Отчеты', icon: BarChart3, path: '/reports' },
  { id: 'depatament_team', name: 'Департаменты', icon: HouseIcon, path: '/departament_team' },
]

export const secondaryNavigation = [
  { id: 'settings', name: 'Настройки', icon: Settings },
  { id: 'help', name: 'Помощь', icon: HelpCircle },
]
