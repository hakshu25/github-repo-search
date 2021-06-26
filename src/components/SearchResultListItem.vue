<template>
  <div
    class="grid grid-rows-2 grid-cols-6 gap-4 border-1 p-4 rounded-lg shadow-md"
  >
    <div class="row-span-2 col-span-1">
      <img
        id="avatar-image"
        v-if="result.owner.avatar_url"
        v-bind:src="result.owner.avatar_url"
      />
    </div>
    <div class="row-span-2 col-span-5">
      <p>
        <a
          id="repo-name"
          class="text-3xl block mb-2 text-blue-700 hover:text-blue-500"
          v-bind:href="result.html_url"
          target="_blank"
          >{{ result.full_name }}</a
        >
        <span id="description">{{ result.description }}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    result: Object,
  },
};
</script>
<style lang="scss" scoped></style>
