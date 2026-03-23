<template>
  <div class="flex flex-col gap-1.5 w-full text-left">
    <label v-if="label" class="text-xs font-bold text-brand-dark uppercase tracking-wider">
      {{ label }}
    </label>

    <div class="relative">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        class="w-full px-4 py-2.5 bg-white border border-brand-border rounded-brand text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
})

defineEmits(['update:modelValue'])
</script>
