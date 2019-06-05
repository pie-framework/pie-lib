import React from 'react';
import { shallow } from 'enzyme';
import MockChange, { MockDocument } from '../../__tests__/mock-change';
import MenuItem, { clickInterval, onMenuItemMouseDown, onRemoveItemMouseDown } from '../menu-item';

let mockInsertSnackBar;

jest.mock('../../utils', () => {
  mockInsertSnackBar = jest.fn();

  return {
    insertSnackBar: mockInsertSnackBar
  };
});

jest.useFakeTimers();

describe('menu-item', () => {
  let n = { key: '0' },
    nodeProps = { children: 'A' };

  const mkWrapper = (Component, props) => {
    return shallow(<Component {...props} />);
  };
  describe('snapshot', () => {
    it('renders correctly with default props', () => {
      const w = mkWrapper(MenuItem, {
        data: {},
        n,
        nodeProps
      });

      expect(w).toMatchSnapshot();
    });

    it('renders correctly when clicked', () => {
      const w = mkWrapper(MenuItem, {
        data: { clicked: true },
        n,
        nodeProps
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

    describe('onMenuItemMouseDown', () => {
      it('should handle a regular click', () => {
        onMenuItemMouseDown(e, { data, n, nodeProps });
        // Should cancel the default event
        expect(preventDefault).toBeCalled();
        expect(stopPropagation).toBeCalled();
        expect(stopImmediatePropagation).toBeCalled();

        // The interval has to be set
        expect(clickInterval).not.toEqual(undefined);

        // Fast-forward until all timers have been executed
        jest.runAllTimers();

        // Each node has to have the clicked property set to false
        for (let i = 0; i < 4; i++) {
          expect(change.setNodeByKey).toBeCalledWith(`${i}`, { data: { clicked: false } });
        }

        // The right node needs to have the clicked property set to true
        expect(change.setNodeByKey).toBeCalledWith('0', { data: { clicked: true } });

        // The interval has to be cleared and deleted
        expect(clickInterval).toEqual(undefined);

        expect(onChange).toBeCalled();
      });

      it('should handle a double click', () => {
        // First Click
        onMenuItemMouseDown(e, { data, n, nodeProps });

        // Should cancel the default event
        expect(preventDefault).toBeCalled();
        expect(stopPropagation).toBeCalled();
        expect(stopImmediatePropagation).toBeCalled();

        // The interval has to be set
        expect(clickInterval).not.toEqual(undefined);

        // Second Click
        onMenuItemMouseDown(e, { data, n, nodeProps });

        // Should cancel the default event
        expect(preventDefault).toBeCalled();
        expect(stopPropagation).toBeCalled();
        expect(stopImmediatePropagation).toBeCalled();

        // Fast-forward until all timers have been executed
        /*jest.runAllTimers();*/

        expect(closest).toBeCalled();

        // Data needs to be changed for the inline dropdown
        expect(change.setNodeByKey).toBeCalledWith('4', { data: { open: false, selected: '0' } });

        // Focus and anchor need to be moved to the next text
        expect(change.moveFocusTo).toBeCalledWith('5', 0);
        expect(change.moveAnchorTo).toBeCalledWith('5', 0);

        // The interval has to be cleared and deleted
        expect(clickInterval).toEqual(undefined);

        expect(onChange).toBeCalled();
      });
    });
    describe('onRemoveItemMouseDown', () => {
      it('should alert user when there are less than 3 options', () => {
        const specialDocument = new MockDocument({
          filterDescendants: jest.fn().mockReturnValue({ size: 2 })
        });
        nodeProps = {
          children: 'A',
          editor: {
            onChange,
            value: {
              document: specialDocument,
              change: () => change
            }
          }
        };

        onRemoveItemMouseDown(e, { nodeProps });

        // Should cancel the default event
        expect(preventDefault).toBeCalled();
        expect(stopPropagation).toBeCalled();
        expect(stopImmediatePropagation).toBeCalled();

        // Alert the user if there are less than 3 items when trying to remove
        expect(mockInsertSnackBar).toBeCalledWith(
          'You need to have at least 2 possible responses.'
        );

        expect(onChange).not.toBeCalled();
      });

      it('should remove an item on click', () => {
        const specialDocument = new MockDocument({
          filterDescendants: jest.fn().mockReturnValue({ size: 3 })
        });

        nodeProps = {
          children: 'A',
          editor: {
            onChange,
            value: {
              document: specialDocument,
              change: () => change
            }
          }
        };

        onRemoveItemMouseDown(e, { nodeProps });

        // Should cancel the default event
        expect(preventDefault).toBeCalled();
        expect(stopPropagation).toBeCalled();
        expect(stopImmediatePropagation).toBeCalled();

        // The right node needs to have the clicked property set to true
        expect(change.removeNodeByKey).toBeCalledWith('0');
        expect(onChange).toBeCalled();
      });
    });
  });
});
