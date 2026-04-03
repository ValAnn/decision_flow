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

    <nav v-if="authStore.isAuthenticated" class="flex-1 flex flex-col gap-3">
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
              'w-5 h-5',
              isActive ? 'text-brand-green' : 'text-gray-400 group-hover:text-white',
            ]"
            :stroke-width="2"
          />
          <span class="font-medium text-sm">{{ item.name }}</span>
        </div>
      </router-link>
    </nav>

    <div v-if="authStore.isAuthenticated" class="pt-6 border-t border-white/5 space-y-6">
      <div class="space-y-1">
        <a v-for="item in secondaryNavigation" :key="item.id" href="#" class="...">
          <component :is="item.icon" class="w-4 h-4" />
          <span>{{ item.name }}</span>
        </a>
      </div>

      <div
        class="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div class="relative">
          <img :src="DEFAULT_AVATAR" class="w-10 h-10 rounded-full object-cover" />
          <div
            class="absolute bottom-0 right-0 w-3 h-3 bg-brand-green border-2 border-brand-dark rounded-full"
          ></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold truncate">{{ authStore.user?.name || 'Пользователь' }}</p>
          <p class="text-[10px] text-gray-500 font-medium truncate uppercase">
            {{ authStore.user?.role }}
          </p>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full text-xs text-red-400 hover:text-red-300 text-left px-4"
      >
        Выйти из системы
      </button>
    </div>

    <div v-else class="flex-1 flex items-center justify-center">
      <router-link
        to="/login"
        class="text-brand-green border border-brand-green px-6 py-2 rounded-lg hover:bg-brand-green/10 transition-all"
      >
        Войти
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Zap } from 'lucide-vue-next'
import { mainNavigation, secondaryNavigation } from '../../mocks/navigation'
import { useAuthStore } from '@/stores/auth' // Импортируем наш стор

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
