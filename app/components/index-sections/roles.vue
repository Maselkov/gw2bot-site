<template>
  <section class="feature-section">
    <div class="page-width page-padding">
      <h2>Powerful Tools for Server&nbsp;Admins</h2>

      <picture>
        <source
          data-srcset="~/assets/img/space-quaggan.png?format=webp"
          type="image/webp"
        >
        <img
          alt=""
          class="lazyload"
          width="308"
          height="305"
          data-src="~/assets/img/space-quaggan.png"
        >
      </picture>

      <p class="h5">
        Automatic Discord&nbsp;roles for Guild&nbsp;Wars&nbsp;2&nbsp;communities
      </p>

      <p class="h6 gutter-top-margin">
        Add basic verification with <code>/server&nbsp;api_key_role</code>&nbsp;to distinguish GW2Bot&nbsp;users
      </p>

      <p class="h6">
        Synchronize <strong>up&nbsp;to 8&nbsp;guilds in a single Discord&nbsp;server</strong> by using the&nbsp;<code>/guildsync</code>&nbsp;command
      </p>

      <p class="h6">
        Organise WvW players with&nbsp;<code>/worldsync</code> to add team roles to your Discord&nbsp;server
      </p>

      <NuxtLink class="button button--large" to="/commands">See All GW2Bot Capabilities</NuxtLink>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RolesSection'
}
</script>

<style lang="scss" scoped>
.feature-section:after {
  background-image: conic-gradient(
    hsl(245deg, 100%, 74%) 2deg,
    hsl(240deg, 20%, 86%) 90deg,
    hsl(235deg, 100%, 76%) 178deg
  );
  .dark-mode & {
    background-image: conic-gradient(
      hsl(245deg, 22%, 49%) 2deg,
      hsl(240deg, 4%, 42%) 90deg,
      hsl(235deg, 12%, 44%) 178deg
    );
  }
}

img {
  width: 308px;
  height: 305px;
}
</style>
