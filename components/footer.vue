<template>
  <footer>
    <div class="footer-width page-padding">
      <div class="flexbox">
        <div class="flexbox__item">
          <div class="flexbox">
            <a class="github-link" href="https://github.com/Maselkov/GW2Bot" target="_blank">
              <GitHubInlineSVG fit />
            </a>
            <small>
              GW2Bot created by<br><span class="bold-text">@maselkov</span>
            </small>
          </div>
        </div>

        <div class="flexbox__item">
          <div class="flexbox">
            <a class="github-link" href="https://github.com/brybrant/gw2bot-site" target="_blank">
              <GitHubInlineSVG fit />
            </a>
            <small>
              Website created by<br><span class="bold-text">@penemue.</span>&nbsp;and&nbsp;<span class="bold-text">@matt_bryant</span>
            </small>
          </div>
        </div>
      </div>

      <p class="small-text">
        <small>Thanks to all contributors<LoveheartInlineSVG /><br>Please read our <NuxtLink to="/terms-of-service">Terms&nbsp;of Service</NuxtLink> and our <NuxtLink to="/privacy-policy">Privacy&nbsp;Policy</NuxtLink> before using&nbsp;GW2Bot.<br>Join the <ExternalLink :href="$supportServerLink">GW2Bot Discord Server</ExternalLink> for further&nbsp;support.</small>
      </p>

      <p class="small-text">
        <small>NCSOFT, ArenaNet, Guild&nbsp;Wars, Guild&nbsp;Wars&nbsp;2, and all associated logos, designs, and composite marks are trademarks or registered trademarks of NCSOFT&nbsp;Corporation.</small>
      </p>
    </div>
  </footer>
</template>

<script>
import GitHubInlineSVG from '@/components/inline-svgs/github'
import LoveheartInlineSVG from '@/components/inline-svgs/loveheart'

export default {
  name: 'FooterComponent',
  components: {
    GitHubInlineSVG,
    LoveheartInlineSVG
  }
}
</script>

<style lang="scss" scoped>
footer {
  position: relative;
  margin: ($baseline-rem * 2) 0 0;
  padding: 0 0 ($baseline-rem * 2);
  text-align: center;
  width: 100%;
  background: $grey-1100;
  color: $grey-350;
  .dark-mode & {
    background: $grey-250;
    color: $grey-1000;
  }
}

.flexbox {
  display: inline-flex;
  margin-left: 0;
  small {
    display: block;
    width: 200px;
    line-height: 1.25rem;
    text-align: left;
    @include media-query('gt-480') {
      text-align: center;
    }
  }
}

.flexbox__item {
  margin-top: $baseline-rem;
  padding-left: 0;
  width: 100%;
  @include media-query('gt-480') {
    width: 50%;
  }
  .flexbox {
    @include media-query('gt-480') {
      flex-flow: column nowrap;
    }
  }
}

.github-link {
  display: block;
  margin: auto ($baseline-px * 0.5) auto 0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: $grey-300;
  &:hover {
    color: $grey-500;
  }
  &:active {
    color: $grey-200;
  }
  .dark-mode & {
    color: $grey-1000;
    &:hover {
      color: $grey-1200;
    }
    &:active {
      color: $grey-900;
    }
  }
  @include media-query('gt-480') {
    margin: auto;
  }
}
</style>
