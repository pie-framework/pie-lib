import React from 'react';
import { shallow } from 'enzyme';
import { render } from 'react-dom';
import { Data, Text } from 'slate';
import { ToolbarIcon } from '../icons';
import RespAreaToolbar, { serialization } from '../index';

jest.useFakeTimers();

let mockCloneFragment, mockFindDOMNode, mockGetEventTransfer;

jest.mock('slate-react', () => {
  mockCloneFragment = jest.fn();
  mockFindDOMNode = jest.fn().mockReturnValue({
    getBoundingClientRect: jest.fn().mockReturnValue({
      height: 200,
      top: 500
    }),
    closest: jest.fn().mockReturnValue({
      getBoundingClientRect: jest.fn().mockReturnValue({
        top: 100
      })
    })
  });
  mockGetEventTransfer = jest.fn();

  return {
    cloneFragment: mockCloneFragment,
    findDOMNode: mockFindDOMNode,
    getEventTransfer: mockGetEventTransfer
  };
});

describe('response-area', () => {
  const respArea = RespAreaToolbar({ type: 'explicit-constructed-response', options: {} });

  describe('name', () => {
    it('should have the name', () => {
      expect(respArea.name).toEqual('response_area');
    });
  });
  describe('filterPlugins', () => {
    it('should return an appropriate value for a node type', () => {
      expect(respArea.filterPlugins({ type: 'explicit_constructed_response' })).toEqual([]);
      expect(
        respArea.filterPlugins({ type: 'drag_in_the_blank' }, [
          { name: 'image' },
          { name: 'response_area' }
        ])
      ).toEqual([{ name: 'image' }]);
    });
  });
  describe('pluginStyles', () => {
    let document = jest.spyOn(window, 'getComputedStyle');

    it('should not return anything if the plugin is not math', () => {
      document.mockReturnValue({ width: '500px' });
      expect(respArea.pluginStyles({}, { name: 'inline_dropdown' })).toEqual(undefined);
      expect(respArea.pluginStyles({ key: '0' }, { name: 'math' })).toMatchObject({
        position: 'absolute',
        top: '600px',
        width: '500px'
      });
    });
  });
  describe('stopReset', () => {
    it('should return true', () => {
      expect(respArea.stopReset()).toEqual(true);
    });
  });
  describe('renderNode', () => {
    let attributes = { key: '0' },
      n,
      node;
    beforeEach(() => {
      n = { key: '0' };
      node = { key: '0' };
    });

    describe('item_builder', () => {
      it('should render an item_builder', () => {
        const el = respArea.renderNode({
          attributes,
          n,
          node: { key: '0', type: 'item_builder' }
        });
        const wrapper = shallow(el);
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('response_menu_item', () => {
      it('should render children', () => {
        const el = respArea.renderNode({
          children: <div>A</div>,
          node: { key: '0', type: 'response_menu_item' }
        });
        const wrapper = shallow(el);
        expect(wrapper).toMatchSnapshot();
      });
    });
    describe('menu_item', () => {
      it('should render an menu_item', () => {
        const el = respArea.renderNode({
          attributes,
          n,
          node: {
            key: '0',
            type: 'menu_item',
            data: Data.create({})
          }
        });
        const wrapper = shallow(el);
        expect(wrapper).toMatchSnapshot();
      });
    });
    describe('explicit_constructed_response', () => {
      it('should render an explicit_constructed_response', () => {
        const el = respArea.renderNode({
          attributes,
          n,
          node: {
            key: '0',
            type: 'explicit_constructed_response',
            data: Data.create({})
          }
        });
        const wrapper = shallow(el);
        expect(wrapper).toMatchSnapshot();
      });
    });
    describe('drag_in_the_blank', () => {
      it('should render an drag_in_the_blank', () => {
        const el = respArea.renderNode({
          attributes,
          n,
          node: {
            key: '0',
            type: 'drag_in_the_blank',
            data: Data.create({})
          }
        });
        const wrapper = shallow(el);
        expect(wrapper).toMatchSnapshot();
      });
    });
    describe('inline_dropdown', () => {
      it('should render an inline_dropdown', () => {
        const el = respArea.renderNode({
          attributes,
          n,
          children: [],
          node: {
            key: '0',
            type: 'inline_dropdown',
            data: Data.create({})
          }
        });
        const wrapper = shallow(el);
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
  describe('normalizeNode', () => {
    it('should return undefined when node is not of correct type', () => {
      expect(
        respArea.normalizeNode({
          type: 'foo'
        })
      ).toEqual(undefined);
    });
    it('should return undefined when node is normalized already', () => {
      const val = respArea.normalizeNode({
        type: 'inline_dropdown',
        data: Data.create({}),
        findDescendant: jest.fn().mockReturnValue({
          getText: jest.fn().mockReturnValue('')
        })
      });
      expect(val).toEqual(undefined);
    });
  });
});
describe('serialization', () => {
  describe('deserialize', () => {
    let next;

    beforeEach(() => {
      next = jest.fn().mockReturnValue([]);
    });

    describe('inline_dropdown', () => {
      let el;
      let out;
      beforeEach(() => {
        el = {
          childNodes: [],
          dataset: {
            correctId: '0',
            type: 'inline_dropdown',
            inTable: true
          }
        };
      });
      it('returns a inline_dropdown element with 2 default options if no menu items', () => {
        const createDefText = index => `Default Option ${index}`;

        out = serialization.deserialize(el, next);

        expect(out).toMatchObject({
          object: 'inline',
          type: 'inline_dropdown',
          data: {
            selected: 0,
            inTable: true
          },
          nodes: [
            {
              object: 'inline',
              type: 'menu_item',
              data: {
                id: 1,
                value: createDefText('1'),
                isDefault: true
              }
            },
            {
              object: 'inline',
              type: 'menu_item',
              data: {
                id: 2,
                value: createDefText('2'),
                isDefault: true
              }
            }
          ]
        });
      });

      it('returns a inline_dropdown element with 1 default option if it has 1 menu item', () => {
        const createDefText = index => `Default Option ${index}`;

        next = jest.fn(arr => arr);

        el.childNodes = [
          {
            object: 'inline',
            type: 'menu_item',
            data: {
              id: 1,
              value: 'Foo Bar'
            }
          }
        ];
        out = serialization.deserialize(el, next);

        expect(out).toMatchObject({
          object: 'inline',
          type: 'inline_dropdown',
          data: {
            selected: 0,
            inTable: true
          },
          nodes: [
            {
              object: 'inline',
              type: 'menu_item',
              data: {
                id: 1,
                value: 'Foo Bar'
              }
            },
            {
              object: 'inline',
              type: 'menu_item',
              data: {
                id: 2,
                value: createDefText('2'),
                isDefault: true
              }
            }
          ]
        });
      });

      it('returns a inline_dropdown element with the computed nodes if at least 2 menu items', () => {
        next = jest.fn(arr => arr);

        el.childNodes = [
          {
            object: 'inline',
            type: 'menu_item',
            data: {
              id: 1,
              value: 'Foo Bar'
            }
          },
          {
            object: 'inline',
            type: 'menu_item',
            data: {
              id: 2,
              value: 'Bar Foo'
            }
          }
        ];
        out = serialization.deserialize(el, next);

        expect(out).toMatchObject({
          object: 'inline',
          type: 'inline_dropdown',
          data: {
            selected: 0,
            inTable: true
          },
          nodes: [
            {
              object: 'inline',
              type: 'menu_item',
              data: {
                id: 1,
                value: 'Foo Bar'
              }
            },
            {
              object: 'inline',
              type: 'menu_item',
              data: {
                id: 2,
                value: 'Bar Foo'
              }
            }
          ]
        });
      });
    });

    describe('menu_item', () => {
      let el;
      let out;

      beforeEach(() => {
        el = {
          childNodes: [],
          dataset: {
            id: '0',
            type: 'menu_item',
            inTable: true
          }
        };
      });

      it('should return a menu_item', () => {
        el.textContent = 'Foo Bar';
        next = jest.fn(arr => arr);
        out = serialization.deserialize(el, next);
        expect(out).toMatchObject({
          object: 'inline',
          type: 'menu_item',
          data: {
            id: '0',
            value: 'Foo Bar'
          }
        });
      });

      it('should return a menu_item with isDefault set to true', () => {
        el.textContent = 'Foo Bar';
        el.dataset.isDefault = true;
        next = jest.fn(arr => arr);
        out = serialization.deserialize(el, next);

        expect(out).toMatchObject({
          object: 'inline',
          type: 'menu_item',
          data: {
            id: '0',
            value: 'Foo Bar',
            isDefault: true
          }
        });
      });
    });

    describe('explicit_constructed_response', () => {
      let el;
      let out;

      beforeEach(() => {
        el = {
          childNodes: [],
          dataset: {
            type: 'explicit_constructed_response'
          }
        };
      });

      it('should return a explicit_constructed_response', () => {
        next = jest.fn(arr => arr);
        out = serialization.deserialize(el, next);
        expect(out).toMatchObject({
          object: 'inline',
          type: 'explicit_constructed_response',
          data: {
            inTable: undefined
          }
        });
      });

      it('should return a explicit_constructed_response with isDefault set to true', () => {
        el.dataset.inTable = true;
        next = jest.fn(arr => arr);
        out = serialization.deserialize(el, next);

        expect(out).toMatchObject({
          object: 'inline',
          type: 'explicit_constructed_response',
          data: {
            inTable: true
          }
        });
      });
    });

    describe('drag_in_the_blank', () => {
      let el;
      let out;

      beforeEach(() => {
        el = {
          childNodes: [],
          dataset: {
            type: 'drag_in_the_blank'
          }
        };
      });

      it('should return a drag_in_the_blank', () => {
        el.dataset = {
          ...el.dataset,
          index: 0,
          id: '0',
          value: 'Foo Bar',
          inTable: true
        };
        next = jest.fn(arr => arr);
        out = serialization.deserialize(el, next);
        expect(out).toMatchObject({
          object: 'inline',
          type: 'drag_in_the_blank',
          data: {
            index: 0,
            id: '0',
            value: 'Foo Bar',
            inTable: true
          }
        });
      });
    });
  });

  describe('serialize', () => {
    it('should return a inline_dropdown', () => {
      const el = serialization.serialize(
        {
          object: 'inline',
          type: 'inline_dropdown',
          nodes: [],
          data: Data.create({
            selected: '0',
            inTable: true
          })
        },
        'A'
      );
      expect(el).toEqual(
        <span data-type="inline_dropdown" data-correct-id="0" data-in-table={true}>
          A
        </span>
      );
    });
    it('should return a explicit_constructed_response', () => {
      const el = serialization.serialize(
        {
          object: 'inline',
          type: 'explicit_constructed_response',
          nodes: [],
          data: Data.create({
            inTable: true
          })
        },
        'A'
      );
      expect(el).toEqual(
        <span data-type="explicit_constructed_response" data-in-table={true}>
          A
        </span>
      );
    });

    it('should return a drag_in_the_blank', () => {
      const el = serialization.serialize(
        {
          object: 'inline',
          type: 'drag_in_the_blank',
          nodes: [],
          data: Data.create({
            index: 0,
            id: '0',
            value: 'Foo Bar',
            inTable: true
          })
        },
        'A'
      );

      expect(el).toEqual(
        <span
          data-type="drag_in_the_blank"
          data-index={0}
          data-id="0"
          data-value="Foo Bar"
          data-in-table={true}
        />
      );
    });

    it('should return null', () => {
      const el = serialization.serialize({ object: 'inline', type: 'item_builder' });

      expect(el).toEqual(null);
    });

    it('should return null', () => {
      const el = serialization.serialize({ object: 'inline', type: 'response_menu_item' });

      expect(el).toEqual(null);
    });
    it('should return a menu_item', () => {
      const el = serialization.serialize(
        {
          object: 'inline',
          type: 'menu_item',
          nodes: [],
          data: Data.create({
            id: '0',
            isDefault: true
          })
        },
        'A'
      );
      expect(el).toEqual(
        <span data-type="menu_item" data-id="0" data-is-default={true}>
          A
        </span>
      );
    });
  });
});
