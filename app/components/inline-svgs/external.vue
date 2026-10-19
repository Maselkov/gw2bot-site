<template>
  <svg class="inline-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 600">
    <path d="M230,415H30V215H125l-30-30H30c-16.57,0-30,13.43-30,30v200c0,16.57,13.43,30,30,30H230c16.57,0,30-13.43,30-30v-65l-30-30v95Z" />
    <polygon points="145 150 180 185 235 185 85 335 110 360 260 210 260 270 290 300 290 150 145 150" />
  </svg>
</template>

<script>
export default {
  name: 'ExternalInlineSVG'
}
</script>

<style lang="scss" scoped>
svg {
  fill: currentColor;
}

.inline-svg {
  margin-left: 2px;
  width: $p-line-rem * 0.5;
}

small, .small-text {
  .inline-svg {
    width: $small-line-rem * 0.5;
  }
}
</style>
