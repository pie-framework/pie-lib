import React from 'react';
import { mount } from 'enzyme';
import Purpose from '../purpose';

describe('Purpose', () => {
  let wrapper;

  describe('renders fine', () => {
    it('renders child unaltered without purpose prop', () => {
      wrapper = mount(
        <Purpose>
          <div>text</div>
        </Purpose>
      );
      expect(wrapper.find('div')).toHaveLength(1);
      expect(wrapper.html().includes('data-pie-purpose=""')).toEqual(false);
      expect(wrapper.html().includes('text')).toEqual(true);
      expect(wrapper).toMatchSnapshot();
    });
    it('renders child unaltered', () => {
      wrapper = mount(
        <Purpose purpose="passage">
          <div>text</div>
        </Purpose>
      );
      expect(wrapper.find('div')).toHaveLength(1);
      expect(wrapper.html().includes('data-pie-purpose="passage"')).toEqual(true);
      expect(wrapper.html().includes('text')).toEqual(true);
      expect(wrapper).toMatchSnapshot();
    });
    it('renders children unaltered', () => {
      wrapper = mount(
        <Purpose purpose="something">
          <div>
            <div>text1</div>
            <div>text2</div>
          </div>
        </Purpose>
      );
      expect(wrapper.find('div')).toHaveLength(3);
      expect(wrapper.html().includes('data-pie-purpose="something"')).toEqual(true);
      expect(wrapper.html().includes('text1')).toEqual(true);
      expect(wrapper.html().includes('text3')).toEqual(false);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
