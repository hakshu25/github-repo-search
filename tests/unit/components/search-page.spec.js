import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import SearchPage from '../../../src/components/SearchPage.vue';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

describe('SearchPage Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SearchPage);
  });

  describe('methods', () => {
    describe('showLoading()', () => {
      it('Set isLoading to true', () => {
        wrapper.vm.$data.isLoading = false;

        wrapper.vm.showLoading();

        expect(wrapper.vm.$data.isLoading).toBeTruthy();
      });
    });

    describe('hideLoading()', () => {
      it('Set isLoading to false', () => {
        wrapper.vm.$data.isLoading = true;

        wrapper.vm.hideLoading();

        expect(wrapper.vm.$data.isLoading).toBeFalsy();
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
        axios.get.mockResolvedValue(data);

        await wrapper.vm.searchRepo('');

        expect(wrapper.vm.$data.results).toEqual([item]);
        expect(wrapper.vm.$data.isLoading).toBeFalsy();
        expect(wrapper.vm.$data.isError).toBeFalsy();
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
        axios.get.mockResolvedValue(data);

        await wrapper.vm.searchRepo('');

        expect(wrapper.vm.$data.nextUrl).toBeUndefined();
        expect(wrapper.vm.$data.isLoading).toBeFalsy();
        expect(wrapper.vm.$data.isError).toBeFalsy();
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
            link: '<http://example.com?page=2>; rel="next", <http://example.com?page=3>; rel="last"',
          },
        };
        axios.get.mockResolvedValue(data);

        await wrapper.vm.searchRepo('');

        expect(wrapper.vm.$data.nextUrl).toEqual('http://example.com?page=2');
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

        await wrapper.vm.searchRepo('');

        expect(wrapper.vm.$data.nextUrl).toBeUndefined();
      });

      it('Set error message when error occurred', async () => {
        axios.get.mockRejectedValue('ERROR MESSAGE');

        await wrapper.vm.searchRepo('');

        expect(wrapper.vm.$data.isLoading).toBeFalsy();
        expect(wrapper.vm.$data.isError).toBeTruthy();
      });
    });

    describe('showMoreResults()', () => {
      it('Call the method that displays the next search result', () => {
        const spy = vi
          .spyOn(wrapper.vm.model, 'fetchNext')
          .mockImplementation();

        wrapper.vm.showMoreResults();

        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
