<template>
  <button class="command__button">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'CommandButtonComponent'
}
</script>

<style lang="scss" scoped>
.command__button {
  display: inline-block;
  border: 1px solid $grey-1000;
  background: $white;
  box-shadow: $button-shadow;
  vertical-align: top;
  &:hover {
    background: $grey-1150;
  }
  &:active {
    background: $grey-1100;
  }
  &.active {
    color: $grey-1200;
    background: $grey-250;
    &:active {
      background: $grey-100;
    }
  }
  .dark-mode & {
    border-color: $grey-200;
    background: $grey-350;
    box-shadow: $button-shadow--dark;
    &:hover {
      background: $grey-300;
    }
    &:active {
      background: $grey-250;
    }
    &.active {
      color: $grey-200;
      background: $grey-1200;
      &:active {
        background: $grey-1100;
      }
    }
  }
}
</style>
