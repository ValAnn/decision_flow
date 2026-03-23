<template>
  <div class="h-[calc(100vh-140px)] flex flex-col">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-bold text-brand-dark">Канбан-доска проекта</h1>
          <span
            class="bg-brand-green/10 text-brand-green text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
            >Активен</span
          >
        </div>
        <p class="text-sm text-brand-gray mt-1">
          Управляйте задачами и отслеживайте прогресс команды в реальном времени.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex -space-x-2 mr-4">
          <img
            v-for="i in 3"
            :key="i"
            :src="`https://i.pravatar.cc/150?u=${i}`"
            class="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          />
          <div
            class="w-8 h-8 rounded-full bg-brand-light border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-gray"
          >
            +12
          </div>
        </div>
        <VButton variant="secondary" size="md" class="gap-2">
          <SlidersHorizontal class="w-4 h-4" /> Фильтры
        </VButton>
        <VButton variant="primary" size="md" class="gap-2" @click="$router.push('/create-task')">
          <Plus class="w-4 h-4" /> Новая задача
        </VButton>
      </div>
    </div>

    <div class="flex-1 flex gap-6 overflow-x-auto pb-6 custom-scrollbar items-start">
      <TaskColumn title="К выполнению" :tasks="tasksByStatus.todo" />
      <TaskColumn title="В работе" :tasks="tasksByStatus.inProgress" />
      <TaskColumn title="На проверке" :tasks="tasksByStatus.inReview" />
      <TaskColumn title="Готово" :tasks="tasksByStatus.done" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, SlidersHorizontal } from 'lucide-vue-next'
import VButton from '../components/base/VButton.vue'
import TaskColumn from '../components/tasks/TaskColumn.vue'

// Моковые данные (имитация API)
const tasks = [
  {
    id: 101,
    title: 'Разработать флоу авторизации через OAuth2',
    status: 'todo',
    priority: 'High',
    date: '24 Окт, 2023',
    assignee: { name: 'Алекс', avatar: 'https://i.pravatar.cc/150?u=1' },
  },
  {
    id: 112,
    title: 'Рефакторинг стейт-менеджмента Redux Toolkit',
    status: 'inProgress',
    priority: 'High',
    progress: 65,
    date: '25 Окт, 2023',
    assignee: { name: 'Марк', avatar: 'https://i.pravatar.cc/150?u=2' },
  },
  {
    id: 124,
    title: 'Обновить политику конфиденциальности для GDPR',
    status: 'inReview',
    priority: 'Low',
    date: '26 Окт, 2023',
    assignee: { name: 'Елена', avatar: 'https://i.pravatar.cc/150?u=3' },
  },
  {
    id: 105,
    title: 'Обновление иконок системного набора',
    status: 'todo',
    priority: 'Medium',
    date: '27 Окт, 2023',
    assignee: { name: 'Сара', avatar: 'https://i.pravatar.cc/150?u=4' },
  },
]

const tasksByStatus = computed(() => ({
  todo: tasks.filter((t) => t.status === 'todo'),
  inProgress: tasks.filter((t) => t.status === 'inProgress'),
  inReview: tasks.filter((t) => t.status === 'inReview'),
  done: tasks.filter((t) => t.status === 'done'),
}))
</script>
