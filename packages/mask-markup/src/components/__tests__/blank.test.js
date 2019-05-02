import * as React from 'react';
import { shallow } from 'enzyme';
import { BlankContent as Blank } from '../blank';

describe('Blank', () => {
  const onChange = jest.fn();
  const defaultProps = {
    disabled: false,
    value: 'Cow',
    classes: {},
    isOver: false,
    dragItem: {},
    correct: false,
    onChange
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Blank {...defaultProps} />);
  });

  describe('render', () => {
    it('renders correctly with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with disabled prop as true', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with draggedItem', () => {
      wrapper.setProps({ dragItem: {} });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with draggedItem and isOver', () => {
      wrapper.setProps({ dragItem: { value: 'Dog' }, isOver: true });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('onDelete', () => {
    it('should be undefined if disabled is true', () => {
      wrapper.setProps({ disabled: true });

      expect(wrapper.props().onDelete).toEqual(undefined);
    });

    it('should be undefined if no value is set', () => {
      wrapper.setProps({ disabled: false, value: undefined });

      expect(wrapper.props().onDelete).toEqual(undefined);
    });
  });
});
