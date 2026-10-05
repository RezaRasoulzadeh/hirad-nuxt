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
    "/fonts/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
    "/flipHTML/**": { ssr: false, static: true },
  },
  app: {
    head: {
      htmlAttrs: { dir: "rtl", lang: "fa", "data-theme": "light" },
      style: [{ innerHTML: ':root{color-scheme:light}' }],
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
