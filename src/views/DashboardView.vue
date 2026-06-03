<template>
  <div class="space-y-8">
    <div class="flex justify-between">
      <div>
        <h1 class="text-3xl font-bold text-brand-dark">
          Добро пожаловать, <b>{{ auth.displayName }}</b>
        </h1>
        <p class="text-brand-gray mt-2">Вот что происходит в ваших проектах сегодня.</p>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="p-4 rounded border border-red-200 bg-red-50 text-red-700 text-sm"
    >
      {{ errorMessage }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Всего задач"
        :value="overview.totalTasks"
        :icon="BarChart3"
        iconBgClass="bg-blue-50"
        iconColorClass="text-blue-600"
        :trendValue="8"
        trendPositive
      />
      <StatsCard
        title="В работе"
        :value="overview.inProgress"
        :icon="Clock"
        iconBgClass="bg-amber-50"
        iconColorClass="text-amber-600"
        :trendValue="3"
        trendPositive
      />
      <StatsCard
        title="Завершено"
        :value="overview.completed"
        :icon="CheckCircle2"
        iconBgClass="bg-brand-green/10"
        iconColorClass="text-brand-green"
        :trendValue="12"
        trendPositive
      />
      <StatsCard
        title="Просрочено"
        :value="overview.overdue"
        :icon="AlertCircle"
        iconBgClass="bg-red-50"
        iconColorClass="text-red-600"
        :trendValue="2"
        :trendPositive="false"
      />
    </div>

    <div class="w-full">
      <WorkloadChart
        :workload-data="workloadData"
        :period="period"
        @change-period="handlePeriodChange"
      />
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

const auth = useAuthStore()
const router = useRouter()

const errorMessage = ref('')
const period = ref('week')

const overview = ref({
  totalTasks: 48,
  inProgress: 16,
  completed: 27,
  overdue: 5,
})

const workloadDataByPeriod = {
  week: [
    { label: 'ПН', value: 7 },
    { label: 'ВТ', value: 12 },
    { label: 'СР', value: 9 },
    { label: 'ЧТ', value: 14 },
    { label: 'ПТ', value: 8 },
    { label: 'СБ', value: 4 },
    { label: 'ВС', value: 2 },
  ],
  month: [
    { label: '1 нед', value: 30 },
    { label: '2 нед', value: 42 },
    { label: '3 нед', value: 36 },
    { label: '4 нед', value: 54 },
  ],
}

const workloadData = ref(workloadDataByPeriod.week)

const loadDashboard = async () => {
  errorMessage.value = ''

  overview.value =
    period.value === 'month'
      ? { totalTasks: 186, inProgress: 41, completed: 121, overdue: 24 }
      : { totalTasks: 48, inProgress: 16, completed: 27, overdue: 5 }

  workloadData.value = workloadDataByPeriod[period.value] || workloadDataByPeriod.week
}

const handlePeriodChange = async (newPeriod) => {
  period.value = newPeriod
  await loadDashboard()
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

onMounted(loadDashboard)
</script>
