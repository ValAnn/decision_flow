import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // Твой адрес бэкенда
  headers: {
    'Content-Type': 'application/json',
  },
})

// Перехватчик, который будет подставлять токен в каждый запрос
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    // Важно: проверяем, что токен существует и это не строка "undefined"
    if (token && token !== 'undefined') {
      // Используем более надежный способ установки заголовка
      config.headers['Authorization'] = `Bearer ${token}`

      // Отладочный лог: проверь консоль браузера!
      console.log('Заголовок установлен:', config.headers['Authorization'])
    } else {
      console.warn('Токен не найден в localStorage')
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
export default instance
