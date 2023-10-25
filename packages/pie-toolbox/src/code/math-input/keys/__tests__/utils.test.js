import { extendKeySet } from '../utils';
import { keysForGrade, gradeSets } from '../grades';
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

  describe('keysForGrade', () => {
    it.each`
      key                        | expected
      ${'1'}                     | ${undefined}
      ${'2'}                     | ${undefined}
      ${'3'}                     | ${gradeSets[0].set}
      ${'4'}                     | ${gradeSets[0].set}
      ${'5'}                     | ${gradeSets[0].set}
      ${'6'}                     | ${gradeSets[1].set}
      ${'7'}                     | ${gradeSets[1].set}
      ${'8'}                     | ${gradeSets[2].set}
      ${'9'}                     | ${gradeSets[2].set}
      ${'HS'}                    | ${gradeSets[2].set}
      ${'non-negative-integers'} | ${gradeSets[3].set}
      ${'integers'}              | ${gradeSets[4].set}
      ${'decimals'}              | ${gradeSets[5].set}
      ${'fractions'}             | ${gradeSets[6].set}
      ${'geometry'}              | ${gradeSets[7].set}
      ${'advanced-algebra'}      | ${gradeSets[8].set}
      ${'statistics'}            | ${gradeSets[9].set}
      ${'something else'}        | ${undefined}
      ${undefined}               | ${[]}
      ${null}                    | ${[]}
      ${0}                       | ${[]}
      ${'0'}                     | ${[]}
    `('$key => $expected', ({ key, expected }) => {
      expect(keysForGrade(key)).toEqual(expected);

      const n = parseInt(key, 10);
      if (!isNaN(n)) {
        expect(keysForGrade(n)).toEqual(expected);
      }
    });
  });
});
