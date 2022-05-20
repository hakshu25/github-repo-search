import { fireEvent, render } from '@testing-library/vue';
import SearchField from '../../../src/components/SearchField.vue';

describe('SearchField Component', () => {
  describe('ローディング表示', () => {
    describe('ローディング中の場合', () => {
      it('検索ボタンが無効化されている', async () => {
        const { getByRole } = render(SearchField, {
          props: {
            isLoading: true,
          },
        });
        const searchTextInput = getByRole('textbox');
        await fireEvent.update(searchTextInput, 'TEST');
        expect(getByRole('button').disabled).toBeTruthy();
      });
    });

    describe('ローディングしていない場合', () => {
      it('検索ボタンが有効化されている', async () => {
        const { getByRole } = render(SearchField, {
          props: {
            isLoading: false,
          },
        });
        const searchTextInput = getByRole('textbox');
        await fireEvent.update(searchTextInput, 'TEST');
        expect(getByRole('button').disabled).toBeFalsy();
      });
    });
  });

  describe('検索ボタン', () => {
    it('ボタンをクリックするとイベントが発生すること', async () => {
      const { getByRole, emitted } = render(SearchField, {
        props: {
          isLoading: false,
        },
      });

      const searchTextInput = getByRole('textbox');
      await fireEvent.update(searchTextInput, 'aaa');

      const searchBtn = getByRole('button');
      await fireEvent.click(searchBtn);

      const searchEvents = emitted()['search-repo'];

      expect(searchEvents.length).toBe(1);
      expect(searchEvents[0]).toEqual(['aaa']);
    });
  });
});
