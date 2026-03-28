<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-brand-dark">Мои задачи</h1>
        <p class="text-sm text-brand-gray">Управление вашим рабочим процессом</p>
      </div>
      <button @click="fetchTasks" class="p-2 hover:bg-brand-light rounded-full transition-colors">
        <Clock class="w-5 h-5 text-brand-gray" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
      <div v-for="column in columns" :key="column.id" class="flex flex-col min-w-[300px]">
        <div class="flex items-center justify-between mb-4 px-2">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-brand-dark uppercase text-xs tracking-wider">
              {{ column.title }}
            </h3>
            <span
              class="bg-brand-light text-brand-gray text-[10px] px-2 py-0.5 rounded-full font-bold"
            >
              {{ column.items.length }}
            </span>
          </div>
        </div>

        <div
          class="space-y-4 min-h-[500px] bg-gray-50/50 p-2 rounded-2xl border border-dashed border-gray-200"
        >
          <div
            v-for="task in column.items"
            :key="task.id"
            class="bg-white p-4 rounded-xl border border-brand-border shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing"
          >
            <div class="flex justify-between items-start mb-3">
              <span
                :class="[
                  'text-[10px] font-bold px-2 py-0.5 rounded border uppercase',
                  getPriorityClass(task.priority),
                ]"
              >
                {{ task.priority }}
              </span>
              <span class="text-[10px] text-gray-400 font-mono">#{{ task.id }}</span>
            </div>

            <h4
              class="font-bold text-brand-dark text-sm mb-1 group-hover:text-brand-green transition-colors"
            >
              {{ task.title }}
            </h4>
            <p class="text-xs text-brand-gray line-clamp-2 mb-4">
              {{ task.description }}
            </p>

            <div class="flex items-center justify-between pt-4 border-t border-brand-light">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-1.5">
                  <User class="w-3 h-3 text-brand-gray" />
                  <span class="text-[10px] font-medium text-brand-dark">
                    От: {{ task.creator?.fullName.split(' ')[0] }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Clock class="w-3 h-3 text-brand-gray" />
                  <span class="text-[10px] text-brand-gray uppercase font-bold">
                    {{ formatDate(task.createdAt) }}
                  </span>
                </div>
              </div>

              <div v-if="task.status === 'DONE'" class="text-brand-green">
                <CheckCircle2 class="w-5 h-5" />
              </div>
              <div v-else class="relative">
                <div
                  class="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center border border-white text-[8px] font-bold text-brand-gray"
                >
                  {{ task.lead?.fullName.charAt(0) }}
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="column.id === 'TODO'"
            class="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:border-brand-green hover:text-brand-green transition-all"
          >
            + Добавить задачу
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiClient from '../api/axios'
import { Clock, CheckCircle2, Circle, AlertCircle, MoreVertical, User } from 'lucide-vue-next'

const tasks = ref([])
const isLoading = ref(true)
const error = ref(null)

// Загрузка задач
const fetchTasks = async () => {
  isLoading.value = true
  try {
    const response = await apiClient.get('/tasks/my')
    tasks.value = response.data
  } catch (err) {
    error.value = 'Не удалось загрузить ваши задачи'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTasks)

// Группировка задач по статусам для Канбан-доски
const columns = computed(() => [
  {
    id: 'TODO',
    title: 'К исполнению',
    items: tasks.value.filter((t) => t.status === 'TODO' || !t.status),
  },
  {
    id: 'IN_PROGRESS',
    title: 'В работе',
    items: tasks.value.filter((t) => t.status === 'IN_PROGRESS'),
  },
  {
    id: 'DONE',
    title: 'Завершено',
    items: tasks.value.filter((t) => t.status === 'DONE'),
  },
])

// Вспомогательные функции для стилизации
const getPriorityClass = (priority) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-50 text-red-600 border-red-100'
    case 'MEDIUM':
      return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'LOW':
      return 'bg-blue-50 text-blue-600 border-blue-100'
    default:
      return 'bg-gray-50 text-gray-600'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
</script>
