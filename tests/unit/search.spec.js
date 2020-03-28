import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import Search from '@/components/Search.vue';

jest.mock('axios');

describe('Search.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Search);
  });

  describe('template logic', () => {
    describe('loading', () => {
      describe('more button', () => {
        const result = {
          owner: {},
          html_url: '',
          full_name: '',
          description: '',
        };

        describe('If isLoading is true', () => {
          let button;

          beforeEach(() => {
            wrapper.setData({
              results: [result],
              totalCount: 2,
            });
          });

          it('there is class is-loading of button', async () => {
            // NOTE: Because isLoading is false in nextTick of results, set here
            wrapper.setData({ isLoading: true });
            await wrapper.vm.$forceUpdate();
            button = wrapper.find('#more-results-btn');
            expect(button.classes()).toContain('is-loading');
          });

          it('disable button', async () => {
            // NOTE: Because isLoading is false in nextTick of results, set here
            wrapper.setData({ isLoading: true });
            await wrapper.vm.$forceUpdate();
            button = wrapper.find('#more-results-btn');
            expect(button.attributes().disabled).toBe('disabled');
          });
        });

        describe('If isLoading is false', () => {
          let button;

          beforeEach(async () => {
            wrapper.setData({
              results: [result],
              totalCount: 2,
            });
          });

          it('there is not class is-loading of button', async () => {
            // NOTE: Because isLoading is false in nextTick of results, set here
            wrapper.setData({ isLoading: false });
            await wrapper.vm.$forceUpdate();
            button = wrapper.find('#more-results-btn');
            expect(button.classes()).not.toContain('is-loading');
          });

          it('enable button', async () => {
            // NOTE: Because isLoading is false in nextTick of results, set here
            wrapper.setData({ isLoading: false });
            await wrapper.vm.$forceUpdate();
            button = wrapper.find('#more-results-btn');
            expect(button.attributes().disabled).toBeUndefined();
          });
        });
      });
    });

    describe('search results', () => {
      describe('There are results', () => {
        beforeEach(async () => {
          wrapper.setData({
            results: [
              {
                owner: {
                  avatar_url: 'avatar',
                },
                html_url: 'html_url',
                full_name: 'sample/repo',
                description: 'desc',
              },
            ],
          });
          await wrapper.vm.$forceUpdate();
        });

        it('show avatar image', () => {
          expect(wrapper.find('#avatar-image').exists()).toBeTruthy();
        });

        it('show repository name', () => {
          expect(wrapper.find('#repo-name').text()).toBe('sample/repo');
        });

        it('show repository description', () => {
          expect(wrapper.find('#description').text()).toBe('desc');
        });
      });

      describe('There are no results', () => {
        beforeEach(async () => {
          wrapper.setData({
            results: [],
          });
          await wrapper.vm.$forceUpdate();
        });

        it('Do not show avatar image', () => {
          expect(wrapper.find('#avatar-image').exists()).toBeFalsy();
        });

        it('Do not show repository name', () => {
          expect(wrapper.find('#repo-name').exists()).toBeFalsy();
        });

        it('Do not show repository description', () => {
          expect(wrapper.find('#description').exists()).toBeFalsy();
        });
      });
    });

    describe('not found message', () => {
      describe('There are no results', () => {
        it('Show message', async () => {
          wrapper.setData({ isNotFound: true });
          await wrapper.vm.$forceUpdate();
          const message = wrapper.find('#not-found');
          expect(message.exists()).toBeTruthy();
        });
      });

      describe('There are results', () => {
        it('Do not show message', async () => {
          wrapper.setData({ isNotFound: false });
          await wrapper.vm.$forceUpdate();
          const message = wrapper.find('#not-found');
          expect(message.exists()).toBeFalsy();
        });
      });
    });

    describe('error message', () => {
      describe('There is an error', () => {
        it('Show error message section', async () => {
          wrapper.setData({ error: 'ERROR' });
          await wrapper.vm.$forceUpdate();
          const error = wrapper.find('#error');
          expect(error.exists()).toBeTruthy();
        });
      });

      describe('There are no errors', () => {
        it('Do not show error message section', async () => {
          wrapper.setData({ error: null });
          await wrapper.vm.$forceUpdate();
          const error = wrapper.find('#error');
          expect(error.exists()).toBeFalsy();
        });
      });
    });
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

  describe('methods', () => {
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

        await wrapper.vm.searchRepo('');

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

        await wrapper.vm.searchRepo('');

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

        await wrapper.vm.searchRepo('');

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

        await wrapper.vm.searchRepo('');

        expect(wrapper.vm.$data.totalCount).toEqual(30);
        expect(wrapper.vm.$data.linkStr).toEqual('');
        expect(wrapper.vm.$data.urls).toEqual({});
      });

      it('Set error message when error occurred', async () => {
        axios.get.mockImplementation(() => Promise.reject('ERROR MESSAGE'));

        await wrapper.vm.searchRepo('');

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
});
