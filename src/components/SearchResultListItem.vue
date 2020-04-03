<template>
  <div>
    <p class="media-left image is-64x64">
      <img id="avatar-image" v-if="result.owner.avatar_url" v-bind:src="result.owner.avatar_url" />
    </p>
    <div class="media-content">
      <div class="content">
        <p>
          <a
            id="repo-name"
            class="title is-3"
            v-bind:href="result.html_url"
            target="_blank"
          >{{ result.full_name }}</a>
        </p>
        <span id="description">{{ result.description }}</span>
      </div>
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
