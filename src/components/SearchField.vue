<template>
  <div class="flex flex-wrap">
    <div class="flex-grow">
      <input
        placeholder="Search..."
        type="text"
        v-model="searchStr"
        class="border-gray-100 border-2 rounded h-10 w-full p-2"
      />
    </div>
    <div class="flex-grow-0 ml-4">
      <button
        id="search-btn"
        class="
          h-10
          bg-blue-400
          text-white
          py-2
          px-6
          rounded
          disabled:opacity-50
        "
        type="submit"
        v-bind:disabled="!searchStr || isLoading"
        v-on:click="searchRepo"
      >
        Search
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: { isLoading: Boolean },
  data() {
    return {
      searchStr: '',
    };
  },
  methods: {
    searchRepo() {
      this.$emit('search-repo', this.searchStr);
    },
  },
};
</script>
<style lang="scss" scoped></style>
