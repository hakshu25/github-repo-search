<template>
  <div>
    <div class="bottom-gap">
      <h2 class="title is-2">GitHub Repository Search</h2>
      <SearchField
        v-bind:is-loading="isLoading"
        v-on:search-repo="searchRepo($event)"
      ></SearchField>
    </div>
    <SearchResultList
      v-bind:is-loading="isLoading"
      v-bind:is-not-found="isNotFound"
      v-bind:results="results"
      v-bind:next-url="nextUrl"
      v-bind:isError="isError"
      v-on:show-more="showMoreResults"
    ></SearchResultList>
  </div>
</template>
<script>
import SearchField from './SearchField.vue';
import SearchResultList from './SearchResultList.vue';
import GithubRepoList from '../models/github-repo-list';

export default {
  components: {
    SearchField,
    SearchResultList,
  },
  beforeCreate() {
    this.model = new GithubRepoList();
    this.model.listChanged.observe(() => {
      this.results = this.model.all;
    });
    this.model.nextUrlChanged.observe(() => {
      this.nextUrl = this.model.nextUrl;
    });
    this.model.isErrorChanged.observe(() => {
      this.isError = this.model.isError;
    });
  },
  data() {
    return {
      results: this.model.all,
      nextUrl: this.model.nextUrl,
      isError: this.model.isError,
      isLoading: false,
      isNotFound: false,
    };
  },
  watch: {
    results() {
      this.$nextTick(() => {
        this.hideLoading();
        this.setNotFound();
      });
    },
    isError() {
      this.$nextTick(() => {
        this.hideLoading();
      });
    },
  },
  methods: {
    async searchRepo(searchStr) {
      this.showLoading();
      await this.model.fetchByKeyword(searchStr);
    },
    showMoreResults() {
      this.showLoading();
      this.model.fetchNext();
    },
    showLoading() {
      this.isLoading = true;
    },
    hideLoading() {
      this.isLoading = false;
    },
    setNotFound() {
      if (!this.results.length) {
        this.isNotFound = true;
        return;
      }
      this.isNotFound = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.bottom-gap {
  margin-bottom: 2rem;
}
</style>
