<template>
  <div id="app">
    <SearchPage></SearchPage>
  </div>
</template>

<script>
import SearchPage from './components/SearchPage.vue';

export default {
  name: 'app',
  components: {
    SearchPage,
  },
};
</script>

<style lang="scss">
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
</style>
