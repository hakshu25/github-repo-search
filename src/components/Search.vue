<template>
  <div>
    <div class="bottom-gap">
      <h2 class="title is-2">GitHub Repository Search</h2>
      <SearchField
        v-bind:is-loading="isLoading"
        v-on:search-repo="searchRepo($event)"
      >
      </SearchField>
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

const searchRepoUrl = 'https://api.github.com/search/repositories';
const errorMessage =
  'An error occurred during communication. Please reload the page or check the communication environment';

export default {
  components: {
    SearchField,
    SearchResultList,
  },
  data() {
    return {
      results: [],
      totalCount: 0,
      linkStr: '',
      urls: {},
      isLoading: false,
      isNotFound: false,
      error: null,
    };
  },
  watch: {
    results() {
      this.$nextTick(() => {
        this.isLoading = false;
        if (this.totalCount) {
          this.isNotFound = false;
        }
      });
    },
  },
  methods: {
    /**
     * 通信開始時に初期化する
     */
    initState() {
      this.isLoading = true;
      this.error = null;
      this.isNotFound = false;
    },
    /**
     * リポジトリの検索結果を取得する
     */
    async searchRepo(searchStr) {
      this.initState();
      await axios
        .get(`${searchRepoUrl}?q=${searchStr}`)
        .then((res) => {
          this.results = res.data.items;
          this.totalCount = res.data.total_count;
          // 検索結果が0件
          if (!this.totalCount) {
            this.isNotFound = true;
            return;
          }

          // 検索結果が30件を超える場合、ページング可能にする
          if (this.totalCount > 30 && res.headers.link) {
            this.linkStr = res.headers.link;
            this.parseLinks();
          }
        })
        .catch((err) => {
          console.error(err);
          this.error = errorMessage;
          this.isLoading = false;
        });
    },
    /**
     * 次の検索結果を表示する
     */
    showMoreResults() {
      this.fetchNextResults(this.urls.next);
    },
    /**
     * 次の検索結果を取得する
     * @param {String} url 検索ページングURL
     */
    async fetchNextResults(url) {
      this.initState();
      await axios
        .get(url)
        .then((res) => {
          // 検索結果を追加して表示する
          this.results.push(...res.data.items);
          this.linkStr = res.headers.link;
          this.parseLinks();
        })
        .catch((err) => {
          console.error(err);
          this.error = errorMessage;
          this.isLoading = false;
        });
    },
    /**
     * 検索時のページングURLをパースする
     */
    parseLinks() {
      const links = this.linkStr.split(',');
      let urls = {};
      links.forEach((link) => {
        const section = link.split(';');
        const url = section[0].replace(/<(.*)>/, '$1').trim();
        const type = section[1].replace(/rel="(.*)"/, '$1').trim();
        urls[type] = url;
      });
      this.urls = urls;
    },
  },
};
</script>
<style lang="scss" scoped>
.bottom-gap {
  margin-bottom: 2rem;
}
</style>
