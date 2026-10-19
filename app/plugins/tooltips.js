import FloatingVue, { options } from 'floating-vue'

// https://floating-vue.starpad.dev/api/

options.arrowPadding = 12
options.distance = 0
options.popperTriggers = ['hover']
options.themes.tooltip.triggers = ['hover', 'touch']
options.themes.tooltip.hideTriggers = ['hover', 'touch']
options.themes.tooltip.delay.show = 100

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue)
})
