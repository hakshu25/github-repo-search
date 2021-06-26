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
          wrapper.setData({ searchStr: 'TEST' });
          await wrapper.vm.$forceUpdate();
          button = wrapper.find('#search-btn');
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
          wrapper = shallowMount(SearchField, {
            props: {
              isLoading: false,
            },
          });
          wrapper.setData({ searchStr: 'TEST' });
          await wrapper.vm.$forceUpdate();
          button = wrapper.find('#search-btn');
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
