import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import SearchResultList from '@/components/SearchResultList.vue';

describe('SearchResultList.vue', () => {
  let wrapper;

  describe('template logic', () => {
    describe('more results button', () => {
      const result = {
        owner: {},
        html_url: '',
        full_name: '',
        description: '',
      };

      describe('click button', () => {
        beforeEach(() => {
          wrapper = shallowMount(SearchResultList, {
            propsData: {
              results: [result],
              totalCount: 2,
              isLoading: false,
            },
          });
        });

        it('Emit event', () => {
          wrapper.find('#more-results-btn').trigger('click');
          const events = wrapper.emitted('show-more');

          expect(events.length).toBe(1);
          expect(events[0]).toEqual([]);
        });
      });

      describe('loading', () => {
        describe('If isLoading is true', () => {
          let button;

          beforeEach(() => {
            wrapper = shallowMount(SearchResultList, {
              propsData: {
                results: [result],
                totalCount: 2,
                isLoading: true,
              },
            });
            button = wrapper.find('#more-results-btn');
          });

          it('there is class is-loading of button', () => {
            expect(button.classes()).toContain('is-loading');
          });

          it('disable button', () => {
            expect(button.attributes().disabled).toBe('disabled');
          });
        });

        describe('If isLoading is false', () => {
          let button;

          beforeEach(async () => {
            wrapper = shallowMount(SearchResultList, {
              propsData: {
                results: [result],
                totalCount: 2,
                isLoading: false,
              },
            });
            button = wrapper.find('#more-results-btn');
          });

          it('there is not class is-loading of button', () => {
            expect(button.classes()).not.toContain('is-loading');
          });

          it('enable button', () => {
            expect(button.attributes().disabled).toBeUndefined();
          });
        });
      });
    });

    describe('not found message', () => {
      describe('There are no results', () => {
        beforeEach(() => {
          wrapper = shallowMount(SearchResultList, {
            propsData: {
              results: [],
              isNotFound: true,
            },
          });
        });

        it('Show message', () => {
          expect(wrapper.find('#not-found').exists()).toBeTruthy();
        });
      });

      describe('There are results', () => {
        beforeEach(() => {
          wrapper = shallowMount(SearchResultList, {
            propsData: {
              results: [],
              isNotFound: false,
            },
          });
        });

        it('Do not show message', () => {
          expect(wrapper.find('#not-found').exists()).toBeFalsy();
        });
      });
    });

    describe('error message', () => {
      describe('There is an error', () => {
        beforeEach(() => {
          wrapper = shallowMount(SearchResultList, {
            propsData: {
              results: [],
              error: 'ERROR',
            },
          });
        });

        it('Show error message section', () => {
          expect(wrapper.find('#error').exists()).toBeTruthy();
        });
      });

      describe('There are no errors', () => {
        beforeEach(() => {
          wrapper = shallowMount(SearchResultList, {
            propsData: {
              results: [],
              error: null,
            },
          });
        });

        it('Do not show error message section', () => {
          expect(wrapper.find('#error').exists()).toBeFalsy();
        });
      });
    });
  });

  describe('computed', () => {
    describe('isResultsMore()', () => {
      const result = {
        owner: {},
        html_url: '',
        full_name: '',
        description: '',
      };

      it('Return true if totalCount > results.length', () => {
        wrapper = shallowMount(SearchResultList, {
          propsData: {
            results: [result, result],
            totalCount: 3,
          },
        });

        expect(wrapper.vm.isResultsMore).toBeTruthy();
      });

      it('Return false if totalCount === results.length', () => {
        wrapper = shallowMount(SearchResultList, {
          propsData: {
            results: [result, result],
            totalCount: 2,
          },
        });

        expect(wrapper.vm.isResultsMore).toBeFalsy();
      });

      it('Return false if totalCount < results.length', () => {
        wrapper = shallowMount(SearchResultList, {
          propsData: {
            results: [result, result],
            totalCount: 1,
          },
        });

        expect(wrapper.vm.isResultsMore).toBeFalsy();
      });
    });
  });
});
