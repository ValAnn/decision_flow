<template>
  <div class="bg-white p-6 rounded-brand border border-brand-border h-full">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-lg font-bold text-brand-dark">Нагрузка команды</h3>
        <p class="text-sm text-brand-gray">Распределение задач на неделю</p>
      </div>
      <select class="text-sm border-none bg-brand-light rounded-md px-2 py-1 focus:ring-0">
        <option>Эта неделя</option>
        <option>Прошлая неделя</option>
      </select>
    </div>

    <div class="flex items-end justify-between h-48 gap-2">
      <div
        v-for="day in workloadData"
        :key="day.label"
        class="flex-1 flex flex-col items-center group"
      >
        <div class="w-full relative flex items-end justify-center h-full">
          <div
            class="absolute -top-8 bg-brand-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
          >
            {{ day.value }} задач
          </div>

          <div
            class="w-full max-w-[32px] bg-brand-green/20 rounded-t-sm group-hover:bg-brand-green transition-all duration-300 relative"
            :style="{ height: `${(day.value / maxTasks) * 100}%` }"
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

const workloadData = [
  { label: 'Пн', value: 142 },
  { label: 'Вт', value: 138 },
  { label: 'Ср', value: 15 },
  { label: 'Чт', value: 25 },
  { label: 'Пт', value: 20 },
  { label: 'Сб', value: 8 },
  { label: 'Вс', value: 5 },
]

const maxTasks = computed(() => Math.max(...workloadData.map((d) => d.value)) + 5)
</script>
