import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UiLayout } from '../index';

describe('UiLayout', () => {
  const mockClasses = { extraCSSRules: 'extra-class' };
  const fontSizeFactor = 1.5;

  // Mock `getComputedStyle` to return a specific root font size.
  beforeAll(() => {
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
      fontSize: '16px', // Default font size for root
    }));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(<UiLayout classes={mockClasses} fontSizeFactor={fontSizeFactor} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies the correct classes', () => {
    const { container } = render(<UiLayout className="custom-class" classes={mockClasses} fontSizeFactor={fontSizeFactor} />);
    const div = container.querySelector('.custom-class');
    expect(div).toBeInTheDocument();
  });

  it('computes style correctly based on fontSizeFactor', () => {
    const { container } = render(<UiLayout classes={mockClasses} fontSizeFactor={fontSizeFactor} />);
    const div = container.firstChild;

    // Get the style property of the rendered div
    const computedStyle = div.style;
    // Assert the computed font size (16px * 1.5 = 24px)
    expect(computedStyle.fontSize).toBe('24px');
  });

  it('renders children when provided', () => {
    const { container } = render(
      <UiLayout classes={mockClasses} fontSizeFactor={fontSizeFactor}>
        <div className="test-child">Test Content</div>
      </UiLayout>,
    );

    expect(container.querySelector('.test-child')).toBeInTheDocument();
  });
});
