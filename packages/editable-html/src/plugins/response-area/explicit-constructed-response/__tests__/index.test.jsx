import React from 'react';
import { Data } from 'slate';
import { shallow } from 'enzyme';
import MockChange, { MockDocument } from '../../__tests__/mock-change';
import ExplicitConstructedResponse, { onInputClick, onMouseDown } from '../index';

jest.useFakeTimers();
describe('choice', () => {
  describe('snapshot', () => {
    let attributes = { key: '0' },
      n = { key: '0' },
      nodeProps = { children: 'A' };

    const mkWrapper = (Component, props) => {
      return shallow(<Component {...props} />);
    };

    it('renders correctly when in a table', () => {
      const w = mkWrapper(ExplicitConstructedResponse, {
        attributes,
        data: { focused: false, inTable: true },
        n,
        nodeProps
      });

      expect(w).toMatchSnapshot();
    });

    it('renders correctly when not in a table', () => {
      const w = mkWrapper(ExplicitConstructedResponse, {
        attributes,
        data: { focused: false, inTable: true },
        n,
        nodeProps
      });

      expect(w).toMatchSnapshot();
    });

    it('renders correctly when focused', () => {
      const w = mkWrapper(ExplicitConstructedResponse, {
        attributes,
        data: { focused: true },
        n,
        nodeProps
      });

      expect(w).toMatchSnapshot();
    });

    it('renders correctly when focused and in an input', () => {
      const w = mkWrapper(ExplicitConstructedResponse, {
        attributes,
        data: { focused: true, inTable: true },
        n,
        nodeProps
      });

      expect(w).toMatchSnapshot();
    });
  });
  describe('handlers', () => {
    let nodeProps,
      e,
      n,
      document = new MockDocument({
        docFindDescendant: jest.fn().mockReturnValue({
          key: '0',
          data: Data.create({ index: '0' })
        })
      }),
      change,
      onChange,
      closest = jest.fn().mockReturnValue({
        dataset: {
          key: '0'
        }
      });

    beforeEach(() => {
      n = { key: '0', data: Data.create({ index: '0' }) };

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

    describe('onInputClick', () => {
      it('should handle a click', () => {
        onInputClick(nodeProps, n);
        expect(change.moveFocusTo).toBeCalledWith('5', 0);
        expect(change.moveAnchorTo).toBeCalledWith('5', 0);
        expect(change.setNodeByKey).toBeCalledWith('0', {
          data: { focused: false }
        });
        expect(onChange).toBeCalledWith(change);
      });
    });
    describe('onMouseDown', () => {
      beforeEach(() => {
        e = { target: { closest } };
        n = { key: '0', data: Data.create({ index: '0' }) };
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

      it('should not do anything when input is focused and main el is clicked', () => {
        nodeProps.editor.value.isFocused = false;
        document.findDescendant = jest.fn().mockReturnValue({
          getLastText: jest.fn().mockReturnValue({})
        });

        onMouseDown(e, nodeProps, n, { focused: false });

        expect(nodeProps.editor.onChange).not.toBeCalled();
        expect(change.moveAnchorTo).not.toBeCalled();
        expect(change.moveFocusTo).not.toBeCalled();
        expect(change.setNodeByKey).not.toBeCalled();
      });

      it('should not do anything when input is focused and child of main el is clicked', () => {
        n.key = '1';
        nodeProps.editor.value.isFocused = false;
        document.getClosestInline = jest.fn().mockReturnValue({
          getLastText: jest.fn().mockReturnValue({})
        });

        onMouseDown(e, nodeProps, n, { focused: false });

        expect(nodeProps.editor.onChange).not.toBeCalled();
        expect(change.moveAnchorTo).not.toBeCalled();
        expect(change.moveFocusTo).not.toBeCalled();
        expect(change.setNodeByKey).not.toBeCalled();
      });

      it('should not do anything when el already has focus to true and type not ecr', () => {
        nodeProps.editor.value.isFocused = true;
        document.findDescendant = jest.fn().mockReturnValue({
          getLastText: jest.fn().mockReturnValue({})
        });
        document.getParent = jest.fn().mockReturnValue({
          type: 'explicit_constructed_response'
        });

        onMouseDown(e, nodeProps, n, { focused: true });

        global.getSelection = jest.fn().mockReturnValue({
          anchorNode: {
            parentElement: {
              closest: jest.fn().mockReturnValue({
                getAttribute: jest.fn().mockReturnValue('1:0')
              })
            }
          }
        });

        jest.runAllTimers();

        expect(document.getParent).toBeCalled();
        expect(nodeProps.editor.onChange).not.toBeCalled();
        expect(change.moveAnchorTo).not.toBeCalled();
        expect(change.moveFocusTo).not.toBeCalled();
        expect(change.setNodeByKey).not.toBeCalled();
      });

      it('should move focus to ecr if it is not already there', () => {
        nodeProps.editor.value.isFocused = true;
        document.findDescendant = jest.fn().mockReturnValue({
          key: '3',
          getLastText: jest.fn().mockReturnValue({ key: '6', text: 'foo bar' })
        });
        document.getParent = jest.fn().mockReturnValue({
          type: 'explicit_constructed_response'
        });

        onMouseDown(e, nodeProps, n, { focused: false });

        global.getSelection = jest.fn().mockReturnValue({
          anchorNode: {
            parentElement: {
              closest: jest.fn().mockReturnValue({
                getAttribute: jest.fn().mockReturnValue('1:0')
              })
            }
          }
        });
        jest.runAllTimers();
        expect(document.getParent).toBeCalled();
        expect(change.moveAnchorTo).toBeCalledWith('6', 6);
        expect(change.moveFocusTo).toBeCalledWith('6', 6);
        expect(change.setNodeByKey).toBeCalledWith('3', {
          data: { focused: true }
        });
        expect(nodeProps.editor.onChange).toBeCalledWith(change);
      });
    });
  });
});
