<template>
  <div>
    <b-field grouped>
      <b-input
        placeholder="Search..."
        type="search"
        v-model="searchStr"
        expanded
      ></b-input>
      <p class="control">
        <button
          id="search-btn"
          v-bind:class="{ 'is-loading': isLoading }"
          class="button is-info"
          type="submit"
          v-bind:disabled="!searchStr || isLoading"
          v-on:click="searchRepo"
        >
          Search
        </button>
      </p>
    </b-field>
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
