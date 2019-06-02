import { shallow } from 'enzyme';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import Component, { getPoints } from '../component';

jest.mock('@pie-lib/plot', () => {
  const { types, utils } = jest.requireActual('@pie-lib/plot');
  return {
    gridDraggable: jest.fn(opts => Comp => Comp),
    types,
    utils
  };
});

jest.mock('@material-ui/core/styles/index', () => ({
  withStyles: () => () => {}
}));

describe('Component', () => {
  let w;
  let onChange = jest.fn();
  const mark = { root: { ...xy(0, 0) }, edge: { ...xy(2, 3) } };
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      mark: mark
    };
    const props = { ...defaults, ...extras };
    return shallow(<Component {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('changeMark', () => {
      it('calls onChange', () => {
        const w = wrapper();
        w.instance().changeMark({ root: { ...xy(1, 1) }, edge: { ...xy(2, 3) } });
        expect(onChange).toHaveBeenCalledWith(mark, {
          ...mark,
          root: { ...xy(1, 1) }
        });
      });
    });
  });
});

describe('getPoints', () => {
  it('when state.line not set', () => {
    const result = getPoints(
      { root: { ...xy(1, 1) }, edge: { ...xy(2, 2) }, graphProps: graphProps() },
      {}
    );

    expect(result).toEqual({
      root: { x: 1, y: 1 },
      edge: { x: 2, y: 2 },
      dataPoints: [
        { x: 1, y: 1 },
        { x: 1.25, y: 1.3826834324 },
        { x: 1.5, y: 1.7071067812 },
        { x: 1.75, y: 1.9238795325 },
        { x: 2, y: 2 }
      ]
    });
  });

  it('when state.line set', () => {
    const resultWithLine = getPoints(
      { root: { ...xy(1, 1) }, edge: { ...xy(2, 2) }, graphProps: graphProps() },
      { line: { root: { ...xy(1, 1) }, edge: { ...xy(1.5, 1.5) } } }
    );

    expect(resultWithLine).toEqual({
      root: { x: 1, y: 1 },
      edge: { x: 1.5, y: 1.5 },
      dataPoints: [
        { x: 1, y: 1 },
        { x: 1.25, y: 1.3826834324 },
        { x: 1.5, y: 1.7071067812 },
        { x: 1.75, y: 1.9238795325 },
        { x: 2, y: 2 }
      ]
    });
  });
});
