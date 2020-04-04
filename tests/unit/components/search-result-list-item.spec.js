import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import SearchResultListItem from '@/components/SearchResultListItem.vue';

describe('SearchResultListItem.vue', () => {
  let wrapper;

  describe('Display result', () => {
    describe('There is a result', () => {
      beforeEach(() => {
        wrapper = shallowMount(SearchResultListItem, {
          propsData: {
            result: {
              owner: {
                avatar_url: 'avatar',
              },
              html_url: 'html_url',
              full_name: 'sample/repo',
              description: 'desc',
            },
          },
        });
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
  });
});
