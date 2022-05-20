<template>
  <div>
    <div class="m-6">
      <h2 class="text-4xl font-semibold mb-6">GitHub Repository Search</h2>
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
import { ref, watch } from 'vue';

export default {
  components: {
    SearchField,
    SearchResultList,
  },
  setup() {
    const model = ref(new GithubRepoList());
    const results = ref([]);
    const nextUrl = ref(undefined);
    const isError = ref(false);
    const isLoading = ref(false);
    const isNotFound = ref(false);

    model.value.listChanged.observe(() => {
      results.value = model.value.all;
    });
    model.value.nextUrlChanged.observe(() => {
      nextUrl.value = model.value.nextUrl;
    });
    model.value.isErrorChanged.observe(() => {
      isError.value = model.value.isError;
    });

    const searchRepo = async (searchStr) => {
      showLoading();
      await model.value.fetchByKeyword(searchStr);
    };
    const showMoreResults = () => {
      showLoading();
      model.value.fetchNext();
    };
    const showLoading = () => {
      isLoading.value = true;
    };
    const hideLoading = () => {
      isLoading.value = false;
    };

    watch(results, () => {
      hideLoading();

      if (!results.value.length) {
        isNotFound.value = true;
        return;
      }
      isNotFound.value = false;
    });
    watch(isError, () => {
      hideLoading();
    });

    return {
      model,
      results,
      nextUrl,
      isError,
      isLoading,
      isNotFound,
      searchRepo,
      showMoreResults,
      showLoading,
      hideLoading,
    };
  },
};
</script>
<style lang="scss" scoped>
.bottom-gap {
  margin-bottom: 2rem;
}
</style>
