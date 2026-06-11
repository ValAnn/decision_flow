<template>
  <div class="max-w-3xl mx-auto pb-20">
    <div class="mb-8">
      <button
        @click="$router.back()"
        class="flex items-center gap-2 text-brand-gray hover:text-brand-green transition-colors mb-4 group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span class="text-sm font-semibold">Назад</span>
      </button>

      <h1 class="text-3xl font-bold text-brand-dark">
        {{ isEditMode ? 'Редактировать разработчика' : 'Добавить разработчика' }}
      </h1>
      <p class="text-brand-gray text-sm mt-1">
        {{
          isEditMode
            ? 'Изменение личных данных и матрицы компетенций сотрудника'
            : 'Создание учетной записи и привязка профессиональных навыков'
        }}
      </p>
    </div>

    <div v-if="isLoadingData" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white p-8 rounded-3xl border border-brand-border shadow-sm space-y-6">
        <h3 class="text-sm font-black text-brand-gray uppercase tracking-wider">
          Системные данные
        </h3>

        <div>
          <label class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
            >ФИО Разработчика</label
          >
          <input
            v-model="form.fullName"
            type="text"
            placeholder="Иван Иванов"
            class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-xl focus:bg-white focus:border-brand-green outline-none transition-all"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
              >Имя пользователя (Username)</label
            >
            <input
              v-model="form.username"
              type="text"
              placeholder="ivan_dev"
              class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-xl focus:bg-white focus:border-brand-green outline-none transition-all"
              required
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
              >Email</label
            >
            <input
              v-model="form.email"
              type="email"
              placeholder="ivan@company.com"
              class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-xl focus:bg-white focus:border-brand-green outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
            >Грейд (Grade)</label
          >
          <select
            v-model="form.grade"
            class="w-full px-4 py-3 bg-brand-light border border-transparent rounded-xl focus:bg-white focus:border-brand-green outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="Junior">Junior</option>
            <option value="Middle">Middle</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>
      </div>

      <div class="bg-white p-8 rounded-3xl border border-brand-border shadow-sm space-y-6">
        <h3 class="text-sm font-black text-brand-gray uppercase tracking-wider">
          Профессиональные навыки (Skills)
        </h3>

        <div class="flex flex-col md:flex-row gap-4 items-end bg-brand-light/50 p-4 rounded-xl">
          <div class="flex-1">
            <label class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2"
              >Выберите навык из базы</label
            >
            <select
              v-model="selectedSkillId"
              class="w-full px-4 py-3 bg-white border border-brand-border rounded-xl outline-none"
            >
              <option :value="null" disabled>-- Выберите навык --</option>
              <option v-for="skill in availableSkills" :key="skill.id" :value="skill.id">
                {{ skill.name }} ({{ skill.category }})
              </option>
            </select>
          </div>

          <div class="flex items-center gap-2 pb-3">
            <input
              type="checkbox"
              id="isPrimary"
              v-model="isPrimarySelection"
              class="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
            />
            <label id="isPrimary" class="text-xs font-bold text-brand-dark cursor-pointer"
              >Сделать главным (Специализация)</label
            >
          </div>

          <button
            type="button"
            @click="addSkillToProfile"
            class="px-5 py-3 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-brand-dark/90 transition-all"
          >
            Добавить
          </button>
        </div>

        <div class="space-y-3">
          <label class="block text-[11px] font-bold text-brand-gray uppercase tracking-wider"
            >Выбранная матрица компетенций:</label
          >

          <div
            v-if="addedSkillsDisplay.length === 0"
            class="text-center py-6 border-2 border-dashed border-brand-border rounded-xl text-brand-gray text-xs"
          >
            Навыки еще не выбраны. Добавьте хотя бы специализацию.
          </div>

          <div v-else class="grid grid-cols-1 gap-2">
            <div
              v-for="item in addedSkillsDisplay"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-white border rounded-xl"
              :class="
                item.isPrimary ? 'border-brand-green bg-brand-green/5' : 'border-brand-border'
              "
            >
              <div class="flex items-center gap-3">
                <span
                  v-if="item.isPrimary"
                  class="bg-brand-green text-white text-[9px] font-black uppercase px-2 py-0.5 rounded"
                >
                  Специализация
                </span>
                <span class="text-sm font-bold text-brand-dark">{{ item.name }}</span>
              </div>
              <button
                @click="removeSkill(item.id)"
                type="button"
                class="text-red-500 hover:text-red-700 text-xs font-semibold"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <VButton variant="secondary" class="flex-1" type="button" @click="$router.back()"
          >Отмена</VButton
        >
        <VButton
          variant="primary"
          class="flex-1 shadow-lg shadow-brand-green/20"
          :loading="isSubmitting"
        >
          {{ isEditMode ? 'Сохранить изменения' : 'Создать профиль' }}
        </VButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import apiClient from '../api/axios'
