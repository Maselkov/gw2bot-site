<template>
  <a :href="href" target="_blank"><slot /><ExternalInlineSVG /></a>
</template>

<script>
import ExternalInlineSVG from '@/components/inline-svgs/external.vue'

export default {
  name: 'ExternalLinkComponent',
  components: {
    ExternalInlineSVG
  },
  props: {
    href: {
      type: String,
      required: true
    }
  }
}
</script>
