import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import Search from '@/components/Search.vue';

jest.mock('axios');

describe('Search.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Search);
  });

  describe('computed', () => {
    describe('isResultsMore', () => {
      const result = {
        owner: {},
        html_url: '',
        full_name: '',
        description: '',
      };
      const results = [result, result];

      it('Return true if totalCount > results.length', () => {
        wrapper.vm.$data.results = results;
        wrapper.vm.$data.totalCount = 3;

        const actual = wrapper.vm.isResultsMore;

        expect(actual).toBeTruthy();
      });

      it('Return false if totalCount === results.length', () => {
        const wrapper = shallowMount(Search);
        wrapper.vm.$data.results = results;
        wrapper.vm.$data.totalCount = 2;

        const actual = wrapper.vm.isResultsMore;

        expect(actual).toBeFalsy();
      });

      it('Return false if totalCount < results.length', () => {
        wrapper.vm.$data.results = results;
        wrapper.vm.$data.totalCount = 1;

        const actual = wrapper.vm.isResultsMore;

        expect(actual).toBeFalsy();
      });
    });
  });

  describe('initState()', () => {
    it('Set to initial state', () => {
      wrapper.vm.$data.isLoading = false;
      wrapper.vm.$data.error = 'ERROR';
      wrapper.vm.$data.isNotFound = true;

      wrapper.vm.initState();

      expect(wrapper.vm.$data.isLoading).toBeTruthy();
      expect(wrapper.vm.$data.error).toBeNull();
      expect(wrapper.vm.$data.isNotFound).toBeFalsy();
    });
  });

  describe('searchRepo()', () => {
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

      await wrapper.vm.searchRepo();

      expect(wrapper.vm.$data.results).toEqual([item]);
      expect(wrapper.vm.$data.totalCount).toEqual(1);
      expect(wrapper.vm.$data.linkStr).toEqual('');
      expect(wrapper.vm.$data.isLoading).toBeFalsy();
      expect(wrapper.vm.$data.error).toBeNull();
      expect(wrapper.vm.$data.isNotFound).toBeFalsy();
    });

    it('Set not found flag if there is no result', async () => {
      const data = {
        data: {
          items: [],
          total_count: 0,
        },
        headers: {},
      };
      axios.get.mockImplementation(() => Promise.resolve(data));

      await wrapper.vm.searchRepo();

      expect(wrapper.vm.$data.results).toEqual([]);
      expect(wrapper.vm.$data.totalCount).toEqual(0);
      expect(wrapper.vm.$data.linkStr).toEqual('');
      expect(wrapper.vm.$data.isLoading).toBeFalsy();
      expect(wrapper.vm.$data.error).toBeNull();
      expect(wrapper.vm.$data.isNotFound).toBeTruthy();
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

      await wrapper.vm.searchRepo();

      expect(wrapper.vm.$data.totalCount).toEqual(31);
      expect(wrapper.vm.$data.linkStr).toEqual(data.headers.link);
      expect(wrapper.vm.$data.urls).toEqual({
        next: 'http://example.com?page=2',
        last: 'http://example.com?page=3',
      });
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

      await wrapper.vm.searchRepo();

      expect(wrapper.vm.$data.totalCount).toEqual(30);
      expect(wrapper.vm.$data.linkStr).toEqual('');
      expect(wrapper.vm.$data.urls).toEqual({});
    });

    it('Set error message when error occurred', async () => {
      axios.get.mockImplementation(() => Promise.reject('ERROR MESSAGE'));

      await wrapper.vm.searchRepo();

      expect(wrapper.vm.$data.isLoading).toBeFalsy();
      expect(wrapper.vm.$data.error).not.toBeNull();
    });
  });

  describe('showMoreResults()', () => {
    it('Call the method that displays the next search result', () => {
      const urls = {
        next: 'sampleUrl',
      };
      wrapper.vm.$data.urls = urls;
      const spy = jest
        .spyOn(wrapper.vm, 'fetchNextResults')
        .mockImplementation();

      wrapper.vm.showMoreResults();

      expect(spy).toHaveBeenCalledWith('sampleUrl');
    });
  });

  describe('fetchNextResults()', () => {
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
      axios.get.mockImplementation(() => Promise.resolve(data));
      wrapper.vm.$data.results = [oldItem];

      await wrapper.vm.fetchNextResults('url');

      expect(wrapper.vm.$data.results).toEqual([oldItem, item]);
      expect(wrapper.vm.$data.linkStr).toEqual(data.headers.link);
      expect(wrapper.vm.$data.urls).toEqual({
        next: 'http://example.com?page=2',
        last: 'http://example.com?page=3',
      });
      expect(wrapper.vm.$data.isLoading).toBeFalsy();
      expect(wrapper.vm.$data.error).toBeNull();
      expect(wrapper.vm.$data.isNotFound).toBeFalsy();
    });

    it('Set error message when error occurred', async () => {
      axios.get.mockImplementation(() => Promise.reject('ERROR MESSAGE'));

      await wrapper.vm.fetchNextResults('url');

      expect(wrapper.vm.$data.isLoading).toBeFalsy();
      expect(wrapper.vm.$data.error).not.toBeNull();
    });
  });

  describe('parseLinks()', () => {
    it('Parse link into object property according to rel', () => {
      const linkStr =
        '<http://example.com?page=2>; rel="next", <http://example.com?page=3>; rel="last"';
      wrapper.vm.$data.linkStr = linkStr;
      const expected = {
        next: 'http://example.com?page=2',
        last: 'http://example.com?page=3',
      };

      wrapper.vm.parseLinks();

      expect(wrapper.vm.$data.urls).toEqual(expected);
    });
  });
});
