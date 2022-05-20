import { render } from '@testing-library/vue';
import SearchResultListItem from '../../../src/components/SearchResultListItem.vue';

describe('SearchResultListItem Component', () => {
  const result = {
    owner: {
      avatar_url: 'http://example.com/avatar',
    },
    html_url: 'http://example.com/html_url',
    full_name: 'sample/repo',
    description: 'desc',
  };

  describe('アイテム表示', () => {
    it('画像表示', () => {
      const { getByRole } = render(SearchResultListItem, {
        props: { result },
      });
      const img = getByRole('img');

      expect(img).not.toBeNull();
      expect(img.src).toBe('http://example.com/avatar');
    });

    it('リポジトリ名表示', () => {
      const { getByRole } = render(SearchResultListItem, {
        props: { result },
      });

      expect(getByRole('link').textContent).toBe('sample/repo');
    });

    it('リポジトリ説明表示', () => {
      const { getByText } = render(SearchResultListItem, {
        props: { result },
      });

      expect(getByText('desc')).not.toBeNull();
    });
  });
});
