<template>
  <router-view v-if="isAuthPage" />

  <div v-else class="flex min-h-screen bg-brand-light w-screen">
    <AppSidebar />

    <div class="flex-1 ml-64 flex flex-col min-w-0 w-full">
      <AppHeader />

      <main class="p-8 w-full flex-1">
        <div class="w-full mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppHeader from './components/layout/AppHeader.vue'

const route = useRoute()
const isAuthPage = computed(() => route.meta.guest)
</script>

<style>
/* Плавный переход между страницами */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
