import { shallow } from 'enzyme';
import React from 'react';
import { rootEdgeComponent, withRootEdge, rootEdgeToFromToWrapper } from '../with-root-edge';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';
import { utils } from '../../../../../plot/index';
import { lineToolComponent, LineToolMockComponent } from '..';
const { xy } = utils;
jest.mock('../index', () => {
  const out = {
    lineBase: jest.fn().mockReturnValue(() => <div />),
    lineToolComponent: jest.fn().mockReturnValue(() => <div />),
  };
  return out;
});

describe('rootEdgeToToFromWRapper', () => {
  let Comp;
  let w;
  let onChange = jest.fn();
  beforeEach(() => {
    Comp = rootEdgeToFromToWrapper(() => <div />);
  });
  const wrapper = (extras) => {
    const defaults = {
      mark: { root: xy(1, 1), edge: xy(2, 2) },
      onChange,
    };
    const props = { ...defaults, ...extras };
    return shallow(<Comp {...props} />);
  };

  it('renders', () => {
    w = wrapper();
    expect(w).toMatchSnapshot();
  });

  it('has from/to mark', () => {
    w = wrapper();
    expect(w.props().mark).toEqual({ from: xy(1, 1), to: xy(2, 2) });
  });

  it('calls onChange with root edge ', () => {
    w = wrapper();
    w.props().onChange({ from: xy(1, 1), to: xy(2, 2) }, { from: xy(3, 3), to: xy(4, 4) });
    expect(onChange).toHaveBeenCalledWith({ root: xy(1, 1), edge: xy(2, 2) }, { root: xy(3, 3), edge: xy(4, 4) });
  });
});
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
      onChange,
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
});
