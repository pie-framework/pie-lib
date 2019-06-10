import { lineTool, lineToolComponent, lineBase } from '../index';
import { utils } from '@pie-lib/plot';
import { shallow } from 'enzyme';
import React from 'react';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';
const { xy } = utils;
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
        from: xy(1, 1)
      });
    });

    it('returns a complete mark', () => {
      const result = toolbar.addPoint(xy(1, 1), { from: xy(0, 0) });
      expect(result).toEqual({
        building: false,
        from: xy(0, 0),
        to: xy(1, 1)
      });
    });
  });
});

describe('lineToolComponent', () => {
  let Comp;
  let mark;
  let onChange;
  let w;
  const wrapper = extras => {
    const defaults = {
      mark,
      onChange: jest.fn(),
      graphProps: getGraphProps()
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
  let onChange;

  beforeEach(() => {
    Comp = lineBase(() => <text />);
  });

  const wrapper = extras => {
    const defaults = {
      onChange: jest.fn(),
      graphProps: getGraphProps(),
      from: xy(0, 0),
      to: xy(1, 1)
    };
    const props = { ...defaults, ...extras };
    return shallow(<Comp {...props} />);
  };
  describe('render', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    const assertCallsOnChange = (fn, args, expected) => {
      it('calls onChange', () => {
        const update = { from: xy(2, 2), to: xy(4, 4) };
        const w = wrapper();
        w.instance()[fn](...args);
        expect(w.instance().props.onChange).toHaveBeenCalledWith(expected);
      });
    };

    describe('dragComp', () => {
      const update = { from: xy(2, 2), to: xy(4, 4) };
      assertCallsOnChange('dragComp', [update], update);
    });

    describe('dragFrom', () => {
      assertCallsOnChange('dragFrom', [xy(2, 2)], { from: xy(2, 2), to: xy(1, 1) });
    });

    describe('dragTo', () => {
      assertCallsOnChange('dragTo', [xy(2, 2)], { from: xy(0, 0), to: xy(2, 2) });
    });
  });
});
