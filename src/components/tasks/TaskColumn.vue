<template>
  <div class="flex flex-col min-w-[300px] max-w-[350px] h-full bg-brand-light/50 rounded-2xl p-4">
    <div class="flex items-center justify-between mb-6 px-2">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-extrabold text-brand-dark uppercase tracking-widest">
          {{ title }}
        </h3>
        <span
          class="bg-white text-brand-gray text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-border"
        >
          {{ tasks.length }}
        </span>
      </div>
      <button class="text-brand-gray hover:text-brand-dark transition-colors">
        <MoreHorizontal class="w-5 h-5" />
      </button>
    </div>

    <div class="flex-1 space-y-4 overflow-y-auto no-scrollbar">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />

      <button
        class="w-full py-3 border-2 border-dashed border-brand-border rounded-xl text-brand-gray hover:text-brand-green hover:border-brand-green hover:bg-white transition-all flex items-center justify-center gap-2 text-xs font-bold mt-2"
      >
        <Plus class="w-4 h-4" /> Добавить задачу
      </button>
    </div>
  </div>
</template>

<script setup>
import { MoreHorizontal, Plus } from 'lucide-vue-next'
import TaskCard from './TaskCard.vue'

defineProps({
  title: String,
  tasks: Array,
})
</script>
