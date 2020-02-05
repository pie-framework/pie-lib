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
    const assertKeysForGrade = (key, expected) => {
      it(`if n = ${key}`, () => {
        const result = keysForGrade(key);

        expect(result).toEqual(expected);
      });
    };

    assertKeysForGrade(1, undefined);
    assertKeysForGrade('1', undefined);

    assertKeysForGrade(2, undefined);
    assertKeysForGrade('2', undefined);

    assertKeysForGrade(3, gradeSets[0].set);
    assertKeysForGrade('3', gradeSets[0].set);

    assertKeysForGrade(4, gradeSets[0].set);
    assertKeysForGrade('4', gradeSets[0].set);

    assertKeysForGrade(5, gradeSets[0].set);
    assertKeysForGrade('5', gradeSets[0].set);

    assertKeysForGrade(6, gradeSets[1].set);
    assertKeysForGrade('6', gradeSets[1].set);

    assertKeysForGrade(7, gradeSets[1].set);
    assertKeysForGrade('7', gradeSets[1].set);

    assertKeysForGrade(8, gradeSets[2].set);
    assertKeysForGrade('8', gradeSets[2].set);

    assertKeysForGrade(9, gradeSets[2].set);
    assertKeysForGrade('9', gradeSets[2].set);

    assertKeysForGrade('HS', gradeSets[2].set);

    assertKeysForGrade('geometry', gradeSets[3].set);

    assertKeysForGrade('everything', gradeSets[4].set);

    assertKeysForGrade('advanced-algebra', gradeSets[5].set);

    assertKeysForGrade('statistics', gradeSets[6].set);

    // exceptions
    assertKeysForGrade('something else', undefined);

    assertKeysForGrade(undefined, []);

    assertKeysForGrade(null, []);

    assertKeysForGrade(0, []);
    assertKeysForGrade('0', undefined);
  });
});
