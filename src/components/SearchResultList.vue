<template>
  <div>
    <h2 class="text-3xl ml-4 mb-3" v-if="results.length">Results</h2>
    <div id="not-found" v-if="isNotFound">Not Found.</div>
    <SearchResultListItem
      class="mx-4 mb-4"
      v-for="(result, index) in results"
      v-bind:key="index"
      v-bind:result="result"
    ></SearchResultListItem>
    <nav class="mx-4 mt-12 mb-8 text-center">
      <button
        type="button"
        id="more-results-btn"
        class="
          text-black
          w-full
          h-10
          bg-gray-100
          border-gray-100 border-2
          shadow-md
          rounded-md
          disabled:opacity-30
          hover:opacity-70
        "
        v-show="isResultsMore"
        v-bind:disabled="isLoading"
        v-on:click="showMoreResults"
      >
        More
      </button>
    </nav>
    <section id="error" v-if="isError">
      <div class="is-danger">{{ errorMessage }}</div>
    </section>
  </div>
</template>
<script>
import SearchResultListItem from './SearchResultListItem.vue';

const errorMessage =
  'An error occurred during communication. Please reload the page or check the communication environment';

export default {
  components: {
    SearchResultListItem,
  },
  props: {
    isLoading: Boolean,
    isNotFound: Boolean,
    results: Array,
    nextUrl: String,
    isError: Boolean,
  },
  computed: {
    isResultsMore() {
      if (this.nextUrl) {
        return true;
      }

      return false;
    },
  },
  methods: {
    showMoreResults() {
      this.$emit('show-more');
    },
  },
};
</script>
<style lang="scss" scoped>
a,
a:visited {
  color: #3273dc;
  text-decoration: underline;
  &:hover {
    opacity: 0.75;
  }
}

.more-button {
  color: #3273dc;
  &:hover {
    color: #3273dc;
    background: white;
  }
}

.bottom-gap {
  margin-bottom: 2rem;
}
</style>
