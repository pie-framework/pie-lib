import React from "react";

import {configure} from "enzyme";
import Adapter from "enzyme-adapter-react-15";
import renderer from 'react-test-renderer';
import List from './../../list/index';
import Util from '../../utils';

configure({adapter : new Adapter() });

describe("ListPlugin", () => {
  let list, ListPlugin, toolbar;
  beforeEach(() => {
    list = require('../index');
    ListPlugin = list.default;
    toolbar = list.toolbar
  });

  describe("deserialize", () => {
    it("should deserialize list item", () => {
      let el = {
        tagName : 'li',
        childNodes : []
      }
      const next = jest.fn();
      const out = list.serialization.deserialize(el, next);

      expect(out).toMatchObject({object : 'block', type : 'list_item', nodes: undefined});
    });

    it("should deserialize ul", () => {
      let el = {
        tagName : 'ul',
        childNodes : []
      }
      const next = jest.fn();
      const out = list.serialization.deserialize(el, next);

      expect(out).toMatchObject({object : 'block', type : 'ul_list', nodes: undefined});
    });    

    it("should deserialize ol", () => {
      let el = {
        tagName : 'ol',
        childNodes : []
      }
      const next = jest.fn();
      const out = list.serialization.deserialize(el, next);

      expect(out).toMatchObject({object : 'block', type : 'ol_list', nodes: undefined});
    });        
  });

  describe("serialize", () => {
    it("should serialize list item", () => {
      let el = {
        block : 'block',
        type : 'list_item'
        
      }
      const out = list.serialization.serialize(el, {
        type:'div',
        text : 'hello'
      });

      expect(out.type).toMatch('li');
    });    

    it("should serialize ul", () => {
      let el = {
        block : 'block',
        type : 'ul_list'
        
      }
      const out = list.serialization.serialize(el, {
        type:'div',
        text : 'hello'
      });

      expect(out.type).toMatch('ul');
    });    
    
    it("should serialize ol", () => {
      let el = {
        block : 'block',
        type : 'ol_list'
        
      }
      const out = list.serialization.serialize(el, {
        type:'div',
        text : 'hello'
      });

      expect(out.type).toMatch('ol');
    });        
  });
  describe("renderNode", () => {
    it("should render list item node", () => {
      let obj = {
        node : {
          type : 'list_item'
        },
        attributes : {},
        children : 'icon'
      }

      let plugin = ListPlugin({});
      const out = plugin.renderNode(obj);
      expect(out.type).toMatch('li');
    });

    it("should render ul node", () => {
      let obj = {
        node : {
          type : 'ul_list'
        },
        attributes : {},
        children : 'icon'
      }

      let plugin = ListPlugin({});
      const out = plugin.renderNode(obj);
      expect(out.type).toMatch('ul');
    });
    
    it("should render list item node", () => {
      let obj = {
        node : {
          type : 'ol_list'
        },
        attributes : {},
        children : 'icon'
      }

      let plugin = ListPlugin({});
      const out = plugin.renderNode(obj);
      expect(out.type).toMatch('ol');
    });    
  });  

  describe("toolbar", () => {
    describe('onClick toolbar ul', () => {
     
     it("should onClick ul", () => {
      
      let plugin = ListPlugin({});

     })
    });
  });  
  
});