<template>
  <div class="p-8 space-y-8">
    <div class="relative max-w-md">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по департаментам..."
        class="w-full border border-brand-green/50 rounded-xl py-3 pl-10 pr-4 focus:border-brand-green outline-none transition-all"
      />
    </div>

    <div
      v-if="filteredDepartments.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="dept in filteredDepartments"
        :key="dept.departmentId"
        class="border border-brand-green/50 rounded-2xl p-6 hover:border-brand-green/30 transition-all"
      >
        <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
          <Building2 class="text-brand-green w-5 h-5" />
          {{ dept.departmentName }}
        </h3>

        <div class="mb-6">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Топ Аналитиков
          </p>
          <div class="space-y-3">
            <div v-if="dept.topAnalysts.length === 0" class="text-xs text-gray-600 italic">
              Нет данных
            </div>
            <div
              v-for="(user, index) in dept.topAnalysts"
              :key="index"
              class="flex items-center justify-between"
            >
              <span class="text-sm">{{ user.fullName }}</span>
              <span class="text-xs text-brand-green bg-brand-green/10 px-2 py-1 rounded"
                >{{ user.completionRate }}%</span
              >
            </div>
          </div>
        </div>

        <div>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Топ Разработчиков
          </p>
          <div class="space-y-3">
            <div v-if="dept.topDevelopers.length === 0" class="text-xs text-gray-600 italic">
              Нет данных
            </div>
            <div
              v-for="(user, index) in dept.topDevelopers"
              :key="index"
              class="flex items-center justify-between"
            >
              <span class="text-sm">{{ user.fullName }}</span>
              <span class="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded"
                >{{ user.completionRate }}%</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-12">
      Департаменты не найдены или загружаются...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Building2 } from 'lucide-vue-next'

const searchQuery = ref('')
const departments = ref([])

// Функция загрузки данных
const fetchDepartments = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/departments/teams')
    if (!response.ok) throw new Error('Ошибка при загрузке данных')
    const data = await response.json()
    departments.value = data
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

// Запускаем загрузку при открытии страницы
onMounted(() => {
  fetchDepartments()
})

const filteredDepartments = computed(() => {
  return departments.value.filter((d) =>
    d.departmentName.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>
