import axios from 'axios';
import GithubRepoList from '../../../src/models/github-repo-list';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

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
      axios.get.mockResolvedValue(data);
      vi.spyOn(githubRepoList.listChanged, 'execute');
      vi.spyOn(githubRepoList.isErrorChanged, 'execute');

      await githubRepoList.fetchByKeyword('');

      expect(githubRepoList.all).toEqual([item]);
      expect(githubRepoList.isError).toBeFalsy();
      expect(githubRepoList.listChanged.execute).toHaveBeenCalled();
      expect(githubRepoList.isErrorChanged.execute).not.toHaveBeenCalled();
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
          link: '<http://example.com?page=2>; rel="next", <http://example.com?page=3>; rel="last"',
        },
      };
      axios.get.mockResolvedValue(data);
      vi.spyOn(githubRepoList.nextUrlChanged, 'execute');

      await githubRepoList.fetchByKeyword('');

      expect(githubRepoList.nextUrl).toBe('http://example.com?page=2');
      expect(githubRepoList.nextUrlChanged.execute).toHaveBeenCalled();
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
      axios.get.mockResolvedValue(data);
      vi.spyOn(githubRepoList.nextUrlChanged, 'execute');

      await githubRepoList.fetchByKeyword('');

      expect(githubRepoList.nextUrl).toEqual(undefined);
      expect(githubRepoList.nextUrlChanged.execute).not.toHaveBeenCalled();
    });

    it('Set error flag when error occurred', async () => {
      axios.get.mockRejectedValue('ERROR MESSAGE');
      vi.spyOn(githubRepoList.isErrorChanged, 'execute');

      await githubRepoList.fetchByKeyword('');

      expect(githubRepoList.isError).toBeTruthy();
      expect(githubRepoList.isErrorChanged.execute).toHaveBeenCalled();
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
          link: '<http://example.com?page=2>; rel="next", <http://example.com?page=3>; rel="last"',
        },
      };
      axios.get.mockResolvedValue(oldData);
      await githubRepoList.fetchByKeyword('');
      axios.get.mockResolvedValue(data);
      vi.spyOn(githubRepoList.listChanged, 'execute');
      vi.spyOn(githubRepoList.nextUrlChanged, 'execute');
      vi.spyOn(githubRepoList.isErrorChanged, 'execute');

      await githubRepoList.fetchNext();

      expect(githubRepoList.all).toEqual([oldItem, item]);
      expect(githubRepoList.nextUrl).toEqual('http://example.com?page=2');
      expect(githubRepoList.isError).toBeFalsy();
      expect(githubRepoList.listChanged.execute).toHaveBeenCalled();
      expect(githubRepoList.nextUrlChanged.execute).toHaveBeenCalled();
      expect(githubRepoList.isErrorChanged.execute).not.toHaveBeenCalled();
    });

    it('Set error message when error occurred', async () => {
      axios.get.mockRejectedValue('ERROR MESSAGE');
      vi.spyOn(githubRepoList.isErrorChanged, 'execute');

      await githubRepoList.fetchNext();

      expect(githubRepoList.isError).toBeTruthy();
      expect(githubRepoList.isErrorChanged.execute).toHaveBeenCalled();
    });
  });
});
