
import { stub, assert, match } from 'sinon';
import { mockComponents, mockMathInput } from '../../../__test__/utils';
import React from 'react';
import debug from 'debug';
import MockChange from '../../image/__test__/mock-change';
import { Data } from 'slate';

const log = debug('editable-html:test:math');

mockMathInput();

describe('MathPlugin', () => {

  let mod, MathPlugin, compMock;

  beforeEach(() => {
    compMock = jest.fn(() => {
      return <div>mock</div>
    });
    jest.doMock('../component', () => compMock);
    mod = require('../index');
    MathPlugin = mod.default;
  });

  describe('toolbar', () => {
    describe('onClick', () => {

      let plugin, mockChange, value, onChange;
      beforeEach(() => {
        plugin = MathPlugin({});
        mockChange = new MockChange();
        value = {
          change: jest.fn(() => mockChange)
        }
        onChange = jest.fn();
        plugin.toolbar.onClick(value, onChange);

      });

      test('calls insertInline', () => {
        assert.calledWith(mockChange.insertInline, match(d => {
          log('d: ', d);
          log('d: ', mod);
          return d.data.equals(mod.inlineMath().data);
        }, 'node equals..'));
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
        innerHTML: 'latex'
      }
      const next = jest.fn();

      const out = mod.serialization.deserialize(el, next);
      expect(out).toEqual({
        kind: 'inline',
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
      }
      const children = [];

      const out = mod.serialization.serialize(object, children);
      expect(out).toEqual(<span data-mathjax="">latex</span>);
    });
  })

});