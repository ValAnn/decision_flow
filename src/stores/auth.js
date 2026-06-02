import { defineStore } from 'pinia'
import api from '@/api/axios'

const parseStoredUser = () => {
  const raw = localStorage.getItem('user-data')
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return { id: raw, username: raw }
  }
}

const pickFirst = (obj, keys, fallback = null) => {
  for (const key of keys) {
    const value = obj?.[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value
    }
  }
  return fallback
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: parseStoredUser(),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    displayName: (state) => {
      if (!state.user) return 'Пользователь'
      if (typeof state.user === 'string') return state.user
      return (
        state.user.fullName ||
        state.user.full_name ||
        state.user.name ||
        state.user.username ||
        state.user.login ||
        String(state.user.id || 'Пользователь')
      )
    },
    username: (state) => {
      if (!state.user) return 'Пользователь'
      if (typeof state.user === 'string') return state.user
      return state.user.username || state.user.login || state.user.name || String(state.user.id || 'Пользователь')
    },
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials)
        const data = response.data || {}

        this.token = data.token
        this.user = {
          id: pickFirst(data, ['id', 'userId']),
          username: pickFirst(data, ['username', 'login', 'userName'], credentials.username),
          fullName: pickFirst(data, ['fullName', 'full_name', 'name']),
          role: pickFirst(data, ['role']),
        }

        localStorage.setItem('token', this.token)
        localStorage.setItem('user-data', JSON.stringify(this.user))

        return data
      } catch (error) {
        console.error('Ошибка входа:', error)
        throw error
      }
    },

    async register(userData) {
      return await api.post('/auth/register', userData)
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user-data')
    },
  },
})

