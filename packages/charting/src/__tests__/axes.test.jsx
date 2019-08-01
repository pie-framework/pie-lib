import { shallow } from 'enzyme';
import React from 'react';
import ChartAxes, { TickComponent } from '../axes';
import { graphProps } from '../__tests__/utils';

describe('ChartAxes', () => {
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: {
        bandwidth: () => {}
      }
    };
    const props = { ...defaults, ...extras };
    return shallow(<ChartAxes {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });
});

describe('TickComponent', () => {
  const wrapper = extras => {
    const xBand = jest.fn();
    xBand.bandwidth = jest.fn();

    const defaults = {
      graphProps: graphProps(),
      xBand
    };
    const props = { ...defaults, ...extras };
    return shallow(<TickComponent {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });

  describe('snapshot1', () => {
    it('renders', () =>
      expect(
        wrapper({
          formattedValue: '0-test',
          categories: [{ value: 1, label: 'test' }]
        })
      ).toMatchSnapshot());
  });

  describe('logic', () => {
    const onChange = jest.fn();
    const onChangeCategory = jest.fn();
    const w = wrapper({
      formattedValue: '0-test',
      categories: [{ value: 1, label: 'test' }],
      onChange,
      onChangeCategory
    });

    it('calls onChangeCategory', () => {
      w.instance().changeCategory(0, 'new label');
      expect(onChangeCategory).toHaveBeenCalledWith(0, { value: 1, label: 'new label' });
    });

    it('calls onChange', () => {
      w.instance().deleteCategory(0);
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });
});
