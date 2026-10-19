<template>
  <li class="command">
    <div
      v-if="command.args"
      :id="`${command.name}-tooltip`"
      class="tooltip"
      :class="{ active: commandActive }"
    >
      <button
        class="tooltip__close"
        :aria-controls="`${command.name}-tooltip`"
        title="Close"
        @click="commandActive = false"
      />
      <CommandArgumentsComponent :command="command" />
    </div>

    <h3 class="command__name">
      <CommandButton
        v-if="command.subcommands"
        class="command__button--subcommands"
        :class="{ active: commandActive }"
        :aria-controls="`${command.name}-subcommands`"
        :aria-expanded="commandActive ? 'true' : 'false'"
        :title="`${commandActive ? 'Hide' : 'Show'} ${command.name} subcommand${command.subcommands.length > 1 ? 's' : ''} (${command.subcommands.length})`"
        @click.native="commandActive = !commandActive"
      >
        <span>{{ command.name }}</span>
      </CommandButton>
      <template v-else>
        <span>{{ command.name }}</span>
        <CommandButton
          v-if="command.args"
          class="command__button--args"
          :class="{ active: commandActive }"
          :aria-controls="`${command.name}-tooltip`"
          :aria-expanded="commandActive ? 'true' : 'false'"
          :title="`${commandActive ? 'Hide' : 'Show'} ${command.name} arguments`"
          @click.native="commandActive = !commandActive"
        >
          {{ `+${command.args.length}` }}
        </CommandButton>
      </template>
      <CommandPermissions
        v-if="command.permissions"
        :permissions="command.permissions"
      />
    </h3>
    <p class="command__desc">
      {{ command.desc | twoOrphans }}
    </p>

    <ul
      v-if="command.subcommands"
      v-show="commandActive"
      :id="`${command.name}-subcommands`"
      class="subcommand-list"
    >
      <SubcommandComponent
        v-for="(subcommand, index) in command.subcommands"
        :key="`subcommand-${index}`"
        :command="command"
        :subcommand="subcommand"
      />
    </ul>
  </li>
</template>

<script>
import CommandArgumentsComponent from '@/components/command/command-arguments'
import CommandButton from '@/components/command/command-button'
import CommandPermissions from '@/components/command/command-permissions'
import SubcommandComponent from '@/components/command/subcommand'

export default {
  name: 'CommandComponent',
  components: {
    CommandArgumentsComponent,
    CommandButton,
    CommandPermissions,
    SubcommandComponent
  },
  props: {
    command: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      commandActive: false
    }
  }
}
</script>

<style lang="scss" scoped>
.command {
  position: relative;
  padding: ($baseline-px * .25) 8px ($baseline-px * .5);
  border-radius: 6px;
  background: $white;
  box-shadow: $card-shadow;
  &:deep(p) {
    margin: 0;
  }
  & ~ .command {
    margin-top: $baseline-rem;
  }
  .tooltip {
    right: -8px;
    left: -8px;
  }
  .dark-mode & {
    background: $grey-350;
    box-shadow: $card-shadow--dark;
  }
}

.command__name {
  @extend %Code-font-family;
  position: relative;
  margin: 0;
  color: $grey-200;
  font-size: $h4-font-rem;
  line-height: $baseline-px * 2;
  font-weight: 400;
  white-space: nowrap;
  .command__button {
    margin: 4px 0;
    line-height: ($baseline-px * 2) - 12px;
  }
  span:before {
    content: '\002F';// Forward slash
    color: $grey-800;
  }
  .dark-mode & {
    color: $white;
  }
}

.command__desc {
  margin: 2px 0 10px;
  padding: 0 4px;
  line-height: $baseline-px;
  color: $grey-250;
  .dark-mode & {
    color: $grey-1200;
  }
}

.command__button--subcommands {
  border-radius: 20px;
  padding: 1px 14px;
  &:active {
    padding: 2px 14px 0;
  }
  &:after {
    content: '';
    display: inline-block;
    width: ($baseline-px * 2) - 12px;
    height: ($baseline-px * 2) - 12px;
    background: url-encode("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' fill='#{$grey-800}'><circle cx='200' cy='300' r='30'/><circle cx='325' cy='300' r='30'/><circle cx='450' cy='300' r='30'/></svg>") 50% 50% / 100% 100%;
    vertical-align: top;
  }
}

:deep(.command__button--args) {
  border-radius: 8px;
  padding: 1px 6px;
  &:active {
    padding: 2px 6px 0;
  }
}

.subcommand-list {
  margin: 12px 0 (-12px);
  padding: 0;
  list-style: none;
  text-align: center;
}
</style>
