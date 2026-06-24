import tailwindcss from "@tailwindcss/postcss";

export default defineNuxtConfig({
  compatibilityDate: "2026-06-13",
  future: { compatibilityVersion: 4 },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    internalApiBase: `${process.env.BACKEND_URL || "http://localhost:3000"}/api`,
    public: {
      apiBase: "/api",
    },
  },

  routeRules: {
    "/flipHTML/**": { ssr: false, static: true },
  },
  app: {
    head: {
      htmlAttrs: { dir: "rtl", lang: "fa", "data-theme": "light" },
      script: [
        {
          id: "initial-theme",
          tagPriority: -20,
          innerHTML: `(function(){try{var saved=localStorage.getItem('theme');var theme=saved==='dark'||(!saved&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';document.documentElement.setAttribute('data-theme',theme);document.documentElement.style.colorScheme=theme;}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light';}})();`,
        },
      ],
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit", "lucide-vue-next"],
    },
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  },
});
