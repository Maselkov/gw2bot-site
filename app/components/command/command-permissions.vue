<template>
  <KeyInlineSVG
    v-tooltip="{
      content: `Requires API key permission${permissions.length > 1 ? 's' : ''}:<br>${open + permissions.join(`${close} ${open}`) + close}`,
      html: true,
    }"
    class="permissions-icon"
  />
</template>

<script>
import KeyInlineSVG from '@/components/inline-svgs/key.vue'

export default {
  name: 'CommandPermissionsComponent',
  components: {
    KeyInlineSVG
  },
  props: {
    permissions: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      open: '<code class="smaller">',
      close: '</code>'
    }
  }
}
</script>

<style lang="scss" scoped>
.permissions-icon {
  display: inline-block;
  color: $grey-400;
  vertical-align: top;
  &:hover {
    color: $grey-250;
  }
  .command & {
    position: absolute;
    top: $baseline-px * .5;
    right: 0;
    width: $baseline-px;
    height: $baseline-px;
  }
  .subcommand & {
    position: initial;
    margin: ($baseline-px * .125) 0;
    width: $baseline-px * .75;
    height: $baseline-px * .75;
  }
  .dark-mode & {
    color: $grey-1100;
    &:hover {
      color: $white;
    }
  }
}
</style>
