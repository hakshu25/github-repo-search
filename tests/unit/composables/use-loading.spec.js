import useLoading from '../../../src/composables/use-loading';

describe('useLoading()', () => {
  it('ローディング状態が切り替わること', () => {
    const { isLoading, showLoading, hideLoading } = useLoading();
    expect(isLoading.value).toBeFalsy();

    showLoading();
    expect(isLoading.value).toBeTruthy();

    hideLoading();
    expect(isLoading.value).toBeFalsy();
  });
});
