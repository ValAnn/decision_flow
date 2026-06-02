<template>
  <div class="space-y-8">
    <div class="flex justify-between">
      <div>
        <h1 class="text-3xl font-bold text-brand-dark">
          Добро пожаловать, <b>{{ auth.displayName }}</b>
        </h1>
        <p class="text-brand-gray mt-2">Вот что происходит в ваших проектах сегодня.</p>
      </div>
      <button @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Выйти
      </button>
    </div>

    <div v-if="errorMessage" class="p-4 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
      {{ errorMessage }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard title="Всего задач" :value="overview.totalTasks" :icon="BarChart3" iconBgClass="bg-blue-50" iconColorClass="text-blue-600" :trendValue="0" trendPositive />
      <StatsCard title="В работе" :value="overview.inProgress" :icon="Clock" iconBgClass="bg-amber-50" iconColorClass="text-amber-600" :trendValue="0" trendPositive />
      <StatsCard title="Завершено" :value="overview.completed" :icon="CheckCircle2" iconBgClass="bg-brand-green/10" iconColorClass="text-brand-green" :trendValue="0" trendPositive />
      <StatsCard title="Просрочено" :value="overview.overdue" :icon="AlertCircle" iconBgClass="bg-red-50" iconColorClass="text-red-600" :trendValue="0" :trendPositive="false" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <WorkloadChart :workload-data="workloadData" :period="period" @change-period="handlePeriodChange" />
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-brand border border-brand-border shadow-sm">
          <h3 class="text-lg font-bold text-brand-dark mb-4">Статус системы</h3>
          <div class="flex items-center gap-3 text-sm text-brand-gray mb-4">
            <div class="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
            <span>{{ loading ? 'Обновляем данные...' : 'Данные актуальны' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { CheckCircle2, Clock, BarChart3, AlertCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import StatsCard from '../components/dashboard/StatsCard.vue'
import WorkloadChart from '../components/dashboard/WorkloadChart.vue'
import { dashboardApi } from '@/api/dashboard'

const auth = useAuthStore()
const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const period = ref('week')

const overview = ref({
  totalTasks: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
})

const workloadData = ref([])

const firstNumber = (obj, keys, fallback = 0) => {
  for (const key of keys) {
    const value = obj?.[key]
    if (typeof value === 'number') return value
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value)
  }
  return fallback
}

const firstString = (obj, keys, fallback = '') => {
  for (const key of keys) {
    const value = obj?.[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') return String(value)
  }
  return fallback
}

const normalizeOverview = (data) => ({
  totalTasks: firstNumber(data, ['totalTasks', 'tasksTotal', 'allTasks', 'total'], 0),
  inProgress: firstNumber(data, ['inProgress', 'inWork', 'activeTasks', 'active'], 0),
  completed: firstNumber(data, ['completed', 'done', 'closedTasks'], 0),
  overdue: firstNumber(data, ['overdue', 'expired', 'lateTasks'], 0),
})

const normalizeWorkload = (items) =>
  (Array.isArray(items) ? items : []).map((item, index) => ({
    label: firstString(item, ['label', 'dayLabel', 'name', 'day'], `P${index + 1}`),
    value: firstNumber(item, ['value', 'tasks', 'count', 'load'], 0),
  }))

const loadOverview = async () => {
  const response = await dashboardApi.getOverview()
  overview.value = normalizeOverview(response.data)
}

const loadWorkload = async () => {
  const response = await dashboardApi.getWorkload(period.value)
  workloadData.value = normalizeWorkload(response.data)
}

const loadDashboard = async () => {
  loading.value = true
  errorMessage.value = ''

  const [overviewResult, workloadResult] = await Promise.allSettled([loadOverview(), loadWorkload()])

  if (overviewResult.status === 'rejected') {
    errorMessage.value = 'Не удалось загрузить обзор дашборда'
    console.error('Dashboard overview error:', overviewResult.reason)
  }

  if (workloadResult.status === 'rejected') {
    workloadData.value = []
    if (!errorMessage.value) {
      errorMessage.value = 'График нагрузки временно недоступен'
    }
    console.error('Dashboard workload error:', workloadResult.reason)
  }

  loading.value = false
}

const handlePeriodChange = async (newPeriod) => {
  period.value = newPeriod
  errorMessage.value = ''
  try {
    await loadWorkload()
  } catch (error) {
    workloadData.value = []
    errorMessage.value = 'Не удалось загрузить график нагрузки'
    console.error('Dashboard workload error:', error)
  }
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

onMounted(loadDashboard)
</script>
