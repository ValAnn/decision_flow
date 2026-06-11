<template>
  <div class="p-8 space-y-8">
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
            <div
              v-if="!dept.topAnalysts || dept.topAnalysts.length === 0"
              class="text-xs text-gray-600 italic"
            >
              Нет данных
            </div>
            <div
              v-for="(analystName, index) in dept.topAnalysts"
              :key="index"
              class="flex items-center justify-between"
            >
              <span class="text-sm font-medium text-gray-700">{{ analystName }}</span>
              <span class="text-xs text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">
                Аналитик
              </span>
            </div>
          </div>
        </div>

        <div>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Топ Разработчиков
          </p>
          <div class="space-y-3">
            <div
              v-if="!dept.topDevelopers || dept.topDevelopers.length === 0"
              class="text-xs text-gray-600 italic"
            >
              Нет данных
            </div>
            <div
              v-for="(developerName, index) in dept.topDevelopers"
              :key="index"
              class="flex items-center justify-between"
            >
              <span class="text-sm font-medium text-gray-700">{{ developerName }}</span>
              <span class="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                Разработчик
              </span>
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

const fetchDepartments = async () => {
  try {
    // Поменяли адрес на нашу новую ручку
    const response = await fetch('http://localhost:8080/api/departments/top-staff')
    if (!response.ok) throw new Error('Ошибка при загрузке данных')
    const data = await response.json()
    departments.value = data
  } catch (error) {
    console.error('Ошибка при получении топ-сотрудников департаментов:', error)
  }
}

onMounted(() => {
  fetchDepartments()
})

const filteredDepartments = computed(() => {
  return departments.value.filter(
    (d) =>
      d.departmentName && d.departmentName.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>
