import * as React from 'react';
import { shallow } from 'enzyme';
import Input from '../input';

describe('Input', () => {
  const onChange = jest.fn();
  const defaultProps = {
    disabled: false,
    correct: false,
    variant: 'outlined',
    value: 'Cow',
    id: '1',
    onChange
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Input {...defaultProps} />);
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
    const event = value => ({
      target: { value }
    });

    it('should be called', () => {
      const e = event('20');

      wrapper.simulate('change', e);

      expect(onChange).toHaveBeenCalledWith('1', e.target.value);
    });
  });
});
