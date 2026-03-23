<template>
  <button
    :class="[
      'flex items-center justify-center font-semibold rounded-brand transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
    ]"
    :disabled="loading"
  >
    <span v-if="loading" class="mr-2 animate-spin">◌</span>
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  loading: Boolean,
})

const variantClasses = {
  primary: 'bg-brand-green text-white hover:bg-green-600 shadow-sm',
  secondary: 'bg-brand-border text-brand-dark hover:bg-gray-200',
  outline:
    'border-2 border-brand-border text-brand-gray hover:border-brand-green hover:text-brand-green',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}
</script>
