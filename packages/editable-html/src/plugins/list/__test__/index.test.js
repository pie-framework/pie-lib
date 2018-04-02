import React from "react";

import {configure, shallow} from "enzyme";
import Adapter from "enzyme-adapter-react-15";
import renderer from 'react-test-renderer';
import List, {serialization} from '../index';
import Util from '../../utils';

configure({adapter : new Adapter() });

describe("ListPlugin", () => {

  describe("deserialize", () => {

    const assertDeserialize = (tagName, expectedType) => {
      it(`should deserialize ${tagName} to ${expectedType}`, () => {
        const out = serialization.deserialize({tagName}, jest.fn());
        expect(out).toMatchObject({object : 'block', type : expectedType});
      });
    }
    assertDeserialize('ul', 'ul_list');
    assertDeserialize('ol', 'ol_list');
    assertDeserialize('li', 'list_item');
  });  

  describe("serialize", () => {

    const assertSerialize = (type, expectedType) => {
      it(`should serialize ${type} to ${expectedType}`, () => {
        const out = serialization.serialize({block : 'block', type: type}, {});
        expect(out.type).toMatch(expectedType);
      });      
    }
    assertSerialize('ul_list', 'ul');
    assertSerialize('ol_list', 'ol');
    assertSerialize('list_item', 'li');
  });  
  
  describe("renderNode", () => {
    let plugin = List({});

    const assertRenderNode = (type, expectedType) => {
      it(`should renderNode ${type} to ${expectedType}`, () => {
        const out = plugin.renderNode({node: {type}});
        expect(out.type).toMatch(expectedType);
      });
    }

    assertRenderNode('ul_list', 'ul');
    assertRenderNode('ol_list', 'ol');
    assertRenderNode('list_item', 'li');
  });
  
});