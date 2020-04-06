<template>
  <div>
    <div class="bottom-gap">
      <h2 class="title is-2">GitHub Repository Search</h2>
      <SearchField v-bind:is-loading="isLoading" v-on:search-repo="searchRepo($event)"></SearchField>
    </div>
    <SearchResultList
      v-bind:is-loading="isLoading"
      v-bind:is-not-found="isNotFound"
      v-bind:results="results"
      v-bind:total-count="totalCount"
      v-bind:error="error"
      v-on:show-more="showMoreResults"
    ></SearchResultList>
  </div>
</template>
<script>
import axios from 'axios';
import SearchField from './SearchField.vue';
import SearchResultList from './SearchResultList.vue';
import GithubRepoList from '../models/github-repo-list';

const errorMessage =
  'An error occurred during communication. Please reload the page or check the communication environment';

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
    this.model.totalCountChanged.observe(() => {
      this.totalCount = this.model.totalCount;
    });
    this.model.nextUrlChanged.observe(() => {
      this.nextUrl = this.model.nextUrl;
    });
    this.model.errorChanged.observe(() => {
      this.error = this.model.error;
    });
  },
  data() {
    return {
      results: this.model.all,
      totalCount: this.model.totalCount,
      nextUrl: this.model.nextUrl,
      isLoading: false,
      isNotFound: false,
      error: this.model.error,
    };
  },
  watch: {
    results() {
      this.$nextTick(() => {
        this.isLoading = false;
        if (this.totalCount) {
          this.isNotFound = false;
        } else {
          this.isNotFound = true;
        }
      });
    },
    error() {
      this.$nextTick(() => {
        this.isLoading = false;
      });
    },
  },
  methods: {
    /**
     * 通信開始時に初期化する
     */
    initState() {
      this.isLoading = true;
      this.isNotFound = false;
    },
    /**
     * リポジトリの検索結果を取得する
     */
    async searchRepo(searchStr) {
      this.initState();
      await this.model.fetchByKeyword(searchStr);
    },
    /**
     * 次の検索結果を表示する
     */
    showMoreResults() {
      this.initState();
      this.model.fetchNext();
    },
  },
};
</script>
<style lang="scss" scoped>
.bottom-gap {
  margin-bottom: 2rem;
}
</style>
