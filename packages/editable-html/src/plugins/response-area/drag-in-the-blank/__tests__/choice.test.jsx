import React from 'react';
import { shallow } from 'enzyme';
import { tileSource, tileTarget, BlankContent as Choice } from '../choice';
describe('choice', () => {
  describe('snapshot', () => {
    let n = { key: '0' },
      children = 'A',
      dragItem = { value: { value: 'B' } },
      value = {};

    const mkWrapper = (Component, props) => {
      return shallow(<Component {...props} />);
    };

    it('renders correctly when some tile is dragged but it is not over this tile, has no value', () => {
      const w = mkWrapper(Choice, {
        n,
        children,
        isDragging: false,
        dragItem,
        isOver: false,
        value
      });
      expect(w).toMatchSnapshot();
    });
    it('renders correctly when some tile is dragged but it is not over this tile, has value', () => {
      const w = mkWrapper(Choice, {
        n,
        children,
        isDragging: false,
        dragItem,
        isOver: false,
        value: { value: 'C' }
      });
      expect(w).toMatchSnapshot();
    });
    it('renders correctly when some tile is dragged and is over this tile', () => {
      const w = mkWrapper(Choice, {
        n,
        children,
        isDragging: false,
        dragItem,
        isOver: true,
        value: { value: 'C' }
      });
      expect(w).toMatchSnapshot();
    });
    it('renders correctly when this tile is being dragged', () => {
      const w = mkWrapper(Choice, {
        n,
        children,
        isDragging: true,
        dragItem,
        isOver: false,
        value: { value: 'C' }
      });
      expect(w).toMatchSnapshot();
    });
  });
  describe('handlers', () => {
    describe('tileSource', () => {
      describe('canDrag', () => {
        it('should return false if disabled', () => {
          expect(tileSource.canDrag({ disabled: true })).toEqual(false);
        });
        it('should return false if value not defined', () => {
          expect(tileSource.canDrag({ disabled: true, value: null })).toEqual(false);
        });
      });
      describe('beginDrag', () => {
        it('should return correct values', () => {
          expect(
            tileSource.beginDrag({
              targetId: '0',
              value: {},
              instanceId: '0'
            })
          ).toMatchObject({
            id: '0',
            value: {},
            instanceId: '0',
            fromChoice: true
          });
        });
      });
      describe('endDrag', () => {
        let removeResponse;
        beforeEach(() => {
          removeResponse = jest.fn();
        });
        it('should handle if it did not drop', () => {
          tileSource.endDrag(
            {
              removeResponse
            },
            {
              getDropResult: jest.fn().mockReturnValue(undefined),
              getItem: jest.fn().mockReturnValue({ fromChoice: true, value: { id: '0' } })
            }
          );
          expect(removeResponse).toBeCalledWith({ id: '0' });
        });
        it('should handle if it dropped and duplicates are allowed', () => {
          tileSource.endDrag(
            {
              removeResponse,
              duplicates: true
            },
            {
              getDropResult: jest.fn().mockReturnValue({ dropped: true, duplicates: false })
            }
          );
          expect(removeResponse).not.toBeCalled();
        });
        it('should handle if it dropped and duplicates are not allowed', () => {
          tileSource.endDrag(
            {
              removeResponse,
              duplicates: false
            },
            {
              getDropResult: jest.fn().mockReturnValue({ dropped: true, duplicates: false }),
              getItem: jest.fn().mockReturnValue({ fromChoice: true, value: { id: '0' } })
            }
          );
          expect(removeResponse).toBeCalledWith({ id: '0' });
        });
      });
    });
    describe('tileTarget', () => {
      describe('canDrop', () => {
        it('should return false if instanceId is different', () => {
          expect(
            tileTarget.canDrop(
              { instanceId: '0' },
              { getItem: jest.fn().mockReturnValue({ instanceId: '1' }) }
            )
          ).toEqual(false);
        });
        it('should return true if instanceId is the same', () => {
          expect(
            tileTarget.canDrop(
              { instanceId: '0' },
              { getItem: jest.fn().mockReturnValue({ instanceId: '0' }) }
            )
          ).toEqual(true);
        });
      });
      describe('drop', () => {
        let onChange;
        beforeEach(() => {
          onChange = jest.fn();
        });
        it('should not call onChange if the index did not change', () => {
          const response = tileTarget.drop(
            { onChange, value: { index: 0 } },
            { getItem: jest.fn().mockReturnValue({ value: { index: 0 } }) }
          );
          expect(onChange).not.toBeCalled();
          expect(response).toMatchObject({ dropped: false });
        });
        it('should call onChange if the index changed', () => {
          const response = tileTarget.drop(
            { onChange, value: { index: 0 } },
            { getItem: jest.fn().mockReturnValue({ value: { index: 1 } }) }
          );
          expect(onChange).toBeCalledWith({ index: 1 });
          expect(response).toMatchObject({ dropped: true });
        });
      });
    });
  });
});
