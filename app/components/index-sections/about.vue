<template>
  <section>
    <div class="page-width page-padding">
      <picture>
        <source
          data-srcset="~/assets/img/logo.png?format=webp"
          type="image/webp"
        >
        <img
          alt="GW2Bot Logo"
          class="lazyload"
          width="180"
          height="260"
          src="~/assets/img/logo.png?w=36"
          data-src="~/assets/img/logo.png"
        >
      </picture>

      <h2 class="h3">
        About GW2Bot
      </h2>

      <p class="h5">
        GW2Bot is an open source Discord&nbsp;bot for Guild&nbsp;Wars&nbsp;2&nbsp;players,<br>
        offering robust features for both individuals and large&nbsp;communities
      </p>

      <div class="flexbox">
        <div class="flexbox__item">
          <NuxtLink class="button button--large" to="/commands"><CommandInlineSVG />Commands</NuxtLink>
        </div>

        <div class="flexbox__item">
          <a
            class="button button--large button--discord"
            :href="$supportServerLink"
            target="_blank"
          ><DiscordInlineSVG />Discord</a>
        </div>

        <div class="flexbox__item">
          <a
            class="button button--large button--github"
            href="https://github.com/Maselkov/GW2Bot"
            target="_blank"
          ><GitHubInlineSVG />GitHub</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CommandInlineSVG from '@/components/inline-svgs/command.vue'
import DiscordInlineSVG from '@/components/inline-svgs/discord.vue'
import GitHubInlineSVG from '@/components/inline-svgs/github.vue'

export default {
  name: 'AboutSection',
  components: {
    CommandInlineSVG,
    DiscordInlineSVG,
    GitHubInlineSVG
  }
}
</script>

<style lang="scss" scoped>
section {
  padding: ($baseline-rem * 1.5) 0 ($baseline-rem * 2);
}

.flexbox {
  @include media-query('lt-600') {
    flex-flow: column nowrap;
  }
}

.flexbox__item {
  margin-top: $baseline-rem;
  & ~ .flexbox__item {
    @include media-query('lt-600') {
      margin-top: $baseline-rem * 0.5;
    }
  }
}

img {
  margin: 0 auto;
  padding: 0 0 0 10px;
  width: 100px;
  height: 130px;
}

h2 {
  margin-top: $baseline-rem;
}

br {
  display: none;
  @include media-query('gt-800') {
    display: inline;
  }
}

.button--github {
  background: $github-grey;
  &:hover {
    background: color.scale($github-grey, $lightness: 5%);
  }
  &:active {
    background: color.scale($github-grey, $lightness: (-9%));
  }
  svg {
    margin: 0 6px 0 (-10px);
  }
}

.button--discord {
  background: color.scale($discord-blurple, $lightness: (-8%));
  &:hover {
    background: color.scale($discord-blurple, $lightness: (-3%));
  }
  &:active {
    background: color.scale($discord-blurple, $saturation: (-12%), $lightness: (-15%));
  }
  svg {
    margin: 0 7px 0 (-9px);
  }
}
</style>
