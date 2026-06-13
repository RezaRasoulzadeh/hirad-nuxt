export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'neutral'
    },
    // Define the custom brand shades directly for Nuxt UI components
    theme: {
      colors: {
        brand: {
          50: '#fdf2f4',
          100: '#fbe4e8',
          200: '#f7ccd4',
          300: '#f1a8b6',
          400: '#e77c93',
          500: '#a94456', // brand-light
          600: '#923043', // brand (default)
          700: '#751b31', // brand-dark
          800: '#611928',
          900: '#521824',
          950: '#2e0a11'
        }
      }
    }
  }
})