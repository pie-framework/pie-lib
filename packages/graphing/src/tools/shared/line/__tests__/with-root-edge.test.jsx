import { shallow } from 'enzyme';
import React from 'react';
import { rootEdgeComponent, withRootEdge } from '../with-root-edge';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';
import { utils } from '@pie-lib/plot';

const { xy } = utils;
describe('rootEdgeComponent', () => {
  let w;
  let onChange = jest.fn();
  let Comp;
  let mark;
  beforeEach(() => {
    mark = { root: xy(0, 0), edge: xy(1, 1) };
    Comp = rootEdgeComponent(() => <text />);
  });
  const wrapper = (extras, opts) => {
    const defaults = {
      mark,
      graphProps: getGraphProps(),
      onChange
    };

    const props = { ...defaults, ...extras };
    return shallow(<Comp {...props} />, opts);
  };
  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    const update = { root: xy(2, 2), edge: xy(4, 4) };
    beforeEach(() => {
      w = wrapper();
    });
    describe('changeMark', () => {
      it('calls setState', () => {
        w.instance().changeMark(update);
        expect(w.state('mark')).toMatchObject(update);
      });
    });

    describe('stopDrag', () => {
      beforeEach(() => {
        w = wrapper();
        w.setState({ mark: update });
        w.instance().stopDrag();
      });
      it('unsets state.mark', () => {
        expect(w.state('mark')).toBeUndefined();
      });
      it('calls onChange', () => {
        expect(onChange).toHaveBeenCalledWith(mark, update);
      });
    });
  });
});

describe('withRootEdge', () => {
  let Comp;
  let onChange;
  beforeEach(() => {
    onChange = jest.fn();
    Comp = withRootEdge((props, state) => {
      return { root: xy(0, 0), edge: xy(1, 1), dataPoints: [] };
    });
  });
  const wrapper = extras => {
    const defaults = {
      root: xy(0, 0),
      edge: xy(1, 1),
      graphProps: getGraphProps(),
      onChange
    };
    const props = { ...defaults, ...extras };
    return shallow(<Comp {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
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

    describe('dragLine', () => {
      const update = { root: xy(2, 2), edge: xy(4, 4) };
      assertCallsOnChange('dragLine', [update], update);
    });

    describe('dragRoot', () => {
      assertCallsOnChange('dragRoot', [xy(2, 2)], { root: xy(2, 2), edge: xy(1, 1) });
    });

    describe('dragEdge', () => {
      assertCallsOnChange('dragEdge', [xy(2, 2)], { root: xy(0, 0), edge: xy(2, 2) });
    });
  });
});
