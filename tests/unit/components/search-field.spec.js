import { shallowMount } from '@vue/test-utils';
import SearchField from '@/components/SearchField.vue';

describe('SearchField.vue', () => {
  let wrapper;

  describe('loading', () => {
    describe('search button', () => {
      describe('If isLoading is true', () => {
        let button;

        beforeEach(async () => {
          wrapper = shallowMount(SearchField, {
            props: {
              isLoading: true,
            },
          });
          await wrapper.setData({ searchStr: 'TEST' });
          await wrapper.vm.$forceUpdate();
          button = wrapper.find('#search-btn');
        });

        it('disable button', () => {
          expect(button.attributes().disabled).toBeDefined();
        });
      });

      describe('If isLoading is false', () => {
        let button;

        beforeEach(async () => {
          wrapper = shallowMount(SearchField, {
            props: {
              isLoading: false,
            },
          });
          await wrapper.setData({ searchStr: 'TEST' });
          await wrapper.vm.$forceUpdate();
          button = wrapper.find('#search-btn');
        });

        it('enable button', () => {
          expect(button.attributes().disabled).toBeUndefined();
        });
      });
    });
  });

  describe('search button', () => {
    beforeEach(async () => {
      wrapper = shallowMount(SearchField, {
        props: {
          isLoading: false,
        },
      });
      wrapper.setData({ searchStr: 'aaa' });
      await wrapper.vm.$forceUpdate();
    });

    it('Emit event if click button', () => {
      const button = wrapper.find('#search-btn');

      button.trigger('click');
      const events = wrapper.emitted('search-repo');

      expect(events.length).toBe(1);
      expect(events[0]).toEqual(['aaa']);
    });
  });
});
