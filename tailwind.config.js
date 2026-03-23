/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1ab51a',
          // Темный текст и заголовки
          dark: '#111827',
          // Второстепенный текст (серый)
          gray: '#6b7280',
          // Фон для страниц
          light: '#f9fafb',
          border: '#e5e7eb',
          danger: '#ef4444',
        },
      },
      borderRadius: {
        brand: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
