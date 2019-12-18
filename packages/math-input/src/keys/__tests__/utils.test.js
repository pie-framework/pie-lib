import { extendKeySet } from '../utils';
import { keysForGrade } from '../grades';
import * as comparison from '../../keys/comparison';
describe('utils', () => {
  const base = [[comparison.lessThan]];
  describe('extendKeySet', () => {
    it('removes duplicates by latex key', () => {
      const extras = [{ name: 'foo', latex: '<', write: '<', label: 'less than' }];
      const result = extendKeySet(base, extras);
      const resultTwo = extendKeySet(base, []);
      expect(result).toEqual(resultTwo);
    });

    it('removes duplicates by name key', () => {
      const extras = [{ name: 'Less than', latex: 'this is latex', write: '<', label: '<' }];
      const result = extendKeySet(base, extras);
      const resultTwo = extendKeySet(base, []);
      expect(result).toEqual(resultTwo);
    });
  });
});
