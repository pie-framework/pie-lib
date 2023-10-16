import { shallow } from 'enzyme';
import React from 'react';
import ChartAxes, { TickComponent, RawChartAxes } from '../axes';
import { graphProps } from '../__tests__/utils';

describe('ChartAxes', () => {
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: {
        bandwidth: () => {},
      },
    };
    const props = { ...defaults, ...extras };
    return shallow(<ChartAxes {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });
});

describe('RawChartAxes', () => {
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: {
        bandwidth: () => {},
        rangeRound: () => {},
      },
      categories: [],
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawChartAxes {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());

    it('renders if graphProps is not defined', () => expect(wrapper({ graphProps: undefined })).toMatchSnapshot());

    it('renders if categories are not defined', () => expect(wrapper({ categories: undefined })).toMatchSnapshot());
  });
});

describe('splitText method', () => {
  const wrapper = (extras) => {
    const xBand = jest.fn();
    xBand.bandwidth = jest.fn();

    const defaults = {
      graphProps: graphProps(),
      xBand,
    };
    const props = { ...defaults, ...extras };
    return shallow(<TickComponent {...props} />);
  };

  it('splits a string into chunks of up to the specified length', () => {
    const w = wrapper();
    const input = 'This is a test string for splitText function';
    const output = w.instance().splitText(input, 20);
    expect(output).toEqual(['This is a test', 'string for splitText', 'function']);
  });

  it('returns an array with a single string when the input is less than the specified length', () => {
    const w = wrapper();
    const input = 'Short text';
    const output = w.instance().splitText(input, 20);
    expect(output).toEqual(['Short text']);
  });

  it('splits a string into chunks of exact length when no spaces are present', () => {
    const w = wrapper();
    const input = 'ThisisateststringforsplitTextfunction';
    const output = w.instance().splitText(input, 10);
    expect(output).toEqual(['Thisisates', 'tstringfor', 'splitTextf', 'unction']);
  });

  it('returns an empty array when the input is an empty string', () => {
    const w = wrapper();
    const input = '';
    const output = w.instance().splitText(input, 20);
    expect(output).toEqual([]);
  });

  it('returns an empty array when the input is null', () => {
    const w = wrapper();
    const input = null;
    const output = w.instance().splitText(input, 20);
    expect(output).toEqual([]);
  });
});

describe('TickComponent', () => {
  const wrapper = (extras) => {
    const xBand = jest.fn();
    xBand.bandwidth = jest.fn();

    const defaults = {
      graphProps: graphProps(),
      xBand,
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
          categories: [{ value: 1, label: 'test' }],
        }),
      ).toMatchSnapshot());
  });

  describe('logic', () => {
    const onChange = jest.fn();
    const onChangeCategory = jest.fn();
    const w = wrapper({
      formattedValue: '0-test',
      categories: [{ value: 1, label: 'test' }],
      onChange,
      onChangeCategory,
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
