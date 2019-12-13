import React from 'react';
import debug from 'debug';
import MockChange from '../../image/__tests__/mock-change';
import { Data } from 'slate';
import MathPlugin, { serialization, inlineMath, CustomToolbarComp } from '../index';
import { shallow } from 'enzyme';
import { MathToolbar } from '@pie-lib/math-toolbar';
jest.mock('@pie-framework/mathquill', () => ({
  StaticMath: jest.fn(),
  getInterface: jest.fn().mockReturnThis(),
  registerEmbed: jest.fn()
}));
jest.mock('@pie-lib/math-toolbar', () => ({
  MathPreview: () => <div />,
  MathToolbar: () => <div />
}));
const log = debug('@pie-lib:editable-html:test:math');

// I believe @andrei is moving this stuff out.
describe('MathPlugin', () => {
  describe('serialization', () => {
    describe('deserialize', () => {
      const assertDeserialize = html => {
        it(`innerHTML: ${html} is ???`, () => {
          const next = jest.fn();

          const parser = new DOMParser();
          const document = parser.parseFromString(html, 'text/html');

          console.log('doc:', document, document.body.innerHTML, document.body.firstChild.nodeName);
          const out = serialization.deserialize(document.body.firstChild, next);
          console.log('out:', out);
        });
      };

      assertDeserialize('<math><infinity/></math>');
    });

    describe('serialize', () => {
      const assertSerialize = mathml => {
        it(`${mathml} is serialized`, () => {
          const object = {
            kind: 'inline',
            type: 'mathml',
            isVoid: true,
            nodes: [],
            data: Data.create({ mathml })
          };

          const out = serialization.serialize(object);
          log('out: ', out);
          expect(out).toEqual(mathml);
        });
      };

      assertSerialize('<math><infinity/></math>');
    });
  });
});
