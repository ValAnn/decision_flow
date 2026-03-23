<template>
  <div
    class="bg-white p-4 rounded-xl border border-brand-border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
  >
    <div class="flex justify-between items-start mb-3">
      <span
        :class="[
          'text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded',
          priorityClasses[task.priority],
        ]"
      >
        {{ task.priority }} priority
      </span>
      <span class="text-[10px] font-bold text-gray-400">TF-{{ task.id }}</span>
    </div>

    <h4
      class="text-sm font-bold text-brand-dark leading-snug group-hover:text-brand-green transition-colors"
    >
      {{ task.title }}
    </h4>

    <p v-if="task.description" class="text-xs text-brand-gray mt-2 line-clamp-2">
      {{ task.description }}
    </p>

    <div v-if="task.progress" class="mt-4">
      <div class="flex justify-between items-center mb-1">
        <div class="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-brand-green" :style="{ width: task.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-brand-light flex justify-between items-center">
      <div class="flex items-center gap-2 text-brand-gray">
        <Calendar class="w-3.5 h-3.5" />
        <span class="text-[10px] font-medium">{{ task.date }}</span>
      </div>
      <img
        :src="task.assignee.avatar"
        class="w-6 h-6 rounded-full border border-white shadow-sm"
        :title="task.assignee.name"
      />
    </div>
  </div>
</template>

<script setup>
import { Calendar } from 'lucide-vue-next'

defineProps({
  task: Object,
})

const priorityClasses = {
  High: 'bg-orange-50 text-orange-600',
  Medium: 'bg-blue-50 text-blue-600',
  Low: 'bg-gray-50 text-gray-600',
}
</script>
