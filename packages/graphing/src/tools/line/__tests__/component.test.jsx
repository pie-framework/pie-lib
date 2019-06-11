import { shallow } from 'enzyme';
import React from 'react';
import { ArrowedLine } from '../component';
import { graphProps as getGraphProps } from '../../../__tests__/utils';

jest.mock('@pie-lib/plot', () => {
  const a = jest.requireActual('@pie-lib/plot');
  return {
    types: a.types,
    gridDraggable: a.gridDraggable,
    utils: a.utils,
    trig: {
      edges: jest.fn(() => jest.fn().mockReturnValue([0, 0])),
      getPointOnLineAtADistance: jest.fn(() => jest.fn().mockReturnValue(1))
    }
  };
});

describe('ArrowedLine', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      markerId: '1',
      graphProps: getGraphProps(),
      from: { x: 0, y: 0 },
      to: { x: 1, y: 1 }
    };
    const props = { ...defaults, ...extras };
    return shallow(<ArrowedLine {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });
});
