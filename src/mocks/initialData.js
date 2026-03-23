export const initialData = {
  user: {
    name: 'Алекс Ривера',
    role: 'Администратор',
    avatar: 'https://i.pravatar.cc/150?u=alex',
  },
  projects: [
    { id: 1, name: 'Редизайн маркетингового сайта' },
    { id: 2, name: 'Разработка мобильного приложения' },
  ],
  stats: [
    { label: 'Всего задач', value: 128, trend: '+12%', up: true },
    { label: 'Ср. нагрузка', value: '74%', trend: '-5%', up: false },
    { label: 'Перегружено', value: 3, trend: '-2%', up: false },
    { label: 'Выполнено', value: '92%', trend: '+4%', up: true },
  ],
}
