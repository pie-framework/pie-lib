import areValuesEqual, { latexEqual } from '../index';
import _ from 'lodash';
import me from 'math-expressions';

import data, { fullExpressions } from './data';

describe('math-evaluator', () => {
  const mkAssertion = (root, opts) => expected => value => {
    opts = opts || {};
    it(`${expected ? '===' : '!=='} ${value}`, () => {
      expect(areValuesEqual(root, value, opts)).toEqual(expected);
    });
  };

  const assert = isEqual => label =>
    function() {
      const args = Array.from(arguments);
      const pairs = _.chunk(args, 2);

      describe(label, () => {
        pairs.forEach(([a, b]) => {
          it(`${a} === ${b} ? ${isEqual}`, () => {
            expect(areValuesEqual(a, b)).toBe(isEqual);
          });
        });
      });
    };

  const assertEqual = assert(true);
  const assertNotEqual = assert(false);

  const getEqualsObj = o => {
    if (Array.isArray(o)) {
      return { equals: o, notEquals: [] };
    } else {
      return { equals: o.eq, notEquals: o.neq };
    }
  };

  describe('default', () => {
    Object.keys(data).forEach(k => {
      describe(k, () => {
        const { allowDecimals, ...rest } = data[k];
        Object.keys(rest).forEach(dk => {
          describe(dk, () => {
            const assert = mkAssertion(dk, { allowDecimals });
            const { equals, notEquals } = getEqualsObj(data[k][dk]);
            // const equals = data[k][dk].eq;
            // const notEquals = data[k][dk].neq;

            (equals || []).forEach(e => {
              assert(true)(e);
            });
            (notEquals || []).forEach(e => {
              assert(false)(e);
            });
          });
        });
      });
    });
  });

  describe('latexEqual', () => {
    const mkLatexAssertion = (root, opts) => expected => value => {
      opts = opts || {};
      it(`${expected ? '===' : '!=='} ${value}`, () => {
        expect(latexEqual(root, value, opts)).toEqual(expected);
      });
    };

    const allData = { ...data, ...fullExpressions };
    Object.keys({ ...data, ...fullExpressions }).forEach(k => {
      describe(k, () => {
        const all = allData[k];
        const { allowDecimals, isLatex, ...rest } = all;
        Object.keys(rest).forEach(dk => {
          describe(dk, () => {
            const dkLatex = isLatex ? dk : me.fromText(dk).toLatex();
            const assert = mkLatexAssertion(dkLatex, { allowDecimals });
            const { equals, notEquals } = getEqualsObj(allData[k][dk]);

            (equals || []).forEach(e => {
              const l = isLatex ? e : me.fromText(e).toLatex();
              assert(true)(l);
            });
            (notEquals || []).forEach(e => {
              const l = isLatex ? e : me.fromText(e).toLatex();
              assert(false)(l);
            });
          });
        });
      });
    });
  });
});
