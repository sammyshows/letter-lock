// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss', '@pinia/nuxt'
  ],

  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'viewport-fit=cover, width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no' }
      ]
    }
  },

  css: [
    "@/assets/css/main.css",
  ]
});
