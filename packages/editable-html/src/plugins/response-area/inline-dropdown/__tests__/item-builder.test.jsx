import React from 'react';
import { shallow } from 'enzyme';
import MockChange, { MockDocument } from '../../__tests__/mock-change';
import ItemBuilder, { onAddMenuItemMouseDown, onItemBuilderMouseDown } from '../item-builder';

let mockInsertSnackBar;

jest.mock('../../utils', () => {
  mockInsertSnackBar = jest.fn();

  return {
    insertSnackBar: mockInsertSnackBar
  };
});

jest.useFakeTimers();

describe('item-builder', () => {
  let attributes = { key: '0' },
    n = { key: '0' },
    nodeProps = { children: 'A' };

  const mkWrapper = (Component, props) => {
    return shallow(<Component {...props} />);
  };
  describe('snapshot', () => {
    it('renders correctly', () => {
      const w = mkWrapper(ItemBuilder, {
        attributes,
        data: {},
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
    describe('onItemBuilderMouseDown', () => {
      it('should not do anything if the focus moves outside of the editable-html element', () => {
        const specialDocument = new MockDocument({
          docFindDescendant: jest.fn().mockReturnValue({
            getLastText: jest.fn().mockReturnValue({ key: '7', text: 'foo bar' })
          })
        });

        global.getSelection = jest.fn().mockReturnValue({
          anchorNode: {
            parentElement: {
              closest: jest.fn().mockReturnValue(null)
            }
          }
        });

        e.target.closest = jest.fn().mockReturnValue({
          dataset: {
            key: '6'
          }
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

        onItemBuilderMouseDown(e, { nodeProps });

        // Fast-forward until all timers have been executed
        jest.runAllTimers();

        expect(change.moveFocusTo).not.toBeCalled();
        expect(change.moveAnchorTo).not.toBeCalled();
      });

      it('should not do anything if the focus is still inside the item-builder', () => {
        const specialDocument = new MockDocument({
          docFindDescendant: jest.fn().mockReturnValue({
            getLastText: jest.fn().mockReturnValue({ key: '7', text: 'foo bar' })
          })
        });

        global.getSelection = jest.fn().mockReturnValue({
          anchorNode: {
            parentElement: {
              closest: jest.fn().mockReturnValue({
                getAttribute: jest.fn().mockReturnValue('7:0')
              })
            }
          }
        });

        e.target.closest = jest.fn().mockReturnValue({
          dataset: {
            key: '6'
          }
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

        onItemBuilderMouseDown(e, { nodeProps });

        // Fast-forward until all timers have been executed
        jest.runAllTimers();

        expect(change.moveFocusTo).not.toBeCalled();
        expect(change.moveAnchorTo).not.toBeCalled();
      });

      it('should move the focus inside the item-builder if it got out of it', () => {
        const specialDocument = new MockDocument({
          docFindDescendant: jest.fn().mockReturnValue({
            getLastText: jest.fn().mockReturnValue({ key: '7', text: 'foo bar ' })
          })
        });

        global.getSelection = jest.fn().mockReturnValue({
          anchorNode: {
            parentElement: {
              closest: jest.fn().mockReturnValue({
                getAttribute: jest.fn().mockReturnValue('9:0')
              })
            }
          }
        });

        e.target.closest = jest.fn().mockReturnValue({
          dataset: {
            key: '6'
          }
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

        onItemBuilderMouseDown(e, { nodeProps });

        // Fast-forward until all timers have been executed
        jest.runAllTimers();
        expect(change.moveFocusTo).toBeCalledWith('7', 7);
        expect(change.moveAnchorTo).toBeCalledWith('7', 7);
      });
    });
    describe('onAddMenuItemMouseDown', () => {
      it('should alert user when there is only 1 child node or there is no text in the child nodes', () => {
        const specialDocument = new MockDocument({
          docFindDescendant: jest.fn().mockReturnValue({
            getLastText: jest.fn().mockReturnValue({ key: '7', text: 'foo bar' })
          })
        });
        global.getSelection = jest.fn().mockReturnValue({
          anchorNode: {
            parentElement: {
              closest: jest.fn().mockReturnValue(null)
            }
          }
        });

        n.getText = jest.fn().mockReturnValue('');

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
        onItemBuilderMouseDown(e, { nodeProps });
        // Fast-forward until all timers have been executed
        jest.runAllTimers();
        expect(change.moveFocusTo).not.toBeCalled();
        expect(change.moveAnchorTo).not.toBeCalled();
      });
    });
  });
});