import VButton from '../components/base/VButton.vue'

const router = useRouter()
const route = useRoute()

// Проверяем режим работы по наличию ID в параметрах роутера
const developerId = computed(() => route.params.id)
const isEditMode = computed(() => !!developerId.value)

// Состояния загрузки
const isSubmitting = ref(false)
const isLoadingData = ref(false)

const availableSkills = ref([])
const selectedSkillId = ref(null)
const isPrimarySelection = ref(false)
const addedSkillsDisplay = ref([])

const form = ref({
  fullName: '',
  username: '',
  email: '',
  grade: 'Middle',
  specializationId: null,
  skillIds: [],
})

// Загрузка словаря навыков и текущих данных при редактировании
const initPage = async () => {
  isLoadingData.value = true
  try {
    // 1. Сначала грузим справочник навыков
    const skillsResponse = await apiClient.get('/skills').catch(() => null)
    availableSkills.value = skillsResponse?.data || [
      { id: 1, name: 'Vue.js', category: 'Frontend' },
      { id: 2, name: 'Spring Boot', category: 'Backend' },
      { id: 3, name: 'PostgreSQL', category: 'Database' },
      { id: 4, name: 'Docker', category: 'DevOps' },
    ]

    // 2. Если мы в режиме редактирования — запрашиваем старые данные сотрудника
    if (isEditMode.value) {
      const profileResponse = await apiClient.get(`/developers/${developerId.value}/profile`)
      const devData = profileResponse.data

      // Наполняем форму данными, которые вернул бэкенд (DTO)
      form.value.fullName = devData.name
      // Так как DTO не возвращает email/username для просмотра, мы можем оставить их пустыми
      // или расширить твой DTO на бэкенде. Пока ставим заглушки, чтобы не упало:
      form.value.username = devData.username || devData.name.toLowerCase().replace(' ', '_')
      form.value.email = devData.email || `${form.value.username}@company.com`
      form.value.grade = devData.grade || 'Middle'

      // Если у разработчика есть специализация, находим её ID и выводим в список
      if (devData.specialization && devData.specialization !== 'Не указано') {
        const foundSkill = availableSkills.value.find((s) => s.name === devData.specialization)
        if (foundSkill) {
          form.value.specializationId = foundSkill.id
          addedSkillsDisplay.value.push({
            id: foundSkill.id,
            name: foundSkill.name,
            isPrimary: true,
          })
        }
      }
    }
  } catch (err) {
    console.error('Ошибка инициализации страницы:', err)
  } finally {
    isLoadingData.value = false
  }
}

const addSkillToProfile = () => {
  if (!selectedSkillId.value) return
  const skill = availableSkills.value.find((s) => s.id === selectedSkillId.value)
  if (!skill) return

  if (addedSkillsDisplay.value.some((s) => s.id === skill.id)) {
    alert('Этот навык уже добавлен!')
    return
  }

  if (isPrimarySelection.value) {
    addedSkillsDisplay.value.forEach((s) => (s.isPrimary = false))
    form.value.specializationId = skill.id
  }

  addedSkillsDisplay.value.push({
    id: skill.id,
    name: skill.name,
    isPrimary: isPrimarySelection.value,
  })

  selectedSkillId.value = null
  isPrimarySelection.value = false
  syncSkillIds()
}

const removeSkill = (id) => {
  addedSkillsDisplay.value = addedSkillsDisplay.value.filter((s) => s.id !== id)
  if (form.value.specializationId === id) form.value.specializationId = null
  syncSkillIds()
}

const syncSkillIds = () => {
  form.value.skillIds = addedSkillsDisplay.value.filter((s) => !s.isPrimary).map((s) => s.id)
}

onMounted(initPage)

// Отправка запроса: POST (создание) или PUT (редактирование)
const handleSubmit = async () => {
  if (!form.value.specializationId) {
    alert('Пожалуйста, выберите специализацию (сделайте один навык главным)!')
    return
  }

  isSubmitting.value = true
  try {
    if (isEditMode.value) {
      // Вызываем @PutMapping("/{id}") из твоего контроллера
      await apiClient.put(`/developers/${developerId.value}`, form.value)
      alert('Данные разработчика успешно обновлены!')
    } else {
      // Вызываем @PostMapping из твоего контроллера
      await apiClient.post('/developers', form.value)
      alert('Новый разработчик успешно добавлен!')
    }
    router.push('/team')
  } catch (err) {
    console.error('Ошибка сохранения:', err)
    alert(err.response?.data || 'Произошла ошибка при сохранении данных')
  } finally {
    isSubmitting.value = false
  }
}
</script>
