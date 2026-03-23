<template>
  <aside
    class="fixed left-0 top-0 h-screen w-64 bg-brand-dark text-white flex flex-col p-6 z-50 gap-y-6"
  >
    <div class="flex items-center gap-3 mb-10 px-2">
      <div
        class="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center shadow-lg shadow-brand-green/20"
      >
        <Zap class="w-5 h-5 text-white" :stroke-width="3" />
      </div>
      <span class="text-xl font-extrabold tracking-tight">DecisionFlow</span>
    </div>

    <nav class="flex-1 flex flex-col gap-3">
      <router-link
        v-for="item in mainNavigation"
        :key="item.id"
        :to="item.path"
        v-slot="{ isActive }"
        class="no-underline"
      >
        <div
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-brand transition-all duration-200 group cursor-pointer',
            isActive
              ? 'bg-brand-green/10 text-brand-green'
              : 'text-gray-400 hover:bg-white/5 hover:text-white',
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 transition-colors',
              isActive ? 'text-brand-green' : 'text-gray-400 group-hover:text-white',
            ]"
            :stroke-width="2"
          />
          <span class="font-medium text-sm">{{ item.name }}</span>
        </div>
      </router-link>
    </nav>

    <div class="pt-6 border-t border-white/5 space-y-6">
      <div class="space-y-1">
        <a
          v-for="item in secondaryNavigation"
          :key="item.id"
          href="#"
          class="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors group"
        >
          <component :is="item.icon" class="w-4 h-4" :stroke-width="2" />
          <span>{{ item.name }}</span>
        </a>
      </div>

      <div
        class="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div class="relative">
          <img
            :src="user.avatar"
            class="w-10 h-10 rounded-full object-cover border border-white/10"
            alt="User avatar"
          />
          <div
            class="absolute bottom-0 right-0 w-3 h-3 bg-brand-green border-2 border-brand-dark rounded-full"
          ></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold truncate">{{ user.name }}</p>
          <p class="text-[10px] text-gray-500 font-medium truncate uppercase tracking-tighter">
            {{ user.role }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { Zap } from 'lucide-vue-next'
import { mainNavigation, secondaryNavigation } from '../../mocks/navigation'

// Данные пользователя (обычно приходят из стора/бэкенда)
const user = {
  name: 'Алекс Ривера',
  role: 'Admin Console',
  avatar: 'https://i.pravatar.cc/150?u=alex',
}

const activeTab = ref('overview')
</script>
