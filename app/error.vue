<template>
  <NuxtLayout>
    <main>
      <div class="page-width page-padding">
        <header>
          <h1>Error {{ statusCode }}</h1>

          <p>{{ message }}.</p>
        </header>

        <picture>
          <source
            :data-srcset="notFound ? notFoundWebp : errorWebp"
            type="image/webp"
          >
          <img
            alt=""
            :class="`${notFound ? 'notfound' : 'error'}-quaggan lazyload`"
            :width="notFound ? '356' : '308'"
            :height="notFound ? '370' : '313'"
            :data-src="notFound ? notFoundImage : errorImage"
          >
        </picture>

        <p v-if="!notFound">
          If this problem persists, please <ExternalLink href="https://github.com/brybrant/gw2bot-site/issues">submit an issue on GitHub</ExternalLink> or report it in the <ExternalLink :href="$supportServerLink">GW2Bot Discord&nbsp;Server</ExternalLink>.
        </p>

        <br>

        <NuxtLink class="button button--large" to="/">
          Back to Home Page
        </NuxtLink>
      </div>
    </main>
  </NuxtLayout>
</template>

<script>
import notFoundImage from '@/assets/img/404-quaggan.png'
import notFoundWebp from '@/assets/img/404-quaggan.png?format=webp'
import errorImage from '@/assets/img/error-quaggan.png'
import errorWebp from '@/assets/img/error-quaggan.png?format=webp'
import metadata from '@/assets/js/metadata'

export default {
  name: 'ErrorPage',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  setup (props) {
    const statusCode = computed(() => Number(props.error?.statusCode || props.error?.status || 500))
    const notFound = computed(() => statusCode.value === 404)

    useHead(() => metadata({
      title: `${statusCode.value} | GW2Bot`,
      description: 'Error',
      robots: notFound.value ? 'noindex, noarchive' : 'all'
    }))

    return {
      statusCode,
      notFound,
      notFoundImage,
      notFoundWebp,
      errorImage,
      errorWebp
    }
  },
  computed: {
    message () {
      return this.notFound
        ? 'This page could not be found'
        : this.error?.message || 'An error occurred'
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  display: inline-block;
  width: 100%;
  vertical-align: top;
}

.notfound-quaggan {
  margin: 0 0 $baseline-rem 48px;
  width: 356px;
  height: 370px;
}

.error-quaggan {
  width: 308px;
  height: 313px;
}
</style>
