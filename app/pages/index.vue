<template>
  <main>
    <div class="feature-media">
      <picture class="feature-media__media">
        <source
          :data-srcset="featureMedia.webpSrcset"
          type="image/webp"
        >
        <img
          alt=""
          class="lazyload"
          data-sizes="auto"
          width="1920"
          height="1080"
          :src="featureMedia.placeholder"
          :data-src="featureMedia.src"
          :data-srcset="featureMedia.srcset"
        >
      </picture>
      <!-- <video class="feature-media__media" autoplay loop muted playsinline>
        <source src="@/assets/img/feature-images/Sea_Dragon.mp4" type="video/mp4">
      </video> -->
      <div class="feature-media__content page-width page-padding">
        <picture v-if="anniversary">
          <source
            data-srcset="~/assets/img/cake-quaggan.png?format=webp"
            type="image/webp"
          >
          <img
            alt=""
            class="birthday-quaggan lazyload"
            width="308"
            height="338"
            data-src="~/assets/img/cake-quaggan.png"
          >
        </picture>
        <h1 class="feature-title">
          {{ anniversary ? `Celebrate ${botAge} Years of&nbsp;GW2Bot!` : 'Bring The World&nbsp;of Tyria Into&nbsp;Discord' }}
        </h1>
        <a
          class="feature-button button button--giant"
          :href="$inviteLink"
          target="_blank"
        >Add To Your Server!</a>
      </div>
    </div>

    <AboutSection />

    <SetupSection />

    <FeaturesSection />

    <AlertsSection />

    <RolesSection />

    <AutomationSection />
  </main>
</template>

<script>
import Rellax from 'rellax'

import featureImages from '@/assets/js/featureImages'

import AboutSection from '@/components/index-sections/about.vue'
import SetupSection from '@/components/index-sections/setup.vue'
import FeaturesSection from '@/components/index-sections/features.vue'
import AlertsSection from '@/components/index-sections/alerts.vue'
import RolesSection from '@/components/index-sections/roles.vue'
import AutomationSection from '@/components/index-sections/automation.vue'

// Every feature image in the sizes the page uses, keyed by file path.
// Vite needs literal globs and queries, so the widths are repeated.
const imageSets = {
  placeholder: import.meta.glob('~/assets/img/feature-images/*.jpg', {
    query: '?w=384&quality=10', import: 'default', eager: true
  }),
  src: import.meta.glob('~/assets/img/feature-images/*.jpg', {
    query: '?w=640', import: 'default', eager: true
  }),
  srcset: import.meta.glob('~/assets/img/feature-images/*.jpg', {
    query: '?w=640;960;1280;1920&as=srcset', import: 'default', eager: true
  }),
  webpSrcset: import.meta.glob('~/assets/img/feature-images/*.jpg', {
    query: '?w=640;960;1280;1920&format=webp&as=srcset', import: 'default', eager: true
  })
}

function featureImage (name) {
  const suffix = `/feature-images/${name}.jpg`
  return Object.fromEntries(
    Object.entries(imageSets).map(([key, images]) => [
      key,
      Object.entries(images).find(([path]) => path.endsWith(suffix))[1]
    ])
  )
}

const botBirthday = new Date('September 9, 2017 18:18:00 GMT+00:00')

