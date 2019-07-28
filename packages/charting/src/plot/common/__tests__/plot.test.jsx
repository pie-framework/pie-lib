import { shallow } from 'enzyme';
import React from 'react';
import Plot, { RawPlot } from '../plot';
import { graphProps } from './utils';

describe('Plot', () => {
  const xBand = () => {};
  xBand.bandwidth = () => {};
  const onChange = jest.fn();

  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand,
      onChange,
      data: [{ value: 0, label: '0' }]
    };
    const props = { ...defaults, ...extras };
    return shallow(<Plot {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });

  describe('logic', () => {
    it('changeBar', () => {
      const w = wrapper();

      w.instance().changeBar(0, { value: 1, label: '0' });

      expect(onChange).toHaveBeenCalledWith([{ value: 1, label: '0' }]);
    });
  });
});

describe('RawPlot', () => {
  const xBand = () => {};
  xBand.bandwidth = () => {};
  const onChange = jest.fn();

  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand,
      onChange,
      data: [],
      label: 'label',
      CustomBarElement: () => <div />
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawPlot {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });

  describe('logic', () => {
    const w = wrapper();

    it('dragStop', () => {
      w.instance().dragStop();

      expect(onChange).not.toHaveBeenCalled();

      w.instance().setState({
        dragValue: 2
      });

      w.instance().dragStop();

      expect(onChange).toHaveBeenCalledWith({ label: 'label', value: 2 });
    });
  });
});
