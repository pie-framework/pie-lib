import * as React from 'react';
import { shallow } from 'enzyme';
import { choice } from '../../__tests__/utils';
import Dropdown from '../dropdown';

describe('Dropdown', () => {
  const onChange = jest.fn();
  const defaultProps = {
    onChange,
    id: '1',
    correct: false,
    disabled: false,
    value: 'Jumped',
    choices: [choice('Jumped'), choice('Laughed'), choice('Smiled')]
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Dropdown {...defaultProps} />);
  });

  describe('render', () => {
    it('renders correctly with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with disabled prop as true', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with correct as true', () => {
      wrapper.setProps({ correct: true });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    const event = value => ({
      target: { value }
    });

    it('should be called with an appropriate value', () => {
      const e = event('Laughed');

      wrapper.simulate('change', e);

      expect(onChange).toHaveBeenCalledWith('1', e.target.value);
    });
  });
});
