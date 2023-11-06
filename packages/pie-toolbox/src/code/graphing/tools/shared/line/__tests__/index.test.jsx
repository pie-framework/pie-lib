import { lineTool, lineToolComponent, lineBase } from '../index';
import { utils } from '../../../../../plot';
import { shallow } from 'enzyme';
import React from 'react';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';

const { xy } = utils;
const xyLabel = (x, y, label) => ({ x, y, label });

describe('lineTool', () => {
  describe('addPoint', () => {
    let toolbar;
    beforeEach(() => {
      toolbar = lineTool('lineType', () => <div />)();
    });
    it('returns a building mark', () => {
      const result = toolbar.addPoint(xy(1, 1));
      expect(result).toEqual({
        type: 'lineType',
        building: true,
        from: xy(1, 1),
      });
    });

    it('returns a complete mark', () => {
      const result = toolbar.addPoint(xy(1, 1), { from: xy(0, 0) });
      expect(result).toEqual({
        building: false,
        from: xy(0, 0),
        to: xy(1, 1),
      });
    });
  });
});

describe('lineToolComponent', () => {
  let Comp;
  let mark;
  let onChange;
  let w;
  const wrapper = (extras) => {
    const defaults = {
      mark,
      onChange: jest.fn(),
      graphProps: getGraphProps(),
    };
    const props = { ...defaults, ...extras };

    return shallow(<Comp {...props} />);
  };

  beforeEach(() => {
    Comp = lineToolComponent(() => <text />);
    mark = { from: xy(0, 0), to: xy(1, 1) };
  });

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    describe('startDrag', () => {
      it('sets state', () => {
        w = wrapper();
        w.instance().startDrag();
        expect(w.state('mark')).toEqual(mark);
      });
    });

    describe('stopDrag/changeMark', () => {
      let update = { from: xy(2, 2), to: xy(4, 4) };
      beforeEach(() => {
        w = wrapper();
        w.instance().changeMark(update);
        w.instance().stopDrag();
      });
      it('calls onChange', () => {
        expect(w.instance().props.onChange).toHaveBeenCalledWith(mark, update);
      });
    });
  });
});

describe('lineBase', () => {
  let Comp;
  let w;
  let onChange = jest.fn();
  let changeMarkProps = jest.fn();

  beforeEach(() => {
    Comp = lineBase(() => <text />);
  });

  const wrapper = (extras) => {
    const defaults = {
      onChange,
      changeMarkProps,
      graphProps: getGraphProps(),
      from: xy(0, 0),
      to: xy(1, 1),
    };
    const props = { ...defaults, ...extras };

    return shallow(<Comp {...props} />);
  };

  // used to test items that have labels attached to points
  const labelNode = document.createElement('foreignObject');
  const wrapperWithLabels = () =>
    wrapper({
      labelNode: labelNode,
      from: xyLabel(0, 0, 'A'),
      to: xyLabel(1, 1, 'B'),
    });

  describe('render', () => {
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
    const assertCallsOnChange = (fn, args, expected) => {
      it('calls onChange', () => {
        const w = wrapper();
        w.instance()[fn](...args);
        expect(w.instance().props.onChange).toBeCalledWith(expected);
      });
    };

    const assertCallsOnChangeWithLabels = (fn, args, expected) => {
      it('calls onChange with labels', () => {
        const w = wrapperWithLabels();
        w.instance()[fn](...args);
        expect(w.instance().props.onChange).toBeCalledWith(expected);
      });
    };

    describe('dragComp', () => {
      const update = { from: xy(2, 2), to: xy(4, 4) };
      assertCallsOnChange('dragComp', [update], update);
    });

    describe('dragComp keeps labels on both "from" and "to"', () => {
      const update = { from: xy(2, 2), to: xy(4, 4) };
      assertCallsOnChangeWithLabels('dragComp', [update], {
        from: xyLabel(2, 2, 'A'),
        to: xyLabel(4, 4, 'B'),
      });
    });

    describe('dragFrom', () => {
      assertCallsOnChange('dragFrom', [xy(2, 2)], { from: xy(2, 2), to: xy(1, 1) });
    });

    describe('dragFrom keeps labels on "from"', () => {
      assertCallsOnChangeWithLabels('dragFrom', [xy(2, 2)], {
        from: xyLabel(2, 2, 'A'),
        to: xyLabel(1, 1, 'B'),
      });
    });

    describe('dragTo', () => {
      assertCallsOnChange('dragTo', [xy(2, 2)], { from: xy(0, 0), to: xy(2, 2) });
    });

    describe('dragTo keeps labels on "to"', () => {
      assertCallsOnChangeWithLabels('dragTo', [xy(3, 3)], {
        from: xyLabel(0, 0, 'A'),
        to: xyLabel(3, 3, 'B'),
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

        w.instance().clickPoint(xyLabel(0, 0, 'Label A'), 'from');
        expect(changeMarkProps).toBeCalledWith({
          from: xyLabel(0, 0, 'Label A'),
          to: xyLabel(1, 1, 'B'),
        });

        w.instance().clickPoint(xyLabel(1, 1, 'Label B'), 'to');
        expect(changeMarkProps).toBeCalledWith({
          from: xyLabel(0, 0, 'A'),
          to: xyLabel(1, 1, 'Label B'),
        });
      });
    });
  });
});
