<template>
  <main>
    <div class="page-width page-padding">
      <header>
        <h1>GW2Bot Commands</h1>
        <p><strong>Type <code>/</code> to see a full list of commands</strong></p>
      </header>

      <div class="flexbox">
        <div class="flexbox__item commands-column">
          <ul class="commands-list">
            <CommandComponent
              v-for="command in main1"
              :key="command.name"
              :command="command"
            />
          </ul>
        </div>
        <div class="flexbox__item commands-column">
          <ul class="commands-list">
            <CommandComponent
              v-for="command in main2"
              :key="command.name"
              :command="command"
            />
          </ul>
        </div>
      </div>

      <hr>

      <h2 class="h3">
        Notifiers
      </h2>

      <div class="flexbox">
        <div class="flexbox__item commands-column">
          <ul class="commands-list">
            <CommandComponent
              v-for="command in notifiers1"
              :key="command.name"
              :command="command"
            />
          </ul>
        </div>
        <div class="flexbox__item commands-column">
          <ul class="commands-list">
            <CommandComponent
              v-for="command in notifiers2"
              :key="command.name"
              :command="command"
            />
          </ul>
        </div>
      </div>

      <hr>

      <h2 class="h3">
        Meta &amp; Stats
      </h2>

      <div class="flexbox">
        <div class="flexbox__item commands-column">
          <ul class="commands-list">
            <CommandComponent
              v-for="command in meta1"
              :key="command.name"
              :command="command"
            />
          </ul>
        </div>
        <div class="flexbox__item commands-column">
          <ul class="commands-list">
            <CommandComponent
              v-for="command in meta2"
              :key="command.name"
              :command="command"
            />
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<script scoped>
import CommandComponent from '@/components/command/command.vue'
import commands from '@/assets/js/commandsData'
import metadata from '@/assets/js/metadata'

export default defineNuxtComponent({
  name: 'CommandsPage',
  components: {
    CommandComponent
  },
  data () {
    return {
      main1: commands.main.slice(0, commands.main.length * 0.5),
      main2: commands.main.slice(commands.main.length * 0.5),
      notifiers1: commands.notifiers.slice(0, commands.notifiers.length * 0.5),
      notifiers2: commands.notifiers.slice(commands.notifiers.length * 0.5),
      meta1: commands.meta.slice(0, commands.meta.length * 0.5),
      meta2: commands.meta.slice(commands.meta.length * 0.5)
    }
  },
  head () {
    return metadata({
      title: 'Commands | GW2Bot',
      description: 'GW2Bot commands'
    })
  }
})
</script>

<style lang="scss" scoped>
.commands-column {
  width: 100%;
  @include media-query('gt-800') {
    width: 50%;
  }
}

.commands-list {
  padding: 0;
  list-style: none;
  text-align: center;
}
</style>
