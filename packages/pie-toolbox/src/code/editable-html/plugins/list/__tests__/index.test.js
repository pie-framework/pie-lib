import React from 'react';

import List, { serialization } from '../index';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:test:plugins:list');

describe('ListPlugin', () => {
  let next;

  describe('deserialize', () => {
    next = jest.fn();

    const assertDeserialize = (tagName, expectedType) => {
      it(`should deserialize ${tagName} to ${expectedType}`, () => {
        const out = serialization.deserialize({ tagName, children: [], childNodes: [] }, next);

        expect(out).toMatchObject({ object: 'block', type: expectedType });
        expect(next).toHaveBeenCalledWith([]);
      });
    };
    assertDeserialize('ul', 'ul_list');
    assertDeserialize('ol', 'ol_list');
    assertDeserialize('li', 'list_item');
  });

  describe('serialize', () => {
    const assertSerialize = (type, expectedType) => {
      it(`should serialize ${type} to ${expectedType}`, () => {
        const out = serialization.serialize({ object: 'block', type }, {});
        log('out: ', out);
        expect(out.type).toMatch(expectedType);
      });
    };
    assertSerialize('ul_list', 'ul');
    assertSerialize('ol_list', 'ol');
    assertSerialize('list_item', 'li');
  });

  describe('renderNode', () => {
    let plugin = List({});

    const assertRenderNode = (type, expectedType) => {
      it(`should renderNode ${type} to ${expectedType}`, () => {
        const out = plugin.renderNode({ node: { type } });
        expect(out.type).toMatch(expectedType);
      });
    };

    assertRenderNode('ul_list', 'ul');
    assertRenderNode('ol_list', 'ol');
    assertRenderNode('list_item', 'li');
  });
});
