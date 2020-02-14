import * as React from 'react';
import { shallow } from 'enzyme';
import { BlankContent as Choice } from '../choice';
import { choice } from '../../__tests__/utils';
import Choices from '../index';

describe('index', () => {
  describe('Choices', () => {
    const defaultProps = {
      disabled: false,
      choices: [choice('Jumped', '0'), choice('Laughed', '1'), choice('Spoon', '2')]
    };
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<Choices {...defaultProps} />);
    });

    it('renders correctly with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with disabled prop as true', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper).toMatchSnapshot();
    });
    it('renders without duplicates', () => {
      wrapper.setProps({ duplicates: undefined, value: { 0: '0', 1: '1' } });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders with duplicates', () => {
      wrapper.setProps({ duplicates: true, value: { 0: '0', 1: '1' } });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Choice', () => {
    const defaultProps = {
      disabled: false,
      value: '1',
      label: 'Label',
      targetId: '1'
    };
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<Choice {...defaultProps} />);
    });

    describe('render', () => {
      it('renders correctly with default props', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('renders correctly with disabled prop as true', () => {
        wrapper.setProps({ disabled: true });
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
