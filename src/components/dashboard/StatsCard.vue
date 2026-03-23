<template>
  <div
    class="bg-white p-6 rounded-brand border border-brand-border hover:shadow-md transition-shadow"
  >
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-brand-gray">{{ title }}</p>
        <h3 class="text-2xl font-bold text-brand-dark mt-1">{{ value }}</h3>
      </div>

      <div :class="['p-2 rounded-lg', iconBgClass]">
        <component :is="icon" class="w-5 h-5" :class="iconColorClass" />
      </div>
    </div>

    <div class="mt-4 flex items-center gap-2">
      <span
        :class="[
          'text-xs font-semibold px-2 py-0.5 rounded-full',
          trendPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
        ]"
      >
        {{ trendPositive ? '+' : '' }}{{ trendValue }}%
      </span>
      <span class="text-xs text-brand-gray">за прошлый месяц</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: Object, // Компонент иконки Lucide
  iconBgClass: { type: String, default: 'bg-brand-light' },
  iconColorClass: { type: String, default: 'text-brand-dark' },
  trendValue: Number,
  trendPositive: Boolean,
})
</script>
