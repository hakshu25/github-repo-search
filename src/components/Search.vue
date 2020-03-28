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
    <main>
      <!-- 検索結果表示 -->
      <h1 class="title is-2" v-if="results.length">Results</h1>
      <b-notification id="not-found" v-if="isNotFound">
        Not Found.
      </b-notification>
      <article
        class="media bottom-gap"
        v-for="(result, index) in results"
        v-bind:key="index"
      >
        <p class="media-left image is-64x64">
          <img
            id="avatar-image"
            v-if="result.owner.avatar_url"
            v-bind:src="result.owner.avatar_url"
          />
        </p>
        <div class="media-content">
          <div class="content">
            <p v-if="result">
              <a
                id="repo-name"
                class="title is-3"
                v-bind:href="result.html_url"
                target="_blank"
                >{{ result.full_name }}</a
              >
            </p>
            <span id="description" v-if="result">{{ result.description }}</span>
          </div>
        </div>
      </article>
      <!-- 検索結果ページングボタン -->
      <nav class="level-item has-text-centered">
        <button
          type="button"
          id="more-results-btn"
          v-bind:class="{ 'is-loading': isLoading }"
          class="button is-text is-large more-button bottom-gap"
          v-show="results.length && isResultsMore"
          v-bind:disabled="isLoading"
          v-on:click="showMoreResults"
        >
          More...
        </button>
      </nav>
      <!-- エラーメッセージ -->
      <section id="error" v-if="error">
        <b-notification type="is-danger">{{ error }}</b-notification>
      </section>
    </main>
  </div>
</template>
<script>
import axios from 'axios';
import SearchField from './SearchField.vue';

const searchRepoUrl = 'https://api.github.com/search/repositories';
const errorMessage =
  'An error occurred during communication. Please reload the page or check the communication environment';

export default {
  components: {
    SearchField,
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
  computed: {
    /**
     * 追加検索結果があるかどうか判定する
     * @return {boolean}
     */
    isResultsMore: function () {
      if (this.results.length < this.totalCount) {
        return true;
      }

      return false;
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
