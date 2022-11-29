import { shallow } from 'enzyme';
import React from 'react';
import ChartType from '../chart-type';

describe('ChartType', () => {
  let wrapper;
  let props;
  const onChange = jest.fn();

  beforeEach(() => {
    props = {
      classes: {},
      value: 'bar',
      onChange,
    };

    wrapper = (newProps) => {
      const configureProps = { ...props, newProps };

      return shallow(<ChartType {...configureProps} />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });
});
