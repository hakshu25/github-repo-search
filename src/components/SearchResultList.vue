<template>
  <div>
    <h1 class="title is-2" v-if="results.length">Results</h1>
    <b-notification id="not-found" v-if="isNotFound">Not Found.</b-notification>
    <SearchResultListItem
      class="media bottom-gap"
      v-for="(result, index) in results"
      v-bind:key="index"
      v-bind:result="result"
    ></SearchResultListItem>
    <nav class="level-item has-text-centered">
      <button
        type="button"
        id="more-results-btn"
        v-bind:class="{ 'is-loading': isLoading }"
        class="button is-text is-large more-button bottom-gap"
        v-show="isResultsMore"
        v-bind:disabled="isLoading"
        v-on:click="showMoreResults"
      >More...</button>
    </nav>
    <section id="error" v-if="error">
      <b-notification type="is-danger">{{ errorMessage }}</b-notification>
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
    error: String,
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
