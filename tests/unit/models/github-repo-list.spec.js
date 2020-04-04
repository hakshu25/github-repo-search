import axios from 'axios';
import GithubRepoList from '@/models/github-repo-list';

jest.mock('axios');

describe('GithubRepoList', () => {
  let githubRepoList;

  beforeEach(() => {
    githubRepoList = new GithubRepoList();
  });

  describe('fetchByKeyword()', () => {
    it('Set result if there are results', async () => {
      const item = {
        owner: {},
        html_url: '',
        full_name: '',
        description: '',
      };
      const data = {
        data: {
          items: [item],
          total_count: 1,
        },
        headers: {},
      };
      axios.get.mockImplementation(() => Promise.resolve(data));

      await githubRepoList.fetchByKeyword('');

      expect(githubRepoList.all).toEqual([item]);
      expect(githubRepoList.totalCount).toBe(1);
      expect(githubRepoList.error).toBeNull();
    });

    it('Set paging link if there is next link', async () => {
      const item = {
        owner: {},
        html_url: '',
        full_name: '',
        description: '',
      };
      const data = {
        data: {
          items: new Array(31).fill(item),
          total_count: 31,
        },
        headers: {
          link:
            '<http://example.com?page=2>; rel="next", <http://example.com?page=3>; rel="last"',
        },
      };
      axios.get.mockImplementation(() => Promise.resolve(data));

      await githubRepoList.fetchByKeyword('');

      expect(githubRepoList.totalCount).toBe(31);
      expect(githubRepoList.nextUrl).toBe('http://example.com?page=2');
    });

    it('Does not set paging link if there are no next items', async () => {
      const item = {
        owner: {},
        html_url: '',
        full_name: '',
        description: '',
      };
      const data = {
        data: {
          items: new Array(30).fill(item),
          total_count: 30,
        },
        headers: {
          link: 'none next result',
        },
      };
      axios.get.mockImplementation(() => Promise.resolve(data));

      await githubRepoList.fetchByKeyword('');

      expect(githubRepoList.totalCount).toBe(30);
      expect(githubRepoList.nextUrl).toEqual(undefined);
    });

    it('Set error message when error occurred', async () => {
      axios.get.mockImplementation(() => Promise.reject('ERROR MESSAGE'));

      await githubRepoList.fetchByKeyword('');

      expect(githubRepoList.error).toBe('ERROR MESSAGE');
    });
  });

  describe('fetchNext()', () => {
    it('Add result to results', async () => {
      const oldItem = {
        owner: {},
        html_url: 'old',
        full_name: 'old item',
        description: 'old',
      };
      const item = {
        owner: {},
        html_url: '',
        full_name: '',
        description: '',
      };
      const oldData = {
        data: {
          items: [oldItem],
          total_count: 2,
          headers: {
            link: '',
          },
        },
      };
      const data = {
        data: {
          items: [item],
          total_count: 2,
        },
        headers: {
          link:
            '<http://example.com?page=2>; rel="next", <http://example.com?page=3>; rel="last"',
        },
      };
      axios.get.mockImplementation(() => Promise.resolve(oldData));
      await githubRepoList.fetchByKeyword('');
      axios.get.mockImplementation(() => Promise.resolve(data));

      await githubRepoList.fetchNext();

      expect(githubRepoList.all).toEqual([oldItem, item]);
      expect(githubRepoList.nextUrl).toEqual('http://example.com?page=2');
      expect(githubRepoList.error).toBeNull();
    });

    it('Set error message when error occurred', async () => {
      axios.get.mockImplementation(() => Promise.reject('ERROR MESSAGE'));

      await githubRepoList.fetchNext();

      expect(githubRepoList.error).toBe('ERROR MESSAGE');
    });
  });
});
