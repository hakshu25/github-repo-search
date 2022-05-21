import { ref } from 'vue';

export default function useLoading() {
  const isLoading = ref(false);

  const showLoading = () => {
    isLoading.value = true;
  };
  const hideLoading = () => {
    isLoading.value = false;
  };

  return {
    isLoading,
    showLoading,
    hideLoading,
  };
}
