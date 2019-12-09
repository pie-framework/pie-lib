import { shallow } from 'enzyme';
import React from 'react';
import Dot, { DotPlot } from '../dot';
import { graphProps } from './utils';
import { Bar as BarChart } from '../../bars/bar';

describe('DotPlot', () => {
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
    return shallow(<DotPlot {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());

    it('renders without graphProps', () =>
      expect(wrapper({ graphProps: undefined })).toMatchSnapshot());
  });

  describe('component', () => {
    const chart = Dot();

    expect(chart).toEqual({
      type: 'dotPlot',
      Component: DotPlot,
      name: 'Dot Plot'
    });
  });
});
