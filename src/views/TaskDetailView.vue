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
        <VButton variant="secondary" size="md" @click="isEditing = true">
          <Edit3 class="w-4 h-4 mr-2" /> Редактировать
        </VButton>
        <VButton
          variant="primary"
          size="md"
          @click="updateStatus('DONE')"
          v-if="task.status !== 'DONE'"
        >
          <CheckCircle class="w-4 h-4 mr-2" /> Завершить задачу
        </VButton>
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
                {{ formatDate(task.completedAt) }}
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
              <img
                :src="`https://i.pravatar.cc/150?u=${task.assignee?.id}`"
                class="w-10 h-10 rounded-full border"
              />
              <div>
                <p class="text-[10px] font-black text-brand-gray uppercase">Исполнитель</p>
                <p class="text-sm font-bold text-brand-dark">
                  {{ task.assignee?.fullName || 'Не назначен' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <img
                :src="`https://i.pravatar.cc/150?u=${task.lead?.id}`"
                class="w-10 h-10 rounded-full border"
              />
              <div>
                <p class="text-[10px] font-black text-brand-gray uppercase">Тимлид / Lead</p>
                <p class="text-sm font-bold text-brand-dark">
                  {{ task.lead?.fullName || 'Не назначен' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-brand-dark p-6 rounded-brand text-white shadow-xl shadow-brand-dark/20">
          <div class="flex items-center gap-3 mb-2 opacity-60">
            <ShieldCheck class="w-4 h-4" />
            <span class="text-[10px] font-black uppercase tracking-widest">Требуемый стек</span>
          </div>
          <p class="text-xl font-bold">{{ task.requiredSpecialization }}</p>
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
  Edit3,
  CheckCircle,
  Clock,
  Calendar,
  Hourglass,
  ShieldCheck,
} from 'lucide-vue-next'
import apiClient from '../api/client'
import VButton from '../components/base/VButton.vue'

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
</script>
