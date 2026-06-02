<template>
  <div class="max-w-[1400px] mx-auto pb-20">
    <div class="mb-8">
      <button
        @click="$router.push('/tasks')"
        class="flex items-center gap-2 text-brand-gray hover:text-brand-green transition-colors mb-4 group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span class="text-sm font-semibold">Назад к списку задач</span>
      </button>

      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-3xl font-bold text-brand-dark">
            {{ isEditMode ? 'Редактировать задачу' : 'Создать новую задачу' }}
          </h1>
          <p class="text-brand-gray text-sm mt-1">
            {{
              isEditMode
                ? 'Внесите изменения в параметры задачи'
                : 'Заполнили детали для постановки задачи команде'
            }}
          </p>
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
                required
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                  >Департамент</label
                >
                <div class="relative">
                  <select
                    v-model.number="taskForm.departmentId"
                    :disabled="isLoadingDeps"
                    class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-brand outline-none focus:bg-white focus:border-brand-green transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option :value="null" disabled>
                      {{ isLoadingDeps ? 'Загрузка...' : 'Выберите департамент' }}
                    </option>
                    <option v-for="dep in departments" :key="dep.id" :value="dep.id">
                      {{ dep.name }}
                    </option>
                  </select>
                  <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                  >
                    <svg
                      class="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                  >Приоритет</label
                >
                <div class="grid grid-cols-3 gap-2 p-1 bg-brand-light rounded-brand">
                  <button
                    v-for="p in priorities"
                    :key="p.value"
                    type="button"
                    @click="taskForm.priority = p.value"
                    :class="[
                      'py-2 text-xs font-bold rounded-lg transition-all',
                      taskForm.priority === p.value
                        ? 'bg-white shadow-sm text-brand-green'
                        : 'text-brand-gray hover:text-brand-dark',
                    ]"
                  >
                    {{ p.label }}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label
                class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                >Описание</label
              >
              <textarea
                v-model="taskForm.description"
                rows="6"
                placeholder="Опишите требования и цели задачи..."
                class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-brand focus:bg-white focus:border-brand-green outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div>
              <label
                class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
              >
                Теги / Метки задачи
              </label>

              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="(tag, index) in taskForm.skills"
                  :key="index"
                  class="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-bold rounded-lg border border-brand-green/20"
                >
                  {{ tag.name }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="hover:text-red-500 transition-colors font-extrabold text-sm leading-none"
                  >
                    ×
                  </button>
                </span>
                <span
                  v-if="!taskForm.skills || taskForm.skills.length === 0"
                  class="text-xs text-brand-gray italic py-1"
                >
                  Теги еще не добавлены
                </span>
              </div>

              <div class="flex gap-2 max-w-md">
                <input
                  v-model="newTagInput"
                  type="text"
                  placeholder="Добавить тег (например: Оптимизация)"
                  @keydown.enter.prevent="addTag"
                  class="flex-1 px-4 py-2 bg-brand-light border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-green outline-none transition-all"
                />
                <button
                  type="button"
                  @click="addTag"
                  class="px-4 py-2 bg-brand-light hover:bg-brand-green hover:text-white border border-brand-border rounded-xl text-brand-dark text-xs font-bold transition-all"
                >
                  + Добавить
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                  >Срок выполнения</label
                >
                <input
                  v-model="taskForm.deadlineAt"
                  type="date"
                  class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-brand outline-none focus:bg-white focus:border-brand-green transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
                  >Специализация</label
                >
                <select
                  v-model="taskForm.requiredSpecialization"
                  class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-brand outline-none focus:bg-white focus:border-brand-green transition-all appearance-none cursor-pointer"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-brand border border-brand-border shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-brand-dark">Назначить исполнителя</h3>
            <Info class="w-4 h-4 text-brand-gray" />
          </div>

          <div class="relative mb-6">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
            <input
              v-model="searchMember"
              type="text"
              placeholder="Поиск участников..."
              class="w-full pl-10 pr-4 py-2 bg-brand-light border border-transparent rounded-brand text-sm outline-none focus:border-brand-green transition-all"
            />
          </div>

          <p class="text-[10px] font-bold text-brand-gray uppercase tracking-widest mb-4">
            Рекомендуемые специалисты (СППР рейтинг)
          </p>

          <div v-if="isLoadingExperts" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-green"></div>
          </div>

          <div v-else class="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            <div
              v-for="expert in filteredExperts"
              :key="expert.id"
              @click="taskForm.developer.id = expert.id"
              :class="[
                'p-4 rounded-xl border transition-all cursor-pointer group',
                taskForm.developer.id === expert.id
                  ? 'border-brand-green bg-brand-green/5 shadow-sm'
                  : 'border-transparent bg-brand-light hover:bg-white hover:border-brand-border',
              ]"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="expert.avatar"
                  class="w-10 h-10 rounded-full object-cover border border-white"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <p class="text-sm font-bold text-brand-dark truncate">{{ expert.name }}</p>
                    <span
                      class="text-[9px] font-extrabold text-brand-green bg-white px-1.5 py-0.5 rounded border border-brand-green/20"
                    >
                      {{ expert.match }}%
                    </span>
                  </div>
                  <p class="text-[10px] text-brand-gray font-medium">{{ expert.roleName }}</p>
                </div>
                <Check
                  v-if="taskForm.developer.id === expert.id"
                  class="w-4 h-4 text-brand-green"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <VButton variant="secondary" class="flex-1" @click="$router.back()">Отмена</VButton>
          <VButton
            variant="primary"
            class="flex-1 shadow-lg shadow-brand-green/20"
            :loading="isSubmitting"
            @click="handleSubmit"
          >
            {{ isEditMode ? 'Сохранить изменения' : 'Создать' }}
          </VButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ArrowLeft, Search, Info, Check } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import apiClient from '../api/client'
