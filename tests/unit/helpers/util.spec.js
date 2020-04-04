import { parseLinks } from '../../../src/helpers/util';

describe('util', () => {
  describe('parseLinks()', () => {
    it('Parse link into object property according to rel', () => {
      const linkStr =
        '<http://example.com?page=2>; rel="next", <http://example.com?page=3>; rel="last"';
      const expected = {
        next: 'http://example.com?page=2',
        last: 'http://example.com?page=3',
      };

      const actual = parseLinks(linkStr);

      expect(actual).toEqual(expected);
    });
  });
});
