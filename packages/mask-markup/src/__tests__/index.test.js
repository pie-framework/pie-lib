import { componentize } from '../index';

describe('index', () => {
  describe('componentize', () => {
    it('', () => {
      const result = componentize('{{0}} foo {{1}}', 'dropdown');

      expect(result).toEqual(
        '<span data-component="dropdown" data-id="0"></span> foo <span data-component="dropdown" data-id="1"></span>'
      );
    });
  });
});
