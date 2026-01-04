import { createI18n } from 'vue-i18n'
import en from './locales/en'
import th from './locales/th'
import de from './locales/de'
import zh from './locales/zh'

const messages = {
    en,
    th,
    de,
    zh
}

// Get saved language from localStorage or use browser language
const savedLanguage = localStorage.getItem('recur_language')
const browserLanguage = navigator.language.split('-')[0]
const defaultLanguage = savedLanguage || (messages[browserLanguage as keyof typeof messages] ? browserLanguage : 'en')

const i18n = createI18n({
    legacy: false,
    locale: defaultLanguage,
    fallbackLocale: 'en',
    messages,
    globalInjection: true
})

export default i18n
