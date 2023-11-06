import * as React from 'react';
import { shallow } from 'enzyme';
import CorrectInput from '../correct-input';

describe('CorrectInput', () => {
  const onChange = jest.fn();
  const defaultProps = {
    disabled: false,
    correct: false,
    variant: 'outlined',
    value: 'Cow',
    onChange,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CorrectInput {...defaultProps} />);
  });

  describe('render', () => {
    it('renders correctly with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with disabled prop as true', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with correct as false', () => {
      wrapper.setProps({ correct: false });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    const event = (value) => ({
      target: { value },
    });

    it('should be called', () => {
      const e = event('1');

      wrapper.simulate('change', e);

      expect(onChange).toBeCalledWith(e);
    });
  });
});
