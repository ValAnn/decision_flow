<template>
  <div class="space-y-8">
    <div class="flex justify-between">
      <div>
        <h1 class="text-3xl font-bold text-brand-dark">
          Добро пожаловать, <b>{{ auth.user || 'Пользователь' }}</b>
        </h1>

        <p class="text-brand-gray mt-2">Вот что происходит в ваших проектах сегодня.</p>
      </div>
      <button
        @click="handleLogout"
        class="px-4 py-2 bg-red-500 text-red rounded hover:bg-red-600 transition"
      >
        Выйти
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Всего задач"
        value="124"
        :icon="BarChart3"
        iconBgClass="bg-blue-50"
        iconColorClass="text-blue-600"
        :trendValue="12"
        trendPositive
      />
      <StatsCard
        title="В работе"
        value="45"
        :icon="Clock"
        iconBgClass="bg-amber-50"
        iconColorClass="text-amber-600"
        :trendValue="5"
        trendPositive
      />
      <StatsCard
        title="Завершено"
        value="78"
        :icon="CheckCircle2"
        iconBgClass="bg-brand-green/10"
        iconColorClass="text-brand-green"
        :trendValue="8"
        trendPositive
      />
      <StatsCard
        title="Просрочено"
        value="2"
        :icon="AlertCircle"
        iconBgClass="bg-red-50"
        iconColorClass="text-red-600"
        :trendValue="1"
        :trendPositive="false"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <WorkloadChart />
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-brand border border-brand-border shadow-sm">
          <h3 class="text-lg font-bold text-brand-dark mb-4">Статус системы</h3>
          <div class="flex items-center gap-3 text-sm text-brand-gray mb-4">
            <div class="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
            <span>Все сервисы работают штатно</span>
          </div>
          <div class="p-3 bg-brand-light rounded-lg">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Ближайшее обновление
            </p>
            <p class="text-sm font-medium text-brand-dark">Версия 2.4 — 28 февраля</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-brand border border-brand-border shadow-sm">
          <h3 class="text-lg font-bold text-brand-dark mb-4">Активность</h3>
          <div class="space-y-4">
            <div v-for="i in 2" :key="i" class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0"></div>
              <div>
                <p class="text-xs text-brand-dark">
                  <span class="font-bold">Марк</span> изменил статус задачи
                </p>
                <p class="text-[10px] text-brand-gray mt-0.5">2 минуты назад</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle2, Clock, BarChart3, AlertCircle } from 'lucide-vue-next'

import StatsCard from '../components/dashboard/StatsCard.vue'
import WorkloadChart from '../components/dashboard/WorkloadChart.vue'

import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout() // Очистит стор и localStorage
  router.push('/login')
}
</script>
