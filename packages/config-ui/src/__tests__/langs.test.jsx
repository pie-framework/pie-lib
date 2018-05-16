import { shallow } from 'enzyme';
import React from 'react';
import { RawLangs } from '../langs';

describe('langs', () => {
  let onChange;
  const wrapper = extras => {
    const defaults = {
      uid: '1',
      onChange,
      classes: {},
      langs: ['en-US', 'es-ES']
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawLangs {...props} />);
  };

  beforeEach(() => {
    onChange = jest.fn();
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('choose', () => {
      it('calls onChange', () => {
        const w = wrapper();
        w.instance().choose({ target: { value: 'en-US' } });
        expect(onChange).toBeCalledWith('en-US');
      });
    });
  });
});
