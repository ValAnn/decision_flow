<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const form = ref({ username: '', password: '' })
const error = ref('')

const handleLogin = async () => {
  try {
    await auth.login(form.value)
    router.push('/dashboard') // Куда идем после успеха
  } catch (err) {
    error.value = 'Неверный логин или пароль'
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="handleLogin" class="p-8 bg-white rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Вход в систему</h2>

      <input
        v-model="form.username"
        type="text"
        placeholder="Логин"
        class="w-full p-2 mb-4 border rounded"
        required
      />

      <input
        v-model="form.password"
        type="password"
        placeholder="Пароль"
        class="w-full p-2 mb-4 border rounded"
        required
      />

      <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

      <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Войти
      </button>

      <p class="mt-4 text-center text-sm text-gray-600">
        Нет аккаунта?
        <router-link to="/register" class="text-blue-500">Зарегистрироваться</router-link>
      </p>
    </form>
  </div>
</template>
