import tailwindcss from '@tailwindcss/postcss'
export default defineNuxtConfig({
  compatibilityDate: '2026-06-13',
  css: [
    '~/assets/css/main.css'
  ],
  app: {
    head: {
      htmlAttrs: {
        dir: 'rtl',
        lang: 'fa'
      }
    }
  },
  
vite: {
    css: {
      postcss: {
        plugins: [
          tailwindcss()
        ]
      }
    }
  }
})