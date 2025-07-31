import React from 'react';
import { mount, shallow } from 'enzyme';
import { UiLayout } from '../index';

describe('UiLayout', () => {
  let wrapper;
  const mockClasses = { extraCSSRules: 'extra-class' };
  const fontSizeFactor = 1.5;

  // Mock `getComputedStyle` to return a specific root font size.
  jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
    fontSize: '16px', // Default font size for root
  }));

  wrapper = mount(<UiLayout classes={mockClasses} fontSizeFactor={fontSizeFactor} />);

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('applies the correct classes', () => {
    const div = wrapper.find('.extra-class');
    expect(div.exists()).toBe(true);
  });

  it('computes style correctly based on fontSizeFactor', () => {
    const div = wrapper.find('.extra-class');

    // Get the style property of the rendered div
    const computedStyle = div.getDOMNode().style;
    // Assert the computed font size
    expect(computedStyle.fontSize).toBe('24px');
  });
});
