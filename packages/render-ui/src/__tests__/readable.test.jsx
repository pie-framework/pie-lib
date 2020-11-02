import React from 'react';
import { mount } from 'enzyme';
import Readable from '../readable';

describe('Readable', () => {
  let wrapper;

  describe('renders fine', () => {
    it('renders child unaltered', () => {
      wrapper = mount(
        <Readable>
          <div>text</div>
        </Readable>
      );
      expect(wrapper.find('div')).toHaveLength(1);
      expect(wrapper.html().includes('data-pie-readable="true"')).toEqual(true);
      expect(wrapper.html().includes('text')).toEqual(true);
      expect(wrapper).toMatchSnapshot();
    });
    it('renders children unaltered', () => {
      wrapper = mount(
        <Readable>
          <div>
            <div>text1</div>
            <div>text2</div>
          </div>
        </Readable>
      );
      expect(wrapper.find('div')).toHaveLength(3);
      expect(wrapper.html().includes('data-pie-readable="true"')).toEqual(true);
      expect(wrapper.html().includes('text1')).toEqual(true);
      expect(wrapper.html().includes('text3')).toEqual(false);
      expect(wrapper).toMatchSnapshot();
    });
    it('renders with false tag', () => {
      wrapper = mount(
        <Readable false>
          <div>
            <div>text1</div>
            <div>text2</div>
          </div>
        </Readable>
      );
      expect(wrapper.find('div')).toHaveLength(3);
      expect(wrapper.html().includes('data-pie-readable="false"')).toEqual(true);
      expect(wrapper.html().includes('text1')).toEqual(true);
      expect(wrapper.html().includes('text3')).toEqual(false);
      expect(wrapper).toMatchSnapshot();
    });
    it('renders even with specific true tag', () => {
      wrapper = mount(
        <Readable false={true}>
          <div>
            <div>text1</div>
            <div>text2</div>
          </div>
        </Readable>
      );
      expect(wrapper.find('div')).toHaveLength(3);
      expect(wrapper.html().includes('data-pie-readable="false"')).toEqual(true);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