import { authService } from '../api/auth'
import VButton from '../components/base/VButton.vue'

const router = useRouter()
const route = useRoute()
const currentUser = authService.getUser()

// Системные состояния
const isSubmitting = ref(false)
const isLoadingExperts = ref(false)
const isLoadingDeps = ref(false)
const searchMember = ref('')
const suggestedExperts = ref([])
const departments = ref([])

// Флаг режима редактирования
const isEditMode = computed(() => !!route.params.id)

const priorities = [
  { label: 'Низкий', value: 'LOW' },
  { label: 'Средний', value: 'MEDIUM' },
  { label: 'Высокий', value: 'HIGH' },
]

const taskForm = reactive({
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  requiredSpecialization: 'Frontend',
  departmentId: null,
  deadlineAt: null,
  creator: { id: 1 },
  assignee: { id: currentUser?.id || 1 },
  developer: { id: null },
  spentHours: 0,
  skills: [],
})

// Подгрузка задачи, если мы в режиме редактирования
const fetchTaskForEdit = async () => {
  if (!isEditMode.value) return

  try {
    const response = await apiClient.get(`/tasks/${route.params.id}`)
    const task = response.data

    // Заполняем форму реактивными данными из бэкенда
    taskForm.title = task.title
    taskForm.description = task.description
    taskForm.status = task.status
    taskForm.priority = task.priority
    taskForm.requiredSpecialization = task.requiredSpecialization || 'Frontend'
    taskForm.departmentId = task.department?.id || task.departmentId
    taskForm.developer.id = task.developer?.id
    taskForm.skills = task.skills ? [...task.skills] : []

    // Форматируем дату для input type="date" (yyyy-MM-dd)
    if (task.deadlineAt) {
      taskForm.deadlineAt = task.deadlineAt.split('T')[0]
    }
  } catch (err) {
    console.error('Не удалось загрузить задачу для редактирования', err)
    alert('Ошибка при загрузке данных задачи')
  }
}

// Загрузка команды
const fetchExperts = async () => {
  isLoadingExperts.value = true
  try {
    const response = await apiClient.get('/developers/profile')
    suggestedExperts.value = response.data.map((user) => ({
      id: user.id,
      name: user.name,
      roleName: user.role?.name || 'Developer',
      match: 0, // Изначально 0, далее будем заменять на расчет бэкенда
      avatar: `https://i.pravatar.cc/150?u=${user.id}`,
    }))

    // Как только загрузили экспертов, считаем для них стартовый скор совместимости
    calculateScores()
  } catch (err) {
    console.error('Не удалось загрузить команду', err)
  } finally {
    isLoadingExperts.value = false
  }
}

const fetchDepartments = async () => {
  isLoadingDeps.value = true
  try {
    const response = await apiClient.get('/departments')
    departments.value = response.data
    if (!isEditMode.value && departments.value.length > 0) {
      taskForm.departmentId = departments.value[0].id
    }
  } catch (error) {
    console.error('Ошибка при загрузке отделов:', error)
  } finally {
    isLoadingDeps.value = false
  }
}

// Функция-заглушка для интеграции со скорингом СППР (Шаг 2)
const calculateScores = () => {
  console.log('Вызываем расчет совместимости для параметров:', taskForm)
  // На следующем шаге мы сделаем сюда реальный POST запрос на бэкенд
  suggestedExperts.value.forEach((expert) => {
    if (!expert.match || expert.match === 0) {
      expert.match = Math.floor(Math.random() * 20) + 75 // Временный фолбэк
    }
  })
}

// Следим за изменениями параметров формы, чтобы пересчитывать проценты на лету!
watch(
  () => [taskForm.requiredSpecialization, taskForm.priority, taskForm.description],
  () => {
    calculateScores()
  },
)

const filteredExperts = computed(() => {
  if (!searchMember.value) return suggestedExperts.value
  return suggestedExperts.value.filter((e) =>
    e.name.toLowerCase().includes(searchMember.value.toLowerCase()),
  )
})

onMounted(async () => {
  await fetchDepartments()
  await fetchTaskForEdit()
  await fetchExperts()
})

const handleSubmit = async () => {
  if (!taskForm.title) return alert('Введите название задачи')

  isSubmitting.value = true
  try {
    const payload = {
      ...taskForm,
      updatedAt: new Date().toISOString(),
    }

    if (payload.deadlineAt) {
      const dateObj = new Date(payload.deadlineAt)
      payload.deadlineAt = dateObj.toISOString().split('.')[0]
    }

    if (isEditMode.value) {
      // Если редактирование — шлем PUT / PATCH запрос
      await apiClient.put(`/tasks/${route.params.id}`, payload)
    } else {
      // Если создание — шлем стандартный POST запрос
      payload.createdAt = new Date().toISOString()
      await apiClient.post('/tasks', payload)
    }

    router.push('/tasks')
  } catch (err) {
    alert('Ошибка при сохранении задачи')
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

// 3. Метод добавления тега в список
const addTag = () => {
  const tag = newTagInput.value.trim()
  if (!tag) return

  // Проверяем, чтобы тег не дублировался
  if (!taskForm.skills.includes(tag)) {
    taskForm.skills.push(tag)
  }

  newTagInput.value = '' // Очищаем поле ввода
}

// 4. Метод удаления тега по его индексу
const removeTag = (index) => {
  taskForm.tags.splice(index, 1)
}
</script>
