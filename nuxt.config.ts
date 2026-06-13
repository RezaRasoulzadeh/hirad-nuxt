import tailwindcss from '@tailwindcss/postcss'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-13',
  future: { compatibilityVersion: 4 },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000/api'
    }
  },
  app: {
    head: {
      htmlAttrs: { dir: 'rtl', lang: 'fa' }
    }
  },
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss()]
      }
    }
  }
})