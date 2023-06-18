const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./components/**/*.{vue,js}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}'],
  darkMode: false,
  theme: {
    extend: {
      width: {
        '1/10': '10%',
      },

      margin: {
        '1/10': '10%'
      },

      borderRadius: {
        '5xl': '2rem',
        '12pc': '12%',
        '16pc': '16%',
      },

      animation: {
        'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-rotated': 'pulseRotated 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.9 },
          '50%': { transform: 'scale(1.25)', opacity: 1 },
        },

        pulseRotated: {
          '0%, 100%': { transform: 'scale(1) rotate(90deg)', opacity: 0.9 },
          '50%': { transform: 'scale(1.25) rotate(90deg)', opacity: 1 },
        },
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
        '7.5xl': '5.5rem',
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
    animation: ['responsive'],
  },
  plugins: [],
}
