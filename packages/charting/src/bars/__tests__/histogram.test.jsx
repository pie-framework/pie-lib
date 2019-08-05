import { shallow } from 'enzyme';
import React from 'react';
import Histogram, { Histogram as HistogramChart } from '../histogram';
import { graphProps } from './utils';

describe('HistogramChart', () => {
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
    return shallow(<HistogramChart {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });

  describe('component', () => {
    const chart = Histogram();

    expect(chart).toEqual({
      type: 'histogram',
      Component: HistogramChart
    });
  });
});
