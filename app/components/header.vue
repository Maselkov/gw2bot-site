<template>
  <div class="top-bar">
    <div class="top-bar__shadow">
      <div class="page-width page-padding">
        <NuxtLink class="top-bar__logo" to="/">
          <GW2BotLogo />

          <div class="top-bar__logo-wordmark">
            <span class="top-bar__logo-wordmark-stroke" aria-hidden="true">
              G<span class="two-kern">W</span>2Bot
            </span>
            <span class="top-bar__logo-wordmark-color">
              G<span class="two-kern">W</span>2Bot
            </span>
            <span class="sr-only"> - A Discord Bot for Guild Wars 2</span>
          </div>
        </NuxtLink>

        <div class="top-bar__toggles">
          <div class="top-bar__toggle">
            <button
              v-tooltip="{
                boundary: void 0,
                content: `Switch to ${darkMode ? 'light' : 'dark'} mode`,
                distance: 8,
                flip: false,
                placement: 'bottom',
                popperClass: 'v-popper--front',
                strategy: 'fixed',
              }"
              class="dark-mode-button"
              :class="darkMode ? 'active' : null"
              @click="switchColorMode"
            />
          </div>

          <div class="top-bar__toggle top-bar__toggle--navigation">
            <button
              class="main-nav-button"
              :class="{ active: navActive }"
              :title="`${navActive ? 'Hide' : 'Show'} navigation`"
              @click="navActive = !navActive"
            >
              <div />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mobile-navigation-cover"
      :class="{ active: navActive }"
      @click="navActive = false"
    />

    <div class="page-width">
      <div class="main-nav__container" :class="{ active: navActive }">
        <nav
          class="main-nav"
          aria-label="Navigation"
          itemscope
          itemtype="http://www.schema.org/SiteNavigationElement"
        >
          <NuxtLink
            to="/"
            class="main-nav__link"
            active-class="active"
            itemprop="url"
            exact
            @click="navActive = false"
          >
            <span class="main-nav__link-name">Home</span>
          </NuxtLink>
          <NuxtLink
            to="/commands"
            class="main-nav__link"
            active-class="active"
            itemprop="url"
            @click="navActive = false"
          >
            <span class="main-nav__link-name">Commands</span>
          </NuxtLink>
          <NuxtLink
            to="/faq"
            class="main-nav__link"
            active-class="active"
            itemprop="url"
            @click="navActive = false"
          >
            <span class="main-nav__link-name">
              F.A<span class="q-kern">.</span>Q
            </span>
          </NuxtLink>
          <a
            class="main-nav__link"
            :href="$supportServerLink"
            target="_blank"
            itemprop="url"
          >
            <span class="main-nav__link-name">Support</span>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import GW2BotLogo from '@/components/inline-svgs/gw2bot.vue'

export default {
  name: 'HeaderComponent',
  components: {
    GW2BotLogo
  },
  data () {
    return {
      mounted: false,
      navActive: false
    }
  },
  computed: {
    // The server can't know the color mode, and hydration keeps the server's
    // classes, so the toggle only reflects it once mounted
    darkMode () {
      return this.mounted && this.$colorMode.value === 'dark'
    }
  },
  mounted () {
    this.mounted = true
  },
  methods: {
    switchColorMode () {
      this.$colorMode.preference = this.darkMode ? 'light' : 'dark'
    }
  }
}
</script>
