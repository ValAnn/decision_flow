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

    <div class="flex items-center gap-3">
      <!-- НОВАЯ КНОПКА: Импорт из Jira -->
      <button
        @click="syncJira"
        :disabled="isSyncing"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-dark hover:bg-brand-light transition-all shadow-sm disabled:opacity-50"
      >
        <RefreshCw v-if="isSyncing" class="w-3.5 h-3.5 animate-spin text-brand-green" />
        {{ isSyncing ? 'Синхронизация...' : 'Импорт из Jira' }}
      </button>

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

        <draggable
          :list="column.items"
          group="tasks"
          item-key="id"
          @change="(evt) => onDragEnd(evt, column.id)"
          class="space-y-4 min-h-[500px] bg-gray-50/50 p-2 rounded-2xl border border-dashed border-gray-200"
        >
          <template #item="{ element: task }">
            <div
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

              <router-link
                :to="`/tasks/${task.id}`"
                class="block font-bold text-brand-dark text-sm group-hover:text-brand-green transition-colors mb-3"
              >
                {{ task.title }}
              </router-link>
              <p class="text-xs text-brand-gray line-clamp-2 mb-4">
                {{ task.description }}
              </p>

              <div class="flex items-center justify-between pt-4 border-t border-brand-light">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-1.5">
                    <User class="w-3 h-3 text-brand-gray" />
                    <span class="text-[10px] font-medium text-brand-dark">
                      От: {{ task.creator?.fullName?.split(' ')[0] || 'Система' }}
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
                    {{ task.lead?.fullName?.charAt(0) || '?' }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <router-link to="/tasks/create" class="mt-4">
          <button
            v-if="column.id === 'TODO'"
            class="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:border-brand-green hover:text-brand-green transition-all"
          >
            + Добавить задачу
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiClient from '../api/axios'
import { Clock, CheckCircle2, Circle, AlertCircle, MoreVertical, User } from 'lucide-vue-next'

import draggable from 'vuedraggable'

const isSyncing = ref(false) // Состояние загрузки специально для Jira

// Метод синхронизации
const syncJira = async () => {
  isSyncing.value = true
  console.log('import')
  try {
    // Используем apiClient (axios), который у вас уже настроен
    await apiClient.post('/tasks/import')
    alert('Задачи успешно импортированы из Jira!')
    await fetchTasks() // Обновляем список на экране
  } catch (err) {
    console.error('Ошибка синхронизации с Jira:', err)
    alert('Не удалось загрузить задачи. Проверьте настройки интеграции.')
  } finally {
    isSyncing.value = false
  }
}

// Функция для обновления статуса задачи на бэкенде
const updateTaskStatus = async (taskId, newStatus) => {
  try {
    // 1. Отправляем запрос на бэкенд
    await apiClient.patch(`/tasks/${taskId}/status`, { status: newStatus })

    console.log(`Статус успешно обновлен на ${newStatus}`)

    // 2. Обновляем список задач, чтобы данные (например, дата обновления или порядок)
    // синхронизировались с базой
    await fetchTasks()
  } catch (err) {
    console.error('Ошибка при обновлении статуса:', err)
    // Если произошла ошибка, возвращаем задачи в исходное состояние
    await fetchTasks()
    alert('Не удалось изменить статус. Возможно, у вас недостаточно прав.')
  }
}

// Обработчик события перетаскивания
const onDragEnd = (event, columnId) => {
  // event.added содержит информацию о задаче, которая упала в новую колонку
  if (event.added) {
    const task = event.added.element
    updateTaskStatus(task.id, columnId)
  }
}

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
    id: 'СОЗДАНО',
    title: 'К исполнению',
    items: tasks.value.filter((t) => t.status === 'СОЗДАНО' || !t.status),
  },
  {
    id: 'ИССЛЕДОВАНИЕ',
    title: 'В работе',
    items: tasks.value.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'ИССЛЕДОВАНИЕ'),
  },
  {
    id: 'К ВЫПОЛНЕНИЮ',
    title: 'Завершено',
    items: tasks.value.filter((t) => t.status === 'К ВЫПОЛНЕНИЮ' || t.status === 'TODO'),
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
