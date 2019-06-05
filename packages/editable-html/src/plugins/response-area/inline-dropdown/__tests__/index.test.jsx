import React from 'react';
import { Data } from 'slate';
import { shallow } from 'enzyme';
import MockChange, { MockDocument } from '../../__tests__/mock-change';
import InlineDropdown, { getSelectedItem, openOrClose } from '../index';
describe('inline-dropdown', () => {
  describe('snapshot', () => {
    let attributes = { key: '0' },
      n = { key: '0' },
      nodeProps = {
        children: [
          { props: { node: { type: 'menu_item' } } },
          { props: { node: { type: 'menu_item' } } },
          { props: { node: { type: 'menu_item' } } }
        ]
      };

    const mkWrapper = (Component, props) => {
      return shallow(<Component {...props} />);
    };

    it('renders correctly with default props', () => {
      const w = mkWrapper(InlineDropdown, {
        attributes,
        data: {},
        n,
        nodeProps
      });

      expect(w).toMatchSnapshot();
    });

    it('renders correctly with a selected item', () => {
      const w = mkWrapper(InlineDropdown, {
        attributes,
        data: {},
        n,
        nodeProps: {
          children: [...nodeProps.children, { props: { node: { type: 'response_menu_item' } } }]
        }
      });

      expect(w).toMatchSnapshot();
    });

    it('renders correctly when in a table', () => {
      const w = mkWrapper(InlineDropdown, {
        attributes,
        data: { inTable: true },
        n,
        nodeProps: {
          children: [...nodeProps.children, { props: { node: { type: 'response_menu_item' } } }]
        }
      });

      expect(w).toMatchSnapshot();
    });

    it('renders correctly when opened', () => {
      const w = mkWrapper(InlineDropdown, {
        attributes,
        data: { open: true },
        n,
        nodeProps: {
          children: [...nodeProps.children, { props: { node: { type: 'response_menu_item' } } }]
        }
      });

      expect(w).toMatchSnapshot();
    });
  });
  describe('handlers', () => {
    let nodeProps,
      e,
      data,
      n,
      closest = jest.fn().mockReturnValue({
        dataset: {
          nodeKey: '0'
        }
      }),
      document = new MockDocument(),
      preventDefault = jest.fn(),
      stopPropagation = jest.fn(),
      stopImmediatePropagation = jest.fn(),
      change,
      onChange;

    beforeEach(() => {
      e = {
        nativeEvent: { stopImmediatePropagation },
        preventDefault,
        stopPropagation,
        target: {
          closest,
          dataset: {
            key: '0'
          }
        }
      };

      n = { key: '0' };

      data = {};

      onChange = jest.fn();

      change = new MockChange();

      nodeProps = {
        children: 'A',
        editor: {
          onChange,
          value: {
            document,
            change: () => change
          }
        }
      };
    });
    describe('getSelectedItem', () => {
      it('should return null if no response_menu_item is found', () => {
        nodeProps = {
          children: [
            { props: { node: { type: 'menu_item' } } },
            { props: { node: { type: 'menu_item' } } },
            { props: { node: { type: 'menu_item' } } }
          ]
        };

        expect(getSelectedItem(nodeProps)).toEqual(null);
      });

      it('should return an element if one is found', () => {
        nodeProps = {
          children: [
            { props: { node: { type: 'menu_item' } } },
            { props: { node: { type: 'menu_item' } } },
            { props: { node: { type: 'menu_item' } } },
            { props: { node: { type: 'response_menu_item' } } }
          ]
        };

        expect(getSelectedItem(nodeProps)).toMatchObject({
          props: { node: { type: 'response_menu_item' } }
        });
      });
    });
    describe('openOrClose', () => {
      beforeEach(() => {
        const specialDocument = new MockDocument({
          docFindDescendant: jest.fn().mockReturnValue({
            data: Data.create({}),
            findDescendant: jest.fn().mockReturnValue({
              key: '1',
              getFirstText: jest.fn().mockReturnValue({
                key: '2'
              })
            })
          })
        });
        nodeProps = {
          editor: {
            onChange,
            value: {
              document: specialDocument,
              change: () => change
            }
          }
        };
      });

      it('should open', () => {
        openOrClose(nodeProps, n, true);

        expect(change.setNodeByKey).toBeCalledWith('0', { data: { open: true } });
        expect(change.moveFocusTo).toBeCalledWith('2', 0);
        expect(change.moveAnchorTo).toBeCalledWith('2', 0);
        expect(onChange).toBeCalled();
      });
      it('should close', () => {
        nodeProps.editor.value.document.getClosest = jest.fn().mockReturnValue({ key: '3' });
        nodeProps.editor.value.document.getNextText = jest.fn().mockReturnValue({ key: '4' });
        openOrClose(nodeProps, n, false);
        expect(change.setNodeByKey).toBeCalledWith('0', { data: { open: false } });
        expect(change.moveFocusTo).toBeCalledWith('4', 0);
        expect(change.moveAnchorTo).toBeCalledWith('4', 0);
        expect(onChange).toBeCalled();
      });
    });
  });
});
