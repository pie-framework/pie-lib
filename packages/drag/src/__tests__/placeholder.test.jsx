import { shallow } from 'enzyme';
import React from 'react';
import { PlaceHolder } from '../placeholder';

describe('placeholder', () => {
  const wrapper = extras => {
    const defaults = {
      classes: {
        placeholder: 'placeholder',
        disabled: 'disabled',
        over: 'over',
        number: 'number'
      }
    };
    const props = { ...defaults, ...extras };
    return shallow(<PlaceHolder {...props}> Foo </PlaceHolder>);
  };

  describe('snapshot', () => {
    it('reqular', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('isOver: true', () => {
      expect(wrapper({ isOver: true })).toMatchSnapshot();
    });

    it('disabled: true', () => {
      expect(wrapper({ disabled: true })).toMatchSnapshot();
    });

    it('className', () => {
      expect(wrapper({ className: 'bar' })).toMatchSnapshot();
    });

    it('specific grid rowsRepeatValue', () => {
      const w = wrapper({
        grid: {
          rows: 2,
          columns: 1,
          rowsRepeatValue: 'min-content'
        }
      });
      expect(w).toMatchSnapshot();
    });

  });
});
