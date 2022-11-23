import { shallow } from 'enzyme';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import { RawBaseCircle } from '../component';

const xyLabel = (x, y, label) => ({ x, y, label });

describe('Component', () => {
  let w;
  let onChange = jest.fn();
  let changeMarkProps = jest.fn();

  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      changeMarkProps,
      graphProps: graphProps(),
      from: xy(0, 0),
      to: xy(1, 1),
    };
    const props = { ...defaults, ...extras };

    return shallow(<RawBaseCircle {...props} />);
  };

  // used to test items that have labels attached to points
  const labelNode = document.createElement('foreignObject');
  const fromWithLabel = { x: 0, y: 0, label: 'A' };
  const toWithLabel = { x: 1, y: 1, label: 'B' };
  const wrapperWithLabels = () =>
    wrapper({
      labelNode: labelNode,
      from: fromWithLabel,
      to: toWithLabel,
    });

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders with labels', () => {
      w = wrapperWithLabels();

      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    beforeEach(() => (w = wrapper()));

    describe('dragFrom', () => {
      it('calls onChange', () => {
        w = wrapper();
        w.instance().dragFrom(xy(1, 1));
        expect(onChange).not.toHaveBeenCalledWith({
          from: xy(1, 1),
          to: xy(1, 1),
        });

        w.instance().dragFrom(xy(2, 2));
        expect(onChange).toHaveBeenCalledWith({
          from: xy(2, 2),
          to: xy(1, 1),
        });
      });
    });

    describe('dragFrom keeps labels on "from"', () => {
      it('calls onChange', () => {
        w = wrapperWithLabels();

        // drag "from" to { x: 1, y: 1 }
        w.instance().dragFrom({ x: 1, y: 1 });

        // won't change because points overlap
        expect(onChange).not.toHaveBeenCalledWith({
          from: xyLabel(1, 1, 'A'),
          to: toWithLabel,
        });

        // wil change and will keep labels
        w.instance().dragFrom({ x: 2, y: 2 });
        expect(onChange).toHaveBeenCalledWith({
          from: xyLabel(2, 2, 'A'),
          to: toWithLabel,
        });
      });
    });

    describe('dragTo', () => {
      it('calls onChange', () => {
        w.instance().dragTo(xy(4, 4));
        expect(onChange).toHaveBeenCalledWith({
          from: xy(0, 0),
          to: xy(4, 4),
        });
      });
    });

    describe('dragTo keeps labels on "to"', () => {
      it('calls onChange', () => {
        w = wrapperWithLabels();

        // won't change because points overlap
        w.instance().dragTo({ x: 0, y: 0 });
        expect(onChange).not.toHaveBeenCalledWith({
          from: fromWithLabel,
          to: xyLabel(1, 1, 'B'),
        });

        // wil change and will keep labels
        w.instance().dragTo({ x: 2, y: 2 });
        expect(onChange).toHaveBeenCalledWith({
          from: fromWithLabel,
          to: xyLabel(2, 2, 'B'),
        });
      });
    });

    describe('dragCircle', () => {
      it('calls onChange', () => {
        w.instance().dragCircle(xy(1, 1));
        expect(onChange).toHaveBeenCalledWith({
          from: xy(1, 1),
          to: xy(2, 2),
        });
      });
    });

    describe('dragCircle keeps labels on both "from" and "to"', () => {
      it('calls onChange', () => {
        w = wrapperWithLabels();

        // wil change and will keep labels
        w.instance().dragCircle({ x: 10, y: 10 });
        expect(onChange).toHaveBeenCalledWith({
          from: xyLabel(10, 10, 'A'),
          to: xyLabel(11, 11, 'B'),
        });

        // wil change and will keep labels
        w.instance().dragCircle({ x: 2, y: 2 });
        expect(onChange).toHaveBeenCalledWith({
          from: xyLabel(2, 2, 'A'),
          to: xyLabel(3, 3, 'B'),
        });
      });
    });

    describe('labelChange', () => {
      it('updates "label" property for point', () => {
        w = wrapperWithLabels();

        w.instance().labelChange(xyLabel(0, 0, 'Label A'), 'from');
        expect(changeMarkProps).toBeCalledWith({
          from: xyLabel(0, 0, 'Label A'),
        });

        w.instance().labelChange(xyLabel(0, 0, 'Label B'), 'to');
        expect(changeMarkProps).toBeCalledWith({
          to: xyLabel(0, 0, 'Label B'),
        });
      });

      it('removes "label" property if the field is empty', () => {
        w = wrapperWithLabels();

        w.instance().labelChange(xyLabel(0, 0, ''), 'from');
        expect(changeMarkProps).toBeCalledWith({
          from: xy(0, 0),
        });

        w.instance().labelChange(xyLabel(0, 0, ''), 'to');
        expect(changeMarkProps).toBeCalledWith({
          to: xy(0, 0),
        });
      });
    });

    describe('clickPoint', () => {
      it('adds "label" property to a point', () => {
        w = wrapperWithLabels();

        w.instance().clickPoint(xy(0, 0), 'from');
        expect(changeMarkProps).toBeCalledWith({
          from: xyLabel(0, 0, ''),
          to: xyLabel(1, 1, 'B'),
        });

        w.instance().clickPoint(xy(1, 1), 'to');
        expect(changeMarkProps).toBeCalledWith({
          from: xyLabel(0, 0, 'A'),
          to: xyLabel(1, 1, ''),
        });
      });

      it('if point already has label, keeps that value', () => {
        w = wrapperWithLabels();

        w.instance().clickPoint(fromWithLabel, 'from');
        expect(changeMarkProps).toBeCalledWith({
          from: fromWithLabel,
          to: xyLabel(1, 1, 'B'),
        });

        w.instance().clickPoint(toWithLabel, 'to');
        expect(changeMarkProps).toBeCalledWith({
          from: xyLabel(0, 0, 'A'),
          to: toWithLabel,
        });
      });
    });
  });
});
