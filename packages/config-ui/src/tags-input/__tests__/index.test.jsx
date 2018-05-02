import { TagsInput } from '../index';
import toJson from 'enzyme-to-json';
import { shallow, mount } from 'enzyme';
import React from 'react';

describe('TagsInput', () => {
  describe('snapshots', () => {
    it('renders', () => {
      const wrapper = mount(
        <TagsInput
          classes={{ tagsInput: 'tagsInput' }}
          tags={['foo']}
          onChange={jest.fn()}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let onChange;
    const mkWrapper = () => {
      onChange = jest.fn();
      return shallow(
        <TagsInput onChange={onChange} classes={{}} tags={['foo']} />
      );
    };

    describe('onFocus', () => {
      it('sets state.focused = true', () => {
        const wrapper = mkWrapper();
        wrapper.instance().onFocus();
        expect(wrapper.state('focused')).toEqual(true);
      });
    });

    describe('onBlur', () => {
      it('sets state.focused = false', () => {
        const wrapper = mkWrapper();
        wrapper.instance().onFocus();
        wrapper.instance().onBlur();
        expect(wrapper.state('focused')).toEqual(false);
      });
    });

    describe('onChange', () => {
      it('sets state.value  ', () => {
        const wrapper = mkWrapper();
        wrapper.instance().onChange({ target: { value: 'boo' } });
        expect(wrapper.state('value')).toEqual('boo');
      });
    });

    describe('onKeyDown', () => {
      it('calls onChange on enter', () => {
        const wrapper = mkWrapper();
        wrapper.setState({ value: 'banana' });
        wrapper.instance().onKeyDown({ keyCode: 13 });
        expect(onChange).toBeCalledWith(['foo', 'banana']);
      });

      it('doesnt calls onChange on enter if the value is the same as a value in tags', () => {
        const wrapper = mkWrapper();
        wrapper.setState({ value: 'foo' });
        wrapper.instance().onKeyDown({ keyCode: 13 });
        expect(onChange).not.toBeCalled();
      });
    });
  });
});
