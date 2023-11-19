export function useQImg() {
  const error = ref();
  const option = {
    onLoad() {
      error.value = false;
    },
    onError() {
      error.value = true;
    }
  };
  return { error, option };
}
