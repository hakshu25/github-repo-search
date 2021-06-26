module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}', '!src/main.js', '!src/App.vue'],
  coverageReporters: ['html', 'text'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
};
