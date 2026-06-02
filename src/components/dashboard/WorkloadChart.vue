<template>
  <div class="bg-white p-6 rounded-brand border border-brand-border h-full">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-lg font-bold text-brand-dark">Нагрузка команды</h3>
        <p class="text-sm text-brand-gray">Распределение задач</p>
      </div>
      <select
        :value="period"
        @change="$emit('change-period', $event.target.value)"
        class="text-sm border-none bg-brand-light rounded-md px-2 py-1 focus:ring-0"
      >
        <option value="week">Неделя</option>
      </select>
    </div>

    <div v-if="!workloadData.length" class="h-48 flex items-center justify-center text-sm text-brand-gray">
      Нет данных
    </div>

    <div v-else class="flex items-end justify-between h-48 gap-2">
      <div v-for="day in workloadData" :key="day.label" class="flex-1 flex flex-col items-center group">
        <div class="w-full relative flex items-end justify-center h-full">
          <div
            class="absolute -top-8 bg-brand-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
          >
            {{ day.value }} задач
          </div>

          <div
            class="w-full max-w-[32px] bg-brand-green/20 rounded-t-sm group-hover:bg-brand-green transition-all duration-300 relative"
            :style="{ height: `${(Number(day.value || 0) / maxTasks) * 100}%` }"
          >
            <div class="absolute top-0 left-0 w-full h-1 bg-brand-green rounded-t-sm"></div>
          </div>
        </div>

        <span class="text-[11px] font-medium text-brand-gray mt-3 uppercase tracking-wider">
          {{ day.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineEmits(['change-period'])

const props = defineProps({
  workloadData: {
    type: Array,
    default: () => [],
  },
  period: {
    type: String,
    default: 'week',
  },
})

const maxTasks = computed(() => {
  if (!props.workloadData.length) return 1
  return Math.max(...props.workloadData.map((d) => Number(d.value) || 0), 1)
})
</script>

