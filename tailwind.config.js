const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./components/**/*.{vue,js}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}'],
  darkMode: false,
  theme: {
    extend: {
      width: {
        '1/10': '10%',
      },

      transitionDuration: {
        '2500': '2500ms',
        '4000': '4000ms',
      },

      spacing: {
        '0.75': '0.1875rem'
      },

      fontSize: {
        '4.5xl': '2.5rem',
        'tiny': '0.6rem',
        'teeny': '0.5rem',
        'atomic': '0.4rem'
      },

      colors: {
        'll-orange': '#ffa345'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
