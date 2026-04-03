import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Загружаем и токен, и данные пользователя при инициализации
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user-data') || null,
  }),

  getters: {
    // Удобная проверка: вошел пользователь или нет
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials)

        // Обновляем состояние стора
        this.token = response.data.token
        this.user = response.data.id // Здесь сохраняется ID или объект пользователя

        // Синхронизируем с localStorage
        localStorage.setItem('token', this.token)
        localStorage.setItem('user-data', this.user)

        return response.data
      } catch (error) {
        console.error('Ошибка входа:', error)
        throw error
      }
    },

    async register(userData) {
      return await api.post('/auth/register', userData)
    },

    logout() {
      // Очищаем всё
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user-data') // Не забываем удалить ID

      // Если используешь vue-router, можно сделать редирект прямо здесь
      // или в компоненте
    },
  },
})
