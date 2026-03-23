// src/api/auth.js
import apiClient from './client'

export const authService = {
  async login(credentials) {
    // credentials = { username: '...', password: '...' }
    const response = await apiClient.post('/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('user-token', response.data.token)
      localStorage.setItem('user-data', JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout() {
    localStorage.removeItem('user-token')
    localStorage.removeItem('user-data')
    window.location.href = '/login'
  },

  getToken() {
    return localStorage.getItem('user-token')
  },

  getUser() {
    const data = localStorage.getItem('user-data')
    return data ? JSON.parse(data) : null
  },
}
