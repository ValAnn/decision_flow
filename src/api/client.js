// src/api/client.js
import axios from 'axios'
import { authService } from './auth'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Перехватчик для добавления JWT в каждый запрос
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient
