<template>
  <li class="subcommand">
    <div
      v-if="subcommand.args"
      :id="`${command.name}-${subcommand.name}-tooltip`"
      class="tooltip"
      :class="{ active: subcommandActive }"
    >
      <button
        class="tooltip__close"
        :aria-controls="`${command.name}-${subcommand.name}-tooltip`"
        title="Close"
        @click="subcommandActive = false"
      />
      <CommandArgumentsComponent :command="subcommand" />
    </div>

    <p class="subcommand__name">
      <span>{{ command.name }}</span> {{ subcommand.name }}
      <CommandButton
        v-if="subcommand.args"
        class="command__button--args"
        :class="{ active: subcommandActive }"
        :aria-controls="`${command.name}-${subcommand.name}-tooltip`"
        :aria-expanded="subcommandActive ? 'true' : 'false'"
        :title='`${subcommandActive ? "Hide" : "Show"} "${command.name} ${subcommand.name}" arguments`'
        @click.native="subcommandActive = !subcommandActive"
      >
        {{ `+${subcommand.args.length}` }}
      </CommandButton>
      <CommandPermissions
        v-if="subcommand.permissions"
        :permissions="subcommand.permissions"
      />
    </p>
    <p class="subcommand__desc small-text">
      {{ subcommand.desc | twoOrphans }}
    </p>
  </li>
</template>

<script>
import CommandArgumentsComponent from '@/components/command/command-arguments'
import CommandButton from '@/components/command/command-button'
import CommandPermissions from '@/components/command/command-permissions'

export default {
  name: 'SubcommandComponent',
  components: {
    CommandArgumentsComponent,
    CommandButton,
    CommandPermissions
  },
  props: {
    command: {
      type: Object,
      required: true
    },
    subcommand: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      subcommandActive: false
    }
  }
}
</script>

<style lang="scss" scoped>
.subcommand {
  position: relative;
  margin: ($baseline-px * .5) 0 0;
  padding: ($baseline-px * .5) 0;
  border-top: 1px solid $grey-1000;
  & ~ .subcommand {
    margin: 0;
  }
  .tooltip {
    right: (-16px);
    left: (-16px);
  }
  .dark-mode & {
    border-top-color: $grey-200;
  }
}

.subcommand__name {
  @extend %Code-font-family;
  line-height: $baseline-px;
  font-weight: 600;
  button {
    line-height: $baseline-px - 4px;
  }
  span {
    color: $grey-800;
    &:before {
      content: '\002F';// Forward slash
    }
  }
}

.subcommand__desc {
  padding: 0 4px;
}
</style>
