import { shallow } from 'enzyme';
import React from 'react';
import Line, { RawLine } from '../line';
import { graphProps } from './utils';

describe('Line', () => {
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
    return shallow(<Line {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });

  describe('logic', () => {
    it('changeLine', () => {
      const w = wrapper();

      w.instance().changeLine(0, { dragValue: 1, label: '0' });

      expect(onChange).toHaveBeenCalledWith([{ value: 1, label: '0' }]);
    });
  });
});

describe('RawLine', () => {
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
      data: [{ label: 'A', value: 0 }, { label: 'B', value: 1 }],
      label: 'label',
      CustomBarElement: () => <div />
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawLine {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });

  describe('logic', () => {
    const w = wrapper();

    it('dragStop', () => {
      w.instance().setState({
        line: [{ x: 0, y: 0, dragValue: 2 }, { x: 1, y: 1 }]
      });

      w.instance().dragStop(0);

      expect(onChange).toHaveBeenCalledWith(0, { x: 0, y: 0, dragValue: 2 });
    });
  });
});
