import React from 'react';
import debug from 'debug';
import MockChange from '../../image/__tests__/mock-change';
import { Data } from 'slate';
import MathPlugin, { serialization, inlineMath } from '../index';

const log = debug('editable-html:test:math');

jest.mock('@pie-lib/math-input', () => ({
  removeBrackets: jest.fn(n => n),
  addBrackets: jest.fn(n => n)
}));

jest.mock('../math-preview', () => () => <div> math preview</div>);
jest.mock('../math-toolbar', () => () => ({
  MathToolbar: () => <div>MathToolbar</div>
}));

describe('MathPlugin', () => {
  describe('toolbar', () => {
    describe('onClick', () => {
      let plugin, mockChange, value, onChange;
      beforeEach(() => {
        plugin = MathPlugin({});
        mockChange = new MockChange();
        value = {
          change: jest.fn(() => mockChange)
        };
        onChange = jest.fn();
        plugin.toolbar.onClick(value, onChange);
      });

      test('calls insertInline', () => {
        expect(mockChange.insertInline).toBeCalledWith(
          expect.objectContaining({ data: inlineMath().data })
        );
      });

      test('it calls onChange', () => {
        expect(onChange).toHaveBeenCalledWith(mockChange);
      });
    });
  });

  describe('renderNode', () => {
    test('the component has props', () => {
      const plugin = MathPlugin({});
      const { props } = plugin.renderNode({ node: { type: 'math' } });
      expect(props.node).toEqual({ type: 'math' });
    });
  });

  describe('serialization', () => {
    test('deserializes', () => {
      const el = {
        tagName: 'span',
        getAttribute: jest.fn(() => ''),
        hasAttribute: jest.fn(() => true),
        innerHTML: 'latex'
      };
      const next = jest.fn();

      const out = serialization.deserialize(el, next);
      expect(out).toEqual({
        object: 'inline',
        type: 'math',
        isVoid: true,
        nodes: [],
        data: {
          latex: 'latex'
        }
      });
    });

    test('serialization', () => {
      const object = {
        kind: 'inline',
        type: 'math',
        isVoid: true,
        nodes: [],
        data: Data.create({
          latex: 'latex'
        })
      };
      const children = [];

      const out = serialization.serialize(object, children);
      expect(out).toEqual(<span data-latex="">latex</span>);
    });
  });
});
