import { shallow } from 'enzyme';
import React from 'react';
import Line, { Line as LineChart } from '../line';
import { graphProps } from './utils';

describe('LineChart', () => {
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: () => {
        return {
          bandwidth: () => {}
        };
      }
    };
    const props = { ...defaults, ...extras };
    return shallow(<LineChart {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });

  describe('component', () => {
    const chart = Line();

    expect(chart).toEqual({
      type: 'line',
      Component: LineChart
    });
  });
});
