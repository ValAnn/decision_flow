<template>
  <div class="space-y-8">
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <Loader2 class="w-10 h-10 text-brand-green animate-spin mb-4" />
      <p class="text-brand-gray">Синхронизация с базой данных...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 p-6 rounded-2xl text-center">
      <p class="text-red-600 font-bold">{{ error }}</p>
      <VButton variant="secondary" class="mt-4" @click="fetchTeam">Попробовать снова</VButton>
    </div>

    <!-- <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="member in paginatedTeam" :key="member.id" ...></div>
    </div> -->

    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-brand-dark">Наша команда</h1>
        <p class="text-sm text-brand-gray mt-1">
          Управление ресурсами и мониторинг загрузки специалистов
        </p>
      </div>

      <div class="flex gap-4">
        <div class="bg-white px-4 py-2 rounded-xl border border-brand-border shadow-sm">
          <p class="text-[10px] font-bold text-brand-gray uppercase">Всего в поиске</p>
          <p class="text-xl font-bold text-brand-dark">{{ filteredTeamAll.length }}</p>
        </div>
        <div class="bg-white px-4 py-2 rounded-xl border border-brand-border shadow-sm">
          <p class="text-[10px] font-bold text-brand-gray uppercase">Ср. загрузка</p>
          <p class="text-xl font-bold text-brand-green">74%</p>
        </div>
      </div>
    </div>

    <div
      class="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex flex-wrap gap-4 items-center"
    >
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по имени или навыкам..."
          class="w-full pl-10 pr-4 py-2 bg-brand-light border border-transparent rounded-brand text-sm focus:bg-white focus:border-brand-green outline-none transition-all"
        />
      </div>

      <select
        v-model="filterDept"
        class="px-4 py-2 bg-brand-light border border-transparent rounded-brand text-sm outline-none focus:border-brand-green cursor-pointer"
      >
        <option value="">Все департаменты</option>
        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
      </select>

      <select
        v-model="filterProject"
        class="px-4 py-2 bg-brand-light border border-transparent rounded-brand text-sm outline-none focus:border-brand-green cursor-pointer"
      >
        <option value="">Все проекты</option>
        <option v-for="proj in projects" :key="proj" :value="proj">{{ proj }}</option>
      </select>

      <VButton variant="secondary" size="md" @click="resetFilters" class="text-xs">
        Сбросить
      </VButton>
    </div>

    <div
      v-if="paginatedTeam.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="member in paginatedTeam"
        :key="member.id"
        class="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-all group"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img
                :src="DEFAULT_AVATAR"
                class="w-14 h-14 rounded-full object-cover border-2 border-brand-light"
              />
            </div>
            <div>
              <h3 class="font-bold text-brand-dark group-hover:text-brand-green transition-colors">
                {{ member.name }}
              </h3>
              <p class="text-xs text-brand-gray font-medium">{{ member.specialization }}</p>
            </div>
          </div>
          <button class="p-2 text-brand-gray hover:bg-brand-light rounded-lg transition-colors">
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-2 mb-6">
          <div
            class="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider"
          >
            <span class="text-brand-gray">Текущая загрузка</span>
            <span :class="getLoadColor(member.workload)">{{ member.currentWorkload }}%</span>
          </div>
          <div class="h-1.5 w-full bg-brand-light rounded-full overflow-hidden">
            <div
              :class="['h-full transition-all duration-500', getLoadBg(member.workload)]"
              :style="{ width: member.workload + '%' }"
            ></div>
          </div>
        </div>

        <div class="space-y-3">
          <p class="text-[10px] font-bold text-brand-gray uppercase tracking-widest">
            Активные департаменты
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="proj in member.topDepartments"
              :key="proj"
              class="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md"
            >
              {{ proj }}
            </span>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-brand-light flex gap-3">
          <router-link :to="'/team/' + member.id">
            <VButton variant="secondary" size="md" class="flex-1 text-xs">Профиль</VButton>
          </router-link>
          <VButton variant="primary" size="md" class="flex-1 text-xs">Написать</VButton>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-white py-20 rounded-2xl border border-dashed border-brand-border text-center"
    >
      <div
        class="bg-brand-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Search class="w-8 h-8 text-brand-gray" />
      </div>
      <h3 class="text-lg font-bold text-brand-dark">Никого не нашли</h3>
      <p class="text-brand-gray mt-1">Попробуйте изменить параметры фильтрации</p>
    </div>

    <div
      v-if="totalPages > 1"
      class="mt-10 flex items-center justify-between border-t border-brand-light pt-6"
    >
      <p class="text-sm text-brand-gray">
        Показано
        <span class="font-bold text-brand-dark">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        –
        <span class="font-bold text-brand-dark">{{
          Math.min(currentPage * itemsPerPage, filteredTeamAll.length)
        }}</span>
        из <span class="font-bold text-brand-dark">{{ filteredTeamAll.length }}</span>
      </p>

      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="p-2 rounded-lg border border-brand-border bg-white text-brand-gray hover:text-brand-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-10 h-10 rounded-lg text-sm font-bold transition-all',
              currentPage === page
                ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20'
                : 'bg-white text-brand-gray border border-brand-border hover:border-brand-green',
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-lg border border-brand-border bg-white text-brand-gray hover:text-brand-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiClient from '../api/client' // Импортируем наш клиент
import { Search, Building2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'
import VButton from '../components/base/VButton.vue'

const team = ref([])
const isLoading = ref(true)
const error = ref(null)

// Состояние фильтров и пагинации
const searchQuery = ref('')
const filterDept = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'

// Функция загрузки данных с бэкенда
const fetchTeam = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiClient.get('/developers/profile')
    team.value = response.data
  } catch (err) {
    error.value = 'Не удалось загрузить список команды. Проверьте работу бэкенда.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Вызываем загрузку при старте
onMounted(fetchTeam)

const filteredTeamAll = computed(() => {
  if (!team.value) return []

  return team.value.filter((member) => {
    const full_name = member.full_name || ''

    const matchesSearch = full_name.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesDept = !filterDept.value || member.dept === filterDept.value

    return matchesSearch && matchesDept
  })
})

const paginatedTeam = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTeamAll.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredTeamAll.value.length / itemsPerPage))

// Вспомогательные функции для динамических стилей загрузки
const getLoadColor = (v) => {
  const value = Number(v) || 0 // На случай, если из API пришла строка или null
  if (value > 90) return 'text-red-600'
  if (value > 70) return 'text-amber-600'
  return 'text-brand-green'
}

const getLoadBg = (v) => {
  const value = Number(v) || 0
  if (value > 90) return 'bg-red-500'
  if (value > 70) return 'bg-amber-500'
  return 'bg-brand-green'
}
</script>
