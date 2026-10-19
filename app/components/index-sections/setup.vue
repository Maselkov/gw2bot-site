<template>
  <section class="feature-section">
    <div class="page-width page-padding">
      <h2>Quick and Easy Setup</h2>

      <picture>
        <source
          data-srcset="~/assets/img/lost-quaggan.png?format=webp"
          type="image/webp"
        >
        <img
          alt=""
          class="lazyload"
          width="308"
          height="289"
          data-src="~/assets/img/lost-quaggan.png"
        >
      </picture>

      <p class="h5">
        Get started with GW2Bot in no time
      </p>

      <p class="h6 gutter-top-margin">
        GW2Bot has user-friendly <em>slash&nbsp;commands</em> which provide helpful instructions and autocompletion while you&nbsp;type
      </p>

      <p class="h6">
        Use the <code>/key&nbsp;add</code>&nbsp;command to <strong>store up&nbsp;to 15 of your API&nbsp;keys</strong> with&nbsp;GW2Bot
      </p>

      <p class="h6">
        Switch between your API&nbsp;keys by typing&nbsp;<code>/key&nbsp;switch</code> and GW2Bot&nbsp;will provide an interactive list for you to choose&nbsp;from
      </p>

      <a
        class="button button--large"
        :href="$inviteLink"
        target="_blank"
      >Start Using GW2Bot</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SetupSection'
}
</script>

<style lang="scss" scoped>
.feature-section:after {
  background-image: conic-gradient(
    hsl(220deg, 100%, 66%) 182deg,
    hsl(200deg, 100%, 90%) 270deg,
    hsl(190deg, 100%, 56%) 358deg
  );
  .dark-mode & {
    background-image: conic-gradient(
      hsl(220deg, 38%, 52%) 182deg,
      hsl(200deg, 44%, 42%) 270deg,
      hsl(190deg, 100%, 29%) 358deg
    );
  }
}

img {
  width: 308px;
  height: 289px;
}
</style>
