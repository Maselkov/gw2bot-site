<template>
  <div class="page-width page-padding">
    <p class="small-text">
      Page {{ currentPage }} of {{ totalPages }}
    </p>

    <nav
      role="navigation"
      aria-label="Pagination navigation"
      class="pagination-buttons"
    >
      <button
        class="button button--prev"
        :disabled="currentPage === 1"
        title="Previous page"
        @click="paginate(currentPage - 1)"
      >
        <span class="sr-only">Previous page</span>
      </button>

      <PaginationButtonComponent
        :current-page="currentPage"
        :page="1"
        @clicked="paginate"
      />

      <div
        v-if="currentPage > 4 && totalPages > 7"
        class="ellipsis"
        aria-hidden="true"
      >
        <div />
      </div>
      <PaginationButtonComponent
        v-else-if="totalPages > 2"
        :current-page="currentPage"
        :page="2"
        @clicked="paginate"
      />

      <template v-if="totalPages > 7">
        <PaginationButtonComponent
          v-for="index in middlePages"
          :key="`pagination-button-${index}`"
          :current-page="currentPage"
          :page="index"
          @clicked="paginate"
        />
      </template>
      <template v-else>
        <template v-for="index in totalPages">
          <PaginationButtonComponent
            v-if="index > 2 && index < totalPages"
            :key="`pagination-button-${index}`"
            :current-page="currentPage"
            :page="index"
            @clicked="paginate"
          />
        </template>
      </template>

      <div
        v-if="currentPage < (totalPages - 3) && totalPages > 7"
        class="ellipsis"
        aria-hidden="true"
      >
        <div />
      </div>
      <PaginationButtonComponent
        v-else-if="totalPages > 7"
        :current-page="currentPage"
        :page="totalPages - 1"
        @clicked="paginate"
      />

      <PaginationButtonComponent
        :current-page="currentPage"
        :page="totalPages"
        @clicked="paginate"
      />

      <button
        class="button button--next"
        :disabled="currentPage === totalPages"
        title="Next page"
        @click="paginate(currentPage + 1)"
      >
        <span class="sr-only">Next page</span>
      </button>
    </nav>
  </div>
</template>

<script>
import PaginationButtonComponent from '@/components/pagination-button'

export default {
  name: 'PaginationComponent',
  components: {
    PaginationButtonComponent
  },
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  computed: {
    middlePages () {
      const middlePage = Math.min(
        Math.max(this.currentPage, 4), this.totalPages - 3
      )
      return [
        middlePage - 1,
        middlePage,
        middlePage + 1
      ]
    }
  },
  methods: {
    paginate (page) {
      this.$emit('paginate', page)
    }
  }
}
</script>

<style lang="scss" scoped>
.button[disabled] {
  &, &:hover, &:active {
    background: $grey-500;
  }
  &, &:active, .dark-mode &:active {
    color: $grey-1000;
  }
}

.button.active {
  &, &:hover, &:active {
    background: $red-900;
  }
}

.pagination-buttons {
  display: inline-flex;
  flex-flow: row nowrap;
  margin: ($baseline-rem * .5) 0 $baseline-rem;
  border-radius: 4px + ($p-line-px * .5);
  box-shadow: $button-shadow;
  .dark-mode & {
    box-shadow: $button-shadow--dark;
  }
}

.button {
  border-radius: 0;
  width: 8px + $p-line-px;
  height: 8px + $p-line-px;
  font-size: $small-font-rem;
  &, .dark-mode & {
    box-shadow: none;
  }
  &, &[disabled]:active, &.active:active {
    padding: 4px 0;
  }
  &:active {
    padding: 5px 0 3px;
  }
  & ~ .button {
    margin-left: 1px;
  }
}

.ellipsis {
  position: relative;
  margin-left: 1px;
  width: 8px + $p-line-px;
  height: 8px + $p-line-px;
  background: $red-100;
  color: $grey-1150;
  div {
    top: 2px + ($p-line-px * .5);
    left: 2px + ($p-line-px * .5);
    &, &:before, &:after {
      position: absolute;
      border-radius: 2px;
      width: 4px;
      height: 4px;
      background: currentColor;
    }
    &:before, &:after {
      @extend %Psuedo-element;
      display: block;
      top: 0;
    }
    &:before {
      left: -6px;
    }
    &:after {
      right: -6px;
    }
  }
}

.button--prev, .button--next {
  width: 4px + $p-line-px;
  // Unrelated to the .ellipsis pseudo-elements above
  // stylelint-disable-next-line no-descending-specificity
  &:after {
    @extend %Psuedo-element;
    position: relative;
    display: block;
    margin: auto;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
}

.button--prev {
  border-radius: (4px + ($p-line-px * .5)) 0 0 (4px + ($p-line-px * .5));
  &:after {
    border-right: 7px solid currentColor;
  }
}

.button--next {
  border-radius: 0 (4px + ($p-line-px * .5)) (4px + ($p-line-px * .5)) 0;
  &:after {
    border-left: 7px solid currentColor;
  }
}
</style>
