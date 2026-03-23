<template>
  <div class="max-w-[1400px] mx-auto">
    <div class="mb-8">
      <button
        @click="$router.push('/')"
        class="flex items-center gap-2 text-brand-gray hover:text-brand-green transition-colors mb-4 group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span class="text-sm font-semibold">Назад к дашборду</span>
      </button>

      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-3xl font-bold text-brand-dark">Создать новую задачу</h1>
          <p class="text-sm text-brand-gray mt-1">Последний черновик сохранен в 10:45</p>
        </div>

        <div
          class="hidden md:flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green rounded-full"
        >
          <div class="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></div>
          <span class="text-[10px] font-bold uppercase tracking-wider"
            >Автосохранение включено</span
          >
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-8 rounded-brand border border-brand-border shadow-sm">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label
                class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                >Название задачи</label
              >
              <input
                v-model="taskForm.title"
                type="text"
                placeholder="например: Дизайн адаптивного лендинга"
                class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-brand focus:bg-white focus:border-brand-green outline-none transition-all"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                  >Проект</label
                >
                <select
                  v-model="taskForm.project"
                  class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-brand outline-none focus:bg-white focus:border-brand-green transition-all appearance-none cursor-pointer"
                >
                  <option value="marketing">Резайн маркетингового сайта</option>
                  <option value="platform">Обновление платформы</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                  >Приоритет</label
                >
                <div class="grid grid-cols-3 gap-2 p-1 bg-brand-light rounded-brand">
                  <button
                    v-for="p in ['Низкий', 'Средний', 'Высокий']"
                    :key="p"
                    type="button"
                    @click="taskForm.priority = p"
                    :class="[
                      'py-2 text-xs font-bold rounded-lg transition-all',
                      taskForm.priority === p
                        ? 'bg-white shadow-sm text-brand-green'
                        : 'text-brand-gray hover:text-brand-dark',
                    ]"
                  >
                    {{ p }}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider"
                  >Описание</label
                >
                <div class="flex gap-2 text-brand-gray">
                  <button type="button" class="hover:text-brand-dark">
                    <Bold class="w-4 h-4" />
                  </button>
                  <button type="button" class="hover:text-brand-dark">
                    <Italic class="w-4 h-4" />
                  </button>
                  <button type="button" class="hover:text-brand-dark">
                    <List class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                v-model="taskForm.description"
                rows="6"
                placeholder="Опишите требования и цели задачи..."
                class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-brand focus:bg-white focus:border-brand-green outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                  >Срок выполнения</label
                >
                <input
                  v-model="taskForm.dueDate"
                  type="date"
                  class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-brand outline-none focus:bg-white focus:border-brand-green transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                  >Теги</label
                >
                <div class="flex flex-wrap gap-2 items-center">
                  <span
                    v-for="tag in taskForm.tags"
                    :key="tag"
                    class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full flex items-center gap-1"
                  >
                    {{ tag }} <X class="w-3 h-3 cursor-pointer" @click="removeTag(tag)" />
                  </span>
                  <button
                    type="button"
                    class="text-xs font-bold text-brand-gray hover:text-brand-green border border-dashed border-brand-border px-3 py-1 rounded-full"
                  >
                    + Добавить
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-brand border border-brand-border shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-brand-dark">Назначить разработчика</h3>
            <Info class="w-4 h-4 text-brand-gray" />
          </div>

          <div class="relative mb-6">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
            <input
              type="text"
              placeholder="Поиск участников..."
              class="w-full pl-10 pr-4 py-2 bg-brand-light border border-transparent rounded-brand text-sm outline-none focus:border-brand-green transition-all"
            />
          </div>

          <p class="text-[10px] font-bold text-brand-gray uppercase tracking-widest mb-4">
            Рекомендуемые специалисты
          </p>

          <div class="space-y-3">
            <div
              v-for="expert in suggestedExperts"
              :key="expert.id"
              @click="taskForm.assigneeId = expert.id"
              :class="[
                'p-4 rounded-xl border transition-all cursor-pointer group',
                taskForm.assigneeId === expert.id
                  ? 'border-brand-green bg-brand-green/5'
                  : 'border-transparent bg-brand-light hover:bg-white hover:border-brand-border',
              ]"
            >
              <div class="flex items-center gap-3">
                <img :src="expert.avatar" class="w-10 h-10 rounded-full object-cover" />
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <p class="text-sm font-bold text-brand-dark truncate">{{ expert.name }}</p>
                    <span
                      class="text-[9px] font-extrabold text-brand-green bg-white px-1.5 py-0.5 rounded border border-brand-green/20"
                    >
                      {{ expert.match }}% Совпадения
                    </span>
                  </div>
                  <p class="text-[10px] text-brand-gray">{{ expert.role }}</p>
                </div>
                <Check v-if="taskForm.assigneeId === expert.id" class="w-4 h-4 text-brand-green" />
              </div>

              <div class="mt-3 flex gap-2">
                <span
                  v-for="skill in expert.skills"
                  :key="skill"
                  class="text-[9px] px-2 py-0.5 bg-white border border-brand-border text-brand-gray rounded uppercase font-bold"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <button
            class="w-full mt-6 py-3 border border-dashed border-brand-border rounded-xl text-sm font-bold text-brand-gray hover:text-brand-green hover:border-brand-green transition-all flex items-center justify-center gap-2"
          >
            <UserPlus class="w-4 h-4" /> Пригласить в проект
          </button>
        </div>

        <div class="flex gap-4">
          <VButton variant="secondary" class="flex-1" @click="$router.back()">Отмена</VButton>
          <VButton variant="primary" class="flex-1" @click="handleSubmit">Создать</VButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Bold, Italic, List, X, Search, Info, Check, UserPlus, ArrowLeft } from 'lucide-vue-next'
import VButton from '../components/base/VButton.vue'

// Структура данных для API
const taskForm = reactive({
  title: '',
  project: 'marketing',
  priority: 'Средний',
  description: '',
  dueDate: '',
  tags: ['Дизайн', 'Фронтенд'],
  assigneeId: null,
})

// Данные, которые позже придут из API
const suggestedExperts = [
  {
    id: 1,
    name: 'Алекс Ривера',
    role: 'Senior UI Engineer',
    match: 98,
    skills: ['React', 'Tailwind'],
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 2,
    name: 'Сара Чен',
    role: 'Product Designer',
    match: 92,
    skills: ['Figma', 'Prototyping'],
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 3,
    name: 'Джордан Смит',
    role: 'Fullstack Dev',
    match: 85,
    skills: ['Vue.js', 'Node'],
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
]

const removeTag = (tag) => {
  taskForm.tags = taskForm.tags.filter((t) => t !== tag)
}

const handleSubmit = () => {
  console.log('Отправка данных на API:', taskForm)
  // Здесь будет axios.post('/tasks', taskForm)
}
</script>
