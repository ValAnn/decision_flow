<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <button
      @click="$router.back()"
      class="flex items-center gap-2 text-brand-gray hover:text-brand-green transition-colors group"
    >
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span class="text-sm font-semibold">Назад к команде</span>
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-3xl border border-brand-border shadow-sm text-center">
          <div class="relative inline-block mb-4">
            <img
              :src="user.avatar"
              class="w-32 h-32 rounded-full object-cover border-4 border-brand-light"
            />
            <div
              class="absolute bottom-2 right-2 w-6 h-6 bg-brand-green border-4 border-white rounded-full"
            ></div>
          </div>
          <h1 class="text-2xl font-bold text-brand-dark">{{ user.name }}</h1>
          <p class="text-brand-gray font-medium">{{ user.role }}</p>

          <div class="mt-6 flex justify-center gap-3">
            <VButton variant="primary" size="md" class="flex-1">Написать</VButton>
            <button
              class="p-2 border border-brand-border rounded-xl hover:bg-brand-light transition-colors"
            >
              <Mail class="w-5 h-5 text-brand-gray" />
            </button>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
          <h3 class="text-sm font-extrabold text-brand-dark uppercase tracking-widest mb-4">
            Навыки
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in user.skills"
              :key="skill"
              class="px-3 py-1 bg-brand-light text-brand-dark text-xs font-bold rounded-lg border border-brand-border"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
          <h3 class="text-sm font-extrabold text-brand-dark uppercase tracking-widest mb-4">
            Контакты
          </h3>
          <div class="space-y-3 text-sm">
            <div class="flex items-center gap-3 text-brand-gray">
              <Globe class="w-4 h-4" />
              <span class="text-brand-dark">alex-rivera.dev</span>
            </div>
            <div class="flex items-center gap-3 text-brand-gray">
              <Github class="w-4 h-4" />
              <span class="text-brand-dark">@arivera_dev</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
            <p class="text-[10px] font-bold text-brand-gray uppercase mb-1">Завершено задач</p>
            <p class="text-2xl font-bold text-brand-dark">142</p>
          </div>
          <div class="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
            <p class="text-[10px] font-bold text-brand-gray uppercase mb-1">В работе</p>
            <p class="text-2xl font-bold text-brand-green">4</p>
          </div>
          <div class="bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
            <p class="text-[10px] font-bold text-brand-gray uppercase mb-1">Рейтинг кода</p>
            <p class="text-2xl font-bold text-blue-600">4.9/5</p>
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-brand-border shadow-sm overflow-hidden">
          <div class="p-6 border-b border-brand-light flex justify-between items-center">
            <h3 class="font-bold text-brand-dark">Текущие задачи</h3>
            <span class="text-xs text-brand-gray">Всего в спринте: 4</span>
          </div>
          <div class="divide-y divide-brand-light">
            <div
              v-for="task in activeTasks"
              :key="task.id"
              class="p-6 hover:bg-brand-light/50 transition-colors"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-brand-dark text-sm">{{ task.title }}</h4>
                <span
                  :class="[
                    'text-[10px] font-extrabold px-2 py-0.5 rounded uppercase',
                    task.priority === 'High'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-blue-50 text-blue-600',
                  ]"
                >
                  {{ task.priority }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-4">
                <div
                  class="flex items-center gap-4 text-[10px] font-bold text-brand-gray uppercase"
                >
                  <span class="flex items-center gap-1"
                    ><Clock class="w-3 h-3" /> {{ task.deadline }}</span
                  >
                  <span class="flex items-center gap-1"
                    ><Briefcase class="w-3 h-3" /> {{ task.project }}</span
                  >
                </div>
                <div class="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-brand-green" :style="{ width: task.progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-brand-dark p-8 rounded-3xl text-white flex justify-between items-center overflow-hidden relative"
        >
          <div class="relative z-10">
            <h3 class="text-xl font-bold mb-2">Производительность</h3>
            <p class="text-gray-400 text-sm max-w-[280px]">
              Алекс выполнил на 15% больше задач в этом месяце по сравнению с прошлым.
            </p>
          </div>
          <div class="hidden md:block">
            <BarChart3
              class="w-32 h-32 text-brand-green/20 absolute -right-4 -bottom-4"
              stroke-width="3"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, Mail, Globe, Github, Clock, Briefcase, BarChart3 } from 'lucide-vue-next'
import VButton from '../components/base/VButton.vue'

// Данные пользователя (обычно подгружаются по ID из роута)
const user = {
  name: 'Алекс Ривера',
  role: 'Senior UI/UX Engineer',
  avatar: 'https://i.pravatar.cc/150?u=1',
  skills: ['Vue.js', 'Tailwind CSS', 'TypeScript', 'Figma', 'Node.js', 'GraphQL'],
}

// Список задач разработчика
const activeTasks = ref([
  {
    id: 1,
    title: 'Рефакторинг системы уведомлений',
    priority: 'High',
    deadline: '2 дня',
    project: 'DecisionFlow',
    progress: 75,
  },
  {
    id: 2,
    title: 'Адаптивная верстка страницы профиля',
    priority: 'Medium',
    deadline: '5 дней',
    project: 'DecisionFlow',
    progress: 30,
  },
  {
    id: 3,
    title: 'Интеграция Stripe API',
    priority: 'High',
    deadline: '1 день',
    project: 'E-commerce UI',
    progress: 90,
  },
])
</script>
