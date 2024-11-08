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
    onChange,
  };
  let wrapper;
  let instance;

  beforeEach(() => {
    wrapper = shallow(<Blank {...defaultProps} />);
    instance = wrapper.instance();
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
      wrapper.setProps({ dragItem: { choice: { value: 'Dog' } } });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with draggedItem and isOver', () => {
      wrapper.setProps({ dragItem: { choice: { value: 'Dog' } }, isOver: true });
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

  describe('updateDimensions', () => {
    let span;
    let rootRef;

    const setSpanDimensions = (height, width) => {
      Object.defineProperty(span, 'offsetHeight', { value: height, configurable: true });
      Object.defineProperty(span, 'offsetWidth', { value: width, configurable: true });
    };

    beforeEach(() => {
      wrapper = shallow(<Blank {...defaultProps} />);
      instance = wrapper.instance();

      span = document.createElement('span');
      rootRef = document.createElement('span'); // rootRef should be a span or div in the real component

      instance.spanRef = span;
      instance.rootRef = rootRef; // Attach rootRef

      Object.defineProperty(span, 'offsetHeight', { value: 0, configurable: true });
      Object.defineProperty(span, 'offsetWidth', { value: 0, configurable: true });
    });

    it('should update dimensions if span size exceeds the response area size', () => {
      setSpanDimensions(50, 50);

      instance.updateDimensions();

      expect(instance.state).toEqual({
        width: 74,
        height: 50,
      });
    });

    it('should not update dimensions if span size does not exceed the response area size', () => {
      wrapper.setProps({
        emptyResponseAreaHeight: 50,
        emptyResponseAreaWidth: 50,
      });
      setSpanDimensions(30, 30);

      instance.updateDimensions();

      expect(instance.state).toEqual({
        width: 0,
        height: 0,
      });
    });

    it('should handle non-numeric emptyResponseAreaHeight and emptyResponseAreaWidth', () => {
      wrapper.setProps({
        emptyResponseAreaHeight: 'non-numeric',
        emptyResponseAreaWidth: 'non-numeric',
      });
      setSpanDimensions(50, 50);

      instance.updateDimensions();

      expect(instance.state).toEqual({
        width: 74,
        height: 50,
      });
    });
  });

  describe('getRootDimensions', () => {
    it('should return state dimensions if set', () => {
      instance.setState({ height: 50, width: 50 });

      const dimensions = instance.getRootDimensions();

      expect(dimensions).toEqual({
        height: 50,
        width: 50,
        minWidth: 90,
        minHeight: 32,
      });
    });

    it('should return state height and props width if state width is not set', () => {
      instance.setState({ height: 50, width: 0 });

      const dimensions = instance.getRootDimensions();

      expect(dimensions).toEqual({
        height: 50,
        width: 0,
        minWidth: 90,
        minHeight: 32,
      });
    });

    it('should return props height and state width if state height is not set', () => {
      instance.setState({ height: 0, width: 50 });

      const dimensions = instance.getRootDimensions();

      expect(dimensions).toEqual({
        height: 0,
        width: 50,
        minWidth: 90,
        minHeight: 32,
      });
    });

    it('should return props dimensions if state dimensions are zero', () => {
      instance.setState({ height: 0, width: 0 });
      wrapper.setProps({ emptyResponseAreaHeight: 60, emptyResponseAreaWidth: 60 });

      const dimensions = instance.getRootDimensions();

      expect(dimensions).toEqual({
        height: 60,
        width: 60,
      });
    });

    it('should return state dimensions over props dimensions if both are set', () => {
      instance.setState({ height: 50, width: 50 });
      wrapper.setProps({ emptyResponseAreaHeight: 60, emptyResponseAreaWidth: 60 });

      const dimensions = instance.getRootDimensions();

      expect(dimensions).toEqual({
        height: 50,
        width: 50,
      });
    });

    it('should return minWidth and minHeight if state and props dimensions are zero or undefined', () => {
      instance.setState({ height: 0, width: 0 });
      wrapper.setProps({ emptyResponseAreaHeight: undefined, emptyResponseAreaWidth: undefined });

      const dimensions = instance.getRootDimensions();

      expect(dimensions).toEqual({
        height: 0,
        width: 0,
        minWidth: 90,
        minHeight: 32,
      });
    });
  });
});
