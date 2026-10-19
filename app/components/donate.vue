<template>
  <div class="patreon">
    <div class="page-width page-padding">
      <hr>

      <span class="h2">Contribute to GW2Bot</span>

      <p class="h6">
        GW2Bot will remain free to use and continues to run with kind donations and volunteer&nbsp;contributions.<br>If you enjoy using GW2Bot, please consider donating to help further&nbsp;development!
      </p>

      <div class="flexbox">
        <div class="flexbox__item">
          <a
            class="button button--large button--patreon"
            href="https://www.patreon.com/bePatron?u=9811418"
            target="_blank"
          ><PatreonInlineSVG />Become a Patron</a>
        </div>

        <div class="flexbox__item">
          <a
            class="button button--large button--paypal"
            href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=96N5SP5FYTTGJ"
            target="_blank"
          ><PayPalInlineSVG />Donate with PayPal</a>
        </div>

        <div class="flexbox__item">
          <a
            class="button button--large button--kofi"
            href="https://ko-fi.com/maselkov"
            target="_blank"
          ><KofiInlineSVG />Buy me a coffee</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KofiInlineSVG from '@/components/inline-svgs/kofi.vue'
import PatreonInlineSVG from '@/components/inline-svgs/patreon.vue'
import PayPalInlineSVG from '@/components/inline-svgs/paypal.vue'

export default {
  name: 'DonateComponent',
  components: {
    KofiInlineSVG,
    PatreonInlineSVG,
    PayPalInlineSVG
  }
}
</script>

<style lang="scss" scoped>
.patreon {
  padding-top: $baseline-rem;
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

.button--patreon {
  background: color.scale($patreon-fiery-coral, $saturation: (-4%), $lightness: (-9%));
  &:hover {
    background: $patreon-fiery-coral;
  }
  &:active {
    background: color.scale($patreon-fiery-coral, $saturation: (-25%), $lightness: (-20%));
  }
  svg {
    margin-left: -11px;
  }
}

.button--paypal {
  background: $paypal-pal-blue;
  &:hover {
    background: color.scale($paypal-pal-blue, $lightness: 12%);
  }
  &:active {
    background: color.scale($paypal-pal-blue, $lightness: (-20%));
  }
  svg {
    margin-left: -11px;
  }
}

.button--kofi {
  background: $kofi-grey;
  &:hover {
    background: color.scale($kofi-grey, $lightness: 10%);
  }
  &:active {
    background: color.scale($kofi-grey, $lightness: (-5%));
  }
  svg {
    margin: 0 8px 0 (-9px);
  }
}
</style>
