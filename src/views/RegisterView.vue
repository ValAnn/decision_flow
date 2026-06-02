<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const form = ref({
  username: '',
  password: '',
  email: '',
  fullName: '',
})

const handleRegister = async () => {
  try {
    await auth.register(form.value)
    alert('Регистрация успешна! Теперь вы можете войти.')
    router.push('/login')
  } catch (err) {
    console.error('Ошибка регистрации:', err)
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <form @submit.prevent="handleRegister" class="p-8 bg-white rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Регистрация</h2>

      <input
        v-model="form.fullName"
        type="text"
        placeholder="Полное имя"
        class="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />
      <input
        v-model="form.username"
        type="text"
        placeholder="Логин (Username)"
        class="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />
      <input
        v-model="form.email"
        type="email"
        placeholder="Email"
        class="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />
      <input
        v-model="form.password"
        type="password"
        placeholder="Пароль"
        class="w-full p-2 mb-6 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />

      <button
        type="submit"
        class="w-full py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
      >
        Создать аккаунт
      </button>

      <p class="mt-4 text-center text-sm text-gray-600">
        Уже есть аккаунт?
        <router-link to="/login" class="text-blue-500 hover:underline">Войти</router-link>
      </p>
    </form>
  </div>
</template>
