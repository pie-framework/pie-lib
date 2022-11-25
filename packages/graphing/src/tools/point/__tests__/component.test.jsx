import { shallow } from 'enzyme';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import Component from '../component';

describe('Component', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = (extras, opts) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
    };
    const props = { ...defaults, ...extras };
    return shallow(<Component {...props} />, opts);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('move', () => {
      it('calls onChange', () => {
        const w = wrapper({ mark: { ...xy(0, 0) } });
        w.instance().move({ x: 1, y: 1 });
        expect(w.state('mark')).toMatchObject({ ...xy(1, 1) });
      });
    });

    describe('labelChange', () => {
      it('callsOnChange with label removed', () => {
        const mark = { label: 'foo' };
        const update = {};
        const w = wrapper({ mark });
        w.instance().labelChange(undefined);
        expect(onChange).toHaveBeenCalledWith(mark, update);
      });
    });

    describe('clickPoint', () => {
      let mark;
      let w;
      beforeEach(() => {
        mark = { label: 'foo' };
        w = wrapper({ mark, labelModeEnabled: true }, { disableLifecycleMethods: true });
        w.instance().input = {
          focus: jest.fn(),
        };
        w.instance().clickPoint();
      });
      it('calls onChange if labelModeEnabeld', () => {
        expect(onChange).toHaveBeenCalledWith(mark, { label: '', ...mark });
      });
      it('calls input.focus', () => {
        expect(w.instance().input.focus).toHaveBeenCalled();
      });
    });
  });
});
