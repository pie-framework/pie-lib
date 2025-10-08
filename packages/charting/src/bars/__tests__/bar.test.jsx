import { shallow } from 'enzyme';
import React from 'react';
import Bar, { Bar as BarChart } from '../bar';
import { graphProps } from './utils';

describe('BarChart', () => {
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
    return shallow(<BarChart {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());

    it('renders without graphProps', () => expect(wrapper({ graphProps: undefined })).toMatchSnapshot());
  });

  describe('component', () => {
    const chart = Bar();

    expect(chart).toEqual({
      type: 'bar',
      Component: BarChart,
      name: 'Bar',
    });
  });
});
