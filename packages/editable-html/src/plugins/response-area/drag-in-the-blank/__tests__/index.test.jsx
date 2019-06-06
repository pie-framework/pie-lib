import React from 'react';
import { Data } from 'slate';
import { shallow } from 'enzyme';
import MockChange, { MockDocument } from '../../__tests__/mock-change';
import DragInTheBlank, { onValueChange, onRemoveResponse } from '../index';
describe('choice', () => {
  describe('snapshot', () => {
    let attributes = { key: '0' },
      n = { key: '0' },
      nodeProps = { children: 'A' },
      opts = { options: { duplicates: false } };

    const mkWrapper = (Component, props) => {
      return shallow(<Component {...props} />);
    };

    it('renders correctly when not in a table and duplicates are off', () => {
      const w = mkWrapper(DragInTheBlank, {
        attributes,
        data: { inTable: false },
        n,
        nodeProps,
        opts
      });

      expect(w).toMatchSnapshot();
    });

    it('renders correctly when in a table and duplicates are off', () => {
      const w = mkWrapper(DragInTheBlank, {
        attributes,
        data: { inTable: true },
        n,
        nodeProps,
        opts
      });

      expect(w).toMatchSnapshot();
    });

    it('renders correctly when in a table and duplicates are on', () => {
      const w = mkWrapper(DragInTheBlank, {
        attributes,
        data: { inTable: true },
        n,
        nodeProps,
        opts: { options: { duplicates: true } }
      });

      expect(w).toMatchSnapshot();
    });
  });
  describe('handlers', () => {
    let nodeProps,
      n,
      document = new MockDocument({
        docFindDescendant: jest.fn().mockReturnValue({
          key: '0',
          data: Data.create({ index: '0' })
        })
      }),
      change,
      onChange,
      onEditingDone;

    beforeEach(() => {
      n = { key: '0', data: Data.create({ index: '0' }) };

      onChange = jest.fn();
      onEditingDone = jest.fn();

      change = new MockChange();

      nodeProps = {
        children: 'A',
        editor: {
          props: { onChange, onEditingDone },
          value: {
            document,
            change: () => change
          }
        }
      };
    });

    describe('onValueChange', () => {
      it('should change value', () => {
        onValueChange(nodeProps, n, { value: 'B' });
        expect(change.setNodeByKey).toBeCalledWith('0', {
          data: {
            index: '0',
            value: 'B'
          }
        });

        expect(onChange).toBeCalledWith(change, expect.anything());
        expect(onChange.mock.calls[0][1]).toBeInstanceOf(Function);

        onChange.mock.calls[0][1]();

        expect(onEditingDone).toBeCalled();
      });
    });
    describe('onRemoveResponse', () => {
      it('should remove response', () => {
        onRemoveResponse(nodeProps, n, { value: 'B' });
        expect(change.setNodeByKey).toBeCalledWith('0', {
          data: { index: '0' }
        });
        expect(onChange).toBeCalledWith(change, expect.anything());
        expect(onChange.mock.calls[0][1]).toBeInstanceOf(Function);
        onChange.mock.calls[0][1]();
        expect(onEditingDone).toBeCalled();
      });
    });
  });
});
