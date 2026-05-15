import { sortKeys } from '../keys-layout';

describe('keys-layout', () => {
  describe('sortKeys', () => {
    it('pads the rows', () => {
      const result = sortKeys([[1, 2, 3]]);
      expect(result).toEqual([
        [1, undefined, undefined, undefined, undefined],
        [2, undefined, undefined, undefined, undefined],
        [3, undefined, undefined, undefined, undefined],
      ]);
    });
  });
});
