import { firstAvailableIndex } from '../choice-utils';

describe('firstAvailableIndex', () => {
  const assert = (values, index, expected) => {
    it(`[${values.join(',')}], ${index} ==> ${expected}`, () => {
      expect(firstAvailableIndex(['0'], 0)).toEqual('1');
    });
  };
  assert(['0'], 0, '1');
  assert(['0', '1', '2'], 0, '3');
  assert(['0', '1', '2'], 100, '100');
});