export default {
  name: 'IndexPage',
  components: {
    AboutSection,
    SetupSection,
    FeaturesSection,
    AlertsSection,
    RolesSection,
    AutomationSection
  },
  data () {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() // 0-11
    const currentDay = now.getDate() // 1-31

    const yearStart = new Date(currentYear, 0, 1) // 24 * 60 * 60 * 1000 = 864e5
    const daysSinceYearStart = Math.floor((now - yearStart) / 864e5) + 1
    const currentWeek = Math.ceil(daysSinceYearStart / 7) - 1

    return {
      anniversary: currentMonth === 8 && currentDay > 8 && currentDay < 24,
      botAge: currentYear - botBirthday.getFullYear(),
      featureMedia: featureImage(featureImages[currentWeek])
    }
  },
  mounted () {
    if (this.rellax === undefined) {
      this.rellax = new Rellax('.feature-media__media', { speed: -4 })
    }

    window.removeEventListener('resize', this.resizeRellax)
    window.addEventListener('resize', this.resizeRellax)

    this.responsiveRellax()
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.resizeRellax)
  },
  methods: {
    resizeRellax () {
      clearTimeout(this.rellaxResizeTimer)
      // Debounce the resize event for performance
      this.rellaxResizeTimer = setTimeout(this.responsiveRellax, 250)
    },
    responsiveRellax () {
      if (window.innerWidth < 801) {
        this.rellax.destroy()
      } else {
        this.rellax.refresh()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.feature-media {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: calc(100vh - $nav-height);
  min-height: 630px;
  overflow: hidden;
}

.feature-media__media {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  filter: brightness(0.666) contrast(0.9);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.feature-media__content {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  width: 100%;
  &:before {
    @extend %Psuedo-element;
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 100%;
    height: 100%;
    min-height: 480px;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(3px) brightness(0.85) saturate(0.6);
    mask: radial-gradient($black, rgba($black, 0.8) 36%, rgba($black, 0) 70.71%) 0 0 / 100% 100%;
  }
}

.feature-title {
  margin: 0;
  color: $white;
  text-shadow: 0 4px  16px $black,
               0 8px  32px rgba($black, .5),
               0 16px 64px rgba($black, .25),
               0 32px 128px rgba($black, .125);
  @include media-query('gt-600') {
    font-size: $xl-font-rem;
    line-height: $xl-line-rem;
  }
}

.feature-button {
  margin-top: $baseline-rem * 2;
  box-shadow: 0 4px  16px $black,
              0 8px  32px rgba($black, .5),
              0 16px 64px rgba($black, .25),
              0 32px 128px rgba($black, .125);
}

.birthday-quaggan {
  position: relative;
  margin: auto;
  width: 100%;
  max-width: 308px;
  max-height: 338px;
}

.feature-section {
  position: relative;
  padding: ($baseline-rem * 1.5) 0 ($baseline-rem * 2);
  background: $grey-1200;
  .dark-mode & {
    background: $grey-300;
  }
  &:before, &:after {
    @extend %Psuedo-element;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: none;
    @supports (mix-blend-mode: overlay) {
      display: block;
    }
  }
  &:before {
    background: url-encode("<svg viewBox='0 0 1 1' xmlns='http://www.w3.org/2000/svg'><filter id='f'><feFlood flood-color='#808080' result='a'/><feTurbulence type='fractalNoise' baseFrequency='100' numOctaves='3' stitchTiles='stitch' result='b'/><feComposite in='a' in2='b' operator='in'/></filter><rect width='1' height='1' filter='url(#f)'/></svg>") 50% 50% / 200px 200px;
    opacity: 0.5;
    .dark-mode & {
      opacity: 0.25;
    }
  }
  &:after {
    background-position: 100% 50%;
    background-size: calc(200% + 200px) 200%;
    background-repeat: no-repeat;
    mix-blend-mode: overlay;
  }
  &:nth-child(odd) {
    background: $white;
    .dark-mode & {
      background: $grey-350;
    }
    &:after {
      background-position: 0% 50%;
    }
  }
}

:deep(.feature-section) {
  & > div {
    position: relative;
    z-index: 1;
  }
  h2 {
    margin: 0;
  }
  img {
    display: none;
    margin: $baseline-rem $baseline-rem 0 0;
    float: left;
    @include media-query('gt-800') {
      display: block;
    }
  }
  .button {
    margin: $baseline-rem 0 (-$gutter-rem * 0.25) 0;
  }
  @include media-query('gt-800') {
    text-align: right;
    &:nth-child(odd) {
      text-align: left;
    }
  }
  &:nth-child(odd) {
    img {
      margin: $baseline-rem 0 0 $baseline-rem;
      float: right;
    }
  }
}
</style>
