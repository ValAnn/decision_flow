<template>
  <div v-if="task" class="max-w-[1400px] mx-auto pb-20">
    <div class="flex items-center justify-between mb-8">
      <button
        @click="$router.back()"
        class="flex items-center gap-2 text-brand-gray hover:text-brand-green transition-all group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span class="text-sm font-bold">Назад к списку</span>
      </button>

      <div class="flex gap-3">
        <button
          @click="navigateToEdit"
          class="flex items-center gap-2 px-4 py-2 bg-brand-light hover:bg-brand-green hover:text-white border border-brand-border rounded-xl text-brand-dark text-sm font-bold transition-all shadow-sm group"
        >
          <Pencil class="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span>Редактировать задачу</span>
        </button>
        <VButton
          variant="primary"
          size="md"
          @click="updateStatus('DONE')"
          v-if="task.status !== 'DONE'"
        >
          <CheckCircle class="w-4 h-4 mr-2" /> Завершить задачу
        </VButton>
        <button @click="syncTask" :disabled="loading" class="sync-button">
          <span v-if="loading">Обновление...</span>
          <span v-else>Обновить из Jira</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-8 rounded-brand border border-brand-border shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <span
              :class="[
                'px-3 py-1 rounded-full text-[10px] font-black uppercase border',
                priorityClass,
              ]"
            >
              {{ task.priority }}
            </span>
            <span class="text-brand-gray text-sm font-mono">#{{ task.id }}</span>
          </div>

          <h1 class="text-3xl font-bold text-brand-dark mb-6">{{ task.title }}</h1>

          <div class="prose max-w-none text-brand-dark/80">
            <h3 class="text-xs font-black text-brand-gray uppercase tracking-widest mb-3">
              Описание задачи
            </h3>
            <p class="whitespace-pre-wrap leading-relaxed">
              {{ task.description || 'Описание отсутствует' }}
            </p>
          </div>

          <div class="mt-12 pt-8 border-t border-brand-light">
            <h3 class="text-xs font-black text-brand-gray uppercase tracking-widest mb-4">
              История изменений
            </h3>
            <div class="flex items-center gap-3 text-sm text-brand-gray">
              <Clock class="w-4 h-4" />
              Создано {{ formatDate(task.createdAt) }} пользователем {{ task.creator?.fullName }}
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-brand border border-brand-border shadow-sm space-y-6">
          <div>
            <label class="block text-[10px] font-black text-brand-gray uppercase mb-3"
              >Текущий статус</label
            >
            <div class="flex items-center gap-3 p-3 bg-brand-light rounded-xl">
              <div :class="['w-3 h-3 rounded-full', statusColor]"></div>
              <span class="text-sm font-bold text-brand-dark">{{ task.status }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-brand-gray uppercase mb-2"
                >Дедлайн</label
              >
              <div class="text-sm font-bold text-brand-dark flex items-center gap-2">
                <Calendar class="w-4 h-4 text-brand-gray" />
                {{ formatDate(task.deadlineAt) }}
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-black text-brand-gray uppercase mb-2"
                >Затрачено</label
              >
              <div class="text-sm font-bold text-brand-dark flex items-center gap-2">
                <Hourglass class="w-4 h-4 text-brand-gray" />
                {{ task.spentHours || 0 }} ч.
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-brand border border-brand-border shadow-sm space-y-6">
          <h3 class="font-bold text-brand-dark">Команда проекта</h3>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <img :src="DEFAULT_AVATAR" class="w-10 h-10 rounded-full" />
              <div>
                <p class="text-[10px] font-black text-brand-gray uppercase">Исполнитель</p>
                <p class="text-sm font-bold text-brand-dark">
                  {{ task.assignee?.fullName || 'Не назначен' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <img :src="DEFAULT_AVATAR" class="w-10 h-10 rounded-full" />
              <div>
                <p class="text-[10px] font-black text-brand-gray uppercase">Аналитик</p>
                <p class="text-sm font-bold text-brand-dark">
                  {{ task.analyst?.fullName || 'Не назначен' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-brand-dark p-6 rounded-brand text-white shadow-xl shadow-brand-dark/20">
          <div class="flex items-center gap-3 mb-2 opacity-60">
            <!-- <ShieldCheck class="w-4 h-4" /> -->
            <span class="text-[10px] font-black uppercase tracking-widest">Направление</span>
          </div>
          <p class="text-xl font-bold">{{ task.requiredSpecialization }}</p>
          <p v-if="!task.skills || task.skills.length === 0" class="text-sm text-gray-400 italic">
            Навыки не указаны
          </p>

          <div class="mb-4">
            <div class="flex items-center gap-3 mb-2 opacity-60">
              <span class="text-[10px] font-black uppercase tracking-widest">Навыки</span>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in task.skills"
                :key="skill.id"
                class="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] font-bold rounded uppercase tracking-wider border border-blue-200"
              >
                {{ skill.name }}
              </span>

              <p
                v-if="!task.skills || task.skills.length === 0"
                class="text-sm text-gray-400 italic"
              >
                Навыки не указаны
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-40 gap-4">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
    <p class="text-brand-gray font-medium">Загружаем детали задачи...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Pencil,
  CheckCircle,
  Clock,
  Calendar,
  Hourglass,
  ShieldCheck,
} from 'lucide-vue-next'
import apiClient from '../api/client'
import VButton from '../components/base/VButton.vue'
import { DEFAULT_AVATAR } from '@/stores/constants'

const route = useRoute()
const router = useRouter()
const task = ref(null)

const fetchTaskDetails = async () => {
  try {
    const response = await apiClient.get(`/tasks/${route.params.id}`)
    task.value = response.data
  } catch (err) {
    console.error('Ошибка при загрузке задачи', err)
    alert('Задача не найдена')
    router.push('/tasks')
  }
}

onMounted(fetchTaskDetails)

// Стилизация на лету
const priorityClass = computed(() => {
  const p = task.value?.priority
  if (p === 'HIGH') return 'text-red-600 border-red-100 bg-red-50'
  if (p === 'MEDIUM') return 'text-amber-600 border-amber-100 bg-amber-50'
  return 'text-blue-600 border-blue-100 bg-blue-50'
})

const statusColor = computed(() => {
  const s = task.value?.status
  if (s === 'DONE') return 'bg-brand-green'
  if (s === 'IN_PROGRESS') return 'bg-blue-500'
  return 'bg-gray-300'
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const updateStatus = async (newStatus) => {
  try {
    await apiClient.patch(`/tasks/${task.value.id}`, { status: newStatus })
    task.value.status = newStatus
  } catch (err) {
    alert('Не удалось обновить статус')
  }
}

// const props = defineProps(['issueKey'])
const loading = ref(false)

const syncTask = async () => {
  loading.value = true
  try {
    // Вызываем наш эндпоинт
    const response = await apiClient.post(`/tasks/import/${task.value.id}`)
    alert(`Задача ${task.value.id} успешно синхронизирована!`)

    // Можно вызвать событие, чтобы родительский компонент обновил список задач
    //emit('updated', response.data)
    await fetchTaskDetails()
  } catch (error) {
    console.error('Ошибка синхронизации:', error)
    alert('Не удалось обновить задачу. Проверьте соединение с Jira.')
  } finally {
    loading.value = false
  }
}

const taskId = route.params.id

// Метод перехода на страницу редактирования
const navigateToEdit = () => {
  if (!taskId) return alert('ID задачи не найден')

  // Перенаправляем на универсальную форму, которую мы сделали на прошлом шаге.
  // Убедись, что в твоем router/index.js путь к редактированию настроен именно так: '/tasks/edit/:id'
  router.push(`/tasks/edit/${taskId}`)
}
</script>
