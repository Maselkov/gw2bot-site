<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 967">
    <defs>
      <linearGradient id="gradient--light" x2="0" y2="1">
        <stop offset="0" stop-color="#E31D06" />
        <stop offset="1" stop-color="#AF1600" />
      </linearGradient>
      <linearGradient id="gradient--dark" x2="0" y2="1">
        <stop offset="0" stop-color="#D21A03" />
        <stop offset="1" stop-color="#A31400" />
      </linearGradient>
    </defs>
    <path class="head" d="M869.82,263.89c-125.07-26.42-244.77,55.82-267.88,178.07,97.61-55.17,208.19-69.48,309.59-49.25-8.99-44.99-23.11-88.15-41.71-128.82Zm16.14,221.3c-11.58,31.04-25.7,60.84-42.1,89.15-52.87-43.73-112.28-79.83-176.53-106.64,71.7-15.7,148.32-10.34,218.63,17.49ZM713.52,124.45c-137.52-32.79-264.59,83.5-244.46,223.23,51.13,192.13,57.49,393.39,19.91,586.31-156,48.33-333.73,27.79-479.61-70.99,156.24-118.25,223.26-318.42,171.51-505.85-19.75-122.4,36.96-240.4,138.14-303.2-10.38,25.34-5.26,54.72,14.37,75.17C361.02,48.35,443.91-1.62,529.62,13.65c.03,.01,.05,.01,.08,.02-25.12,12.18-40.49,37.85-39.47,65.61,74.2-41.54,169.5-23.77,223.28,45.16h.01Z" />
    <circle
      cx="140"
      cy="386"
      r="128"
      class="eye"
    />
    <circle cx="108" cy="418" r="64" />
    <circle
      cx="396"
      cy="386"
      r="128"
      class="eye"
    />
    <circle cx="428" cy="354" r="64" />
  </svg>
</template>

<script>
export default {
  name: 'GW2BotLogo'
}
</script>

<style lang="scss" scoped>
.head {
  fill: url('#gradient--light');
  stroke: #000;
  stroke-linejoin: round;
  stroke-width: 16;
  .dark-mode & {
    fill: url('#gradient--dark');
  }
}

.eye {
  fill: #fff;
  stroke: #000;
  stroke-linejoin: round;
  stroke-width: 12;
}
</style>
