<template>
  <div class="search-component">
    <div class="search-area">
      <h1 class="title is-1">GitHub Repository Search</h1>
      <b-field grouped>
        <b-input placeholder="Search..." type="search" v-model="search" expanded></b-input>
        <p class="control">
          <button
            class="button is-primary"
            type="submit"
            v-bind:disabled="!search || this.isProcessing"
            v-on:click="searchRepo"
          >Search</button>
        </p>
      </b-field>
    </div>
    <div class="search-result-area">
      <h1 class="title is-1" v-if="results.length && !notFound">Results</h1>
      <p v-if="notFound">Not Found</p>
      <article class="media" v-for="(result, index) in results" v-bind:key="index">
        <figure class="media-left">
          <p class="image is-64x64">
            <img v-if="result.owner.avatar_url" v-bind:src="result.owner.avatar_url">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h3 class="title is-3" v-if="result">{{result.full_name}}</h3>
            <span v-if="result">{{result.description}}</span>
          </div>
        </div>
      </article>
      <div class="columns is-centered">
        <a
          v-show="isMore"
          v-bind:disabled="this.isProcessing"
          v-on:click.prevent.stop="showMoreResults"
        >More...</a>
      </div>
    </div>
  </div>
</template>
<script>
const searchRepoUrl = "https://api.github.com/search/repositories";
export default {
  data() {
    return {
      search: "",
      results: [],
      link: "",
      urls: {},
      notFound: false,
      isMore: false,
      isProcessing: false
    };
  },
  methods: {
    searchRepo() {
      // 通信処理開始
      this.processing();
      this.$axios
        .get(`${searchRepoUrl}?q=${this.search}`)
        .then(res => {
          console.log(res);
          // 検索結果が0件であることを表示する
          if (!res.data.items.length) {
            this.showNotFoundResult();
            return;
          }

          this.notFound = false;
          this.results = res.data.items;
          // 検索結果が30件以上存在する場合、ページング可能にする
          if (res.headers.link) {
            this.link = res.headers.link;
            this.parseLinks();
            this.more();
          }
          // 処理完了
          this.standby();
        })
        .catch(err => {
          console.error(err);
          this.standby();
        });
    },
    processing() {
      this.isProcessing = true;
    },
    standby() {
      this.isProcessing = false;
    },
    more() {
      this.isMore = true;
    },
    last() {
      this.isMore = false;
    },
    showNotFoundResult() {
      this.notFound = true;
      this.results = [];
      this.standby();
      this.last();
    },
    showMoreResults() {
      this.parseLinks();
      this.fetchNextResults(this.urls.next);
    },
    fetchNextResults(url) {
      // 通信処理開始
      this.processing();
      this.$axios
        .get(url)
        .then(res => {
          console.log(res);
          // 検索結果を追加して表示する
          this.results.push(...res.data.items);
          this.link = res.headers.link;
          this.parseLinks();
          // 検索結果をすべて表示した場合、ページングを終了する
          if (this.urls.next === this.urls.last) {
            this.last();
          }
          // 処理完了
          this.standby();
        })
        .catch(err => {
          console.error(err);
          this.standby();
        });
    },
    parseLinks() {
      const links = this.link.split(",");
      const urls = {};
      links.forEach(link => {
        const section = link.split(";");
        const url = section[0].replace(/<(.*)>/, "$1").trim();
        const name = section[1].replace(/rel="(.*)"/, "$1").trim();
        urls[name] = url;
      });
      this.urls = urls;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

