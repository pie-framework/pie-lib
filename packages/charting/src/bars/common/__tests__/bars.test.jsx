import { shallow } from 'enzyme';
import React from 'react';
import Bars, { RawBar } from '../bars';
import { graphProps } from './utils';

describe('Bars', () => {
  const xBand = () => {};
  xBand.bandwidth = () => {};
  const onChange = jest.fn();

  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand,
      onChange,
      data: [{ value: 0, label: '0' }],
    };
    const props = { ...defaults, ...extras };
    return shallow(<Bars {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });
});

describe('RawBar', () => {
  const xBand = () => {};
  xBand.bandwidth = () => {};
  const onChangeCategory = jest.fn();

  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand,
      onChangeCategory,
      data: [],
      label: 'label',
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawBar {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });

  describe('logic', () => {
    const w = wrapper();

    it('dragStop', () => {
      w.instance().dragStop();

      expect(onChangeCategory).not.toHaveBeenCalled();

      w.instance().setState({
        dragValue: 2,
      });

      w.instance().dragStop(0);

      expect(onChangeCategory).toHaveBeenCalledWith({ label: 'label', value: 2 });
    });
  });
});
