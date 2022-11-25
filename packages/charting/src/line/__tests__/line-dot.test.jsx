import { shallow } from 'enzyme';
import React from 'react';
import Line, { LineDot as LineChart } from '../line-dot';
import { graphProps } from './utils';
import { Bar as BarChart } from '../../bars/bar';

describe('LineChart', () => {
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: () => {
        return {
          bandwidth: () => {},
        };
      },
    };
    const props = { ...defaults, ...extras };
    return shallow(<LineChart {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());

    it('renders without graphProps', () => expect(wrapper({ graphProps: undefined })).toMatchSnapshot());
  });

  describe('component', () => {
    const chart = Line();

    expect(chart).toEqual({
      type: 'lineDot',
      Component: LineChart,
      name: 'Line Dot',
    });
  });
});
