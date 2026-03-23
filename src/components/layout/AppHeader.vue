<template>
  <header
    class="h-16 border-b border-brand-border bg-white flex items-center justify-between px-8 sticky top-0 z-40 w-full"
  >
    <div class="flex items-center flex-1">
      <div class="relative w-full group">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray group-focus-within:text-brand-green transition-colors"
        />
        <input
          type="text"
          placeholder="Поиск задач, проектов..."
          class="w-full pl-10 pr-4 py-2 bg-brand-light border border-transparent rounded-brand text-sm focus:outline-none focus:bg-white focus:border-brand-green transition-all"
        />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button
        class="relative p-2 text-brand-gray hover:bg-brand-light rounded-full transition-colors"
      >
        <Bell class="w-5 h-5" />
        <span
          class="absolute top-2 right-2 w-2 h-2 bg-brand-danger rounded-full border-2 border-white"
        ></span>
      </button>

      <div class="h-6 w-[1px] bg-brand-border mx-2"></div>

      <VButton variant="primary" size="md" class="gap-2" @click="$router.push('/create-task')">
        <Plus class="w-4 h-4" />
        <span>Создать задачу</span>
      </VButton>
    </div>
  </header>
</template>

<script setup>
import { Search, Bell, Plus } from 'lucide-vue-next'
import VButton from '../base/VButton.vue'
</script>
