import { fireEvent, render } from '@testing-library/vue';
import SearchResultList from '../../../src/components/SearchResultList.vue';

describe('SearchResultList Component', () => {
  describe('もっと見るボタン', () => {
    const result = {
      owner: {},
      html_url: '',
      full_name: '',
      description: '',
    };

    describe('表示切り替え', () => {
      describe('表示結果がさらにある場合', () => {
        it('ボタンを表示すること', () => {
          const { queryByRole } = render(SearchResultList, {
            props: {
              results: [result, result],
              nextUrl: 'next-url',
            },
          });

          expect(queryByRole('button')).not.toBeNull();
        });
      });

      describe('表示結果がこれ以上ない場合', () => {
        it('ボタンを表示しないこと', () => {
          const { queryByRole } = render(SearchResultList, {
            props: {
              results: [result],
              nextUrl: undefined,
            },
          });

          expect(queryByRole('button')).toBeNull();
        });
      });
    });

    describe('ボタンクリック時', () => {
      it('イベントが実行されること', async () => {
        const { getByRole, emitted } = render(SearchResultList, {
          props: {
            results: [result],
            nextUrl: 'next-url',
            isLoading: false,
          },
        });
        const moreBtn = getByRole('button');
        await fireEvent.click(moreBtn);
        const showEvents = emitted()['show-more'];

        expect(showEvents.length).toBe(1);
        expect(showEvents[0]).toEqual([]);
      });
    });

    describe('ローディング表示', () => {
      describe('ローディング中の場合', () => {
        it('ボタンが無効化されること', () => {
          const { getByRole } = render(SearchResultList, {
            props: {
              results: [result],
              nextUrl: 'next-url',
              isLoading: true,
            },
          });
          const moreBtn = getByRole('button');

          expect(moreBtn.disabled).toBeTruthy();
        });
      });

      describe('ローディングしていない場合', () => {
        it('ボタンが有効化されていること', () => {
          const { getByRole } = render(SearchResultList, {
            props: {
              results: [result],
              nextUrl: 'next-url',
              isLoading: false,
            },
          });
          const moreBtn = getByRole('button');

          expect(moreBtn.disabled).toBeFalsy();
        });
      });
    });
  });

  describe('not found メッセージ', () => {
    describe('表示するものが無い場合', () => {
      it('メッセージを表示する', () => {
        const { queryByText } = render(SearchResultList, {
          props: {
            results: [],
            isNotFound: true,
          },
        });

        expect(queryByText('Not Found.')).not.toBeNull();
      });
    });

    describe('表示するものがある場合', () => {
      it('メッセージを表示しない', () => {
        const { queryByText } = render(SearchResultList, {
          props: {
            results: [],
            isNotFound: false,
          },
        });

        expect(queryByText('Not Found.')).toBeNull();
      });
    });
  });

  describe('エラーメッセージ', () => {
    describe('エラーがある場合', () => {
      it('エラーメッセージを表示すること', () => {
        const { queryByText } = render(SearchResultList, {
          props: {
            results: [],
            isError: true,
          },
        });

        expect(queryByText(/error/)).not.toBeNull();
      });
    });

    describe('エラーが無い場合', () => {
      it('エラーメッセージを表示しないこと', () => {
        const { queryByText } = render(SearchResultList, {
          props: {
            results: [],
            isError: false,
          },
        });

        expect(queryByText(/error/)).toBeNull();
      });
    });
  });
});
