import { shallow } from 'enzyme';
import React from 'react';
import { FeedbackSelector } from '../feedback-selector';

describe('feedback-selector', () => {
  let w, onChange;

  const getWrapper = () => {
    return shallow(
      <FeedbackSelector
        classes={{}}
        label={'foo'}
        onChange={onChange}
        feedback={{
          type: 'default',
          default: 'hi'
        }}
      />
    );
  };

  beforeEach(() => {
    onChange = jest.fn();
    w = getWrapper();
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('changeCustom', () => {
      it('calls onChange with text', () => {
        w.instance().changeCustom('bar');
        expect(onChange).toBeCalledWith({
          type: 'custom',
          custom: 'bar',
          default: 'hi'
        });
      });
    });

    describe('changeType', () => {
      it('calls onChange with default', () => {
        w.instance().changeType('default');
        expect(onChange).toBeCalledWith({ type: 'default', default: 'hi' });
      });
      it('calls onChange with custom', () => {
        w.instance().changeType('custom');
        expect(onChange).toBeCalledWith({ type: 'custom', default: 'hi' });
      });
      it('calls onChange with none', () => {
        w.instance().changeType('none');
        expect(onChange).toBeCalledWith({ type: 'none', default: 'hi' });
      });
    });
  });
});
