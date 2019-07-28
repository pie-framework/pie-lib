import { shallow } from 'enzyme';
import React from 'react';
import Line, { LinePlot } from '../line';
import { graphProps } from './utils';

describe('LinePlot', () => {
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
    return shallow(<LinePlot {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });

  describe('component', () => {
    const chart = Line();

    expect(chart).toEqual({
      type: 'linePlot',
      Component: LinePlot
    });
  });
});
