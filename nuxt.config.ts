import { imagetools } from 'vite-imagetools'

const meta = {
  title: 'GW2Bot - A Discord Bot for Guild Wars 2',
  description: 'GW2Bot is a powerful Guild Wars 2 bot for Discord!'
}

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/eslint'
  ],

  /*
  ** Global <head> elements
  */
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        xmlns: 'http://www.w3.org/1999/xhtml'
      },
      title: meta.title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { name: 'theme-color', content: '#C12D2B' },
        { name: 'msapplication-TileColor', content: '#fff' },
        { name: 'application-name', content: 'GW2Bot' },
        { key: 'robots', name: 'robots', content: 'all' },
        { key: 'title', property: 'og:title', content: meta.title },
        { key: 'description', name: 'description', property: 'og:description', content: meta.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://gw2bot.info' },
        { property: 'og:image', content: 'https://gw2bot.info/og-image.png' }
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', sizes: '32x32', type: 'image/png', href: '/favicon-32x32.png' },
        { rel: 'icon', sizes: '16x16', type: 'image/png', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#b40000' }
      ]
    }
  },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/scss/main.scss'
  ],

  vue: {
    compilerOptions: {
      // Keep whitespace between elements, as Vue 2 did; the templates rely on it
      whitespace: 'preserve',
      // Lets v-tooltip render on the server; floating-vue attaches it on the client
      directiveTransforms: {
        tooltip: () => ({ props: [], needRuntime: true })
      }
    }
  },

  // Matches the Nuxt 2 setup, where the SCSS styles key off .dark-mode / .light-mode
  colorMode: {
    classSuffix: '-mode'
  },

  compatibilityDate: '2026-10-01',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Sass modules, variables, mixins and placeholders available in
          // every stylesheet, as @nuxtjs/style-resources provided them
          additionalData: [
            ...['color', 'list', 'math', 'string'].map(module => `@use "sass:${module}";`),
            ...['_functions', '_silent-classes', '_colors', '_settings']
              .map(file => `@import "~/assets/scss/${file}.scss";`)
          ].join('\n') + '\n',
          // The stylesheets still share globals through @import
          silenceDeprecations: ['import']
        }
      }
    },
    vue: {
      template: {
        // Lazysizes reads data-src / data-srcset, so resolve assets there too
        transformAssetUrls: {
          video: ['src', 'poster'],
          source: ['src', 'data-srcset'],
          img: ['src', 'data-src', 'data-srcset'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href']
        }
      }
    },
    plugins: [
      // Responsive images from query strings, e.g. image.png?w=640&format=webp
      imagetools({
        defaultDirectives: new URLSearchParams({ quality: '50' })
      })
    ]
  },

  eslint: {
    config: {
      stylistic: true
    }
  }
})
