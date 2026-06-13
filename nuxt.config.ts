export default defineNuxtConfig({
  compatibilityDate: "2026-06-13",
  modules: ["@nuxt/ui", "@nuxtjs/i18n", "@vueuse/nuxt", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  
  runtimeConfig: {
    public: {
      baseURL: import.meta.env.NUXT_PUBLIC_BASE_URL ?? "http://localhost:3000/api",
    },
  },

  // @ts-ignore
  i18n: {
    locales: [
      { code: 'fa', file: 'fa.yaml' },
      { code: 'en', file: 'en.yaml' },
    ],
    defaultLocale: 'fa',
  },

  vite: {
    plugins: [
      (await import('vite-svg-loader')).default()
    ]
  },

  imports: {
    presets: []
  },
});