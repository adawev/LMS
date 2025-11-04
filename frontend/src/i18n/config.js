import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  uz: {
    translation: {
      login: 'Kirish',
      register: 'Ro\'yxatdan o\'tish',
      email: 'Email',
      password: 'Parol',
      firstName: 'Ism',
      lastName: 'Familiya',
      courses: 'Kurslar',
      modules: 'Modullar',
      students: 'Talabalar',
      teachers: 'O\'qituvchilar',
      dashboard: 'Bosh sahifa',
      logout: 'Chiqish',
      profile: 'Profil',
      settings: 'Sozlamalar',
    },
  },
  ru: {
    translation: {
      login: 'Войти',
      register: 'Регистрация',
      email: 'Email',
      password: 'Пароль',
      firstName: 'Имя',
      lastName: 'Фамилия',
      courses: 'Курсы',
      modules: 'Модули',
      students: 'Студенты',
      teachers: 'Преподаватели',
      dashboard: 'Главная',
      logout: 'Выход',
      profile: 'Профиль',
      settings: 'Настройки',
    },
  },
  en: {
    translation: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      courses: 'Courses',
      modules: 'Modules',
      students: 'Students',
      teachers: 'Teachers',
      dashboard: 'Dashboard',
      logout: 'Logout',
      profile: 'Profile',
      settings: 'Settings',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'uz',
  fallbackLng: 'uz',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
