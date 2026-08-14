import React from 'react';
import { render } from '@testing-library/react';
import MathPreview from '../math-preview';

/** Every rule emotion has injected so far, as CSSStyleRule objects. */
const injectedRules = () =>
  Array.from(document.querySelectorAll('style[data-emotion]'))
    .flatMap((tag) => (tag.sheet ? Array.from(tag.sheet.cssRules) : []))
    .filter((rule) => rule.selectorText);

/**
 * The `.ML__latex` rule that actually applies to `element`.
 *
 * Matching with `element.matches` rather than string comparison means the
 * assertions cover the selector too: a rule written as `& > .ML__latex` would
 * not match the nested markup MathLive emits, and these tests would fail.
 */
const mathLiveRuleFor = (element) =>
  injectedRules().find((rule) => rule.selectorText.includes('.ML__latex') && element.matches(rule.selectorText));

/**
 * Stand in for MathLive's `convertLatexToMarkup` output, which is
 * `<span class="ML__latex">...</span>` nested inside `mf.Static`'s holder span.
 * MathLive does not load under jsdom, so the markup is added by hand.
 */
const addStaticMarkup = (container, depth = 1) => {
  let parent = container.firstChild;

  for (let i = 1; i < depth; i += 1) {
    const wrapper = document.createElement('span');

    parent.appendChild(wrapper);
    parent = wrapper;
  }

  const markup = document.createElement('span');

  markup.className = 'ML__latex';
  parent.appendChild(markup);

  return markup;
};

describe('MathPreview', () => {
  const defaultProps = {
    latex: 'sqrt(5)',
    classes: {},
    isSelected: false,
    onFocus: jest.fn(),
    onBlur: jest.fn(),
  };

  it('renders with default props', () => {
    const { container } = render(<MathPreview {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  describe('MathLive static markup', () => {
    it('is outlined and padded when not selected', () => {
      const { container } = render(<MathPreview {...defaultProps} isSelected={false} />);
      const rule = mathLiveRuleFor(addStaticMarkup(container));

      expect(rule).toBeDefined();
      expect(rule.style.getPropertyValue('border')).toEqual('solid 1px lightgrey');
      expect(rule.style.getPropertyValue('padding')).toEqual('5px');
    });

    it('drops its outline and padding when selected, so only the container border shows', () => {
      const { container } = render(<MathPreview {...defaultProps} isSelected />);
      const rule = mathLiveRuleFor(addStaticMarkup(container));

      expect(rule).toBeDefined();
      expect(rule.style.getPropertyValue('border')).toEqual('solid 0px lightgrey');
      expect(rule.style.getPropertyValue('padding')).toEqual('0px');
    });

    it('is styled at any depth below the container, not just as a direct child', () => {
      const { container } = render(<MathPreview {...defaultProps} isSelected={false} />);

      expect(mathLiveRuleFor(addStaticMarkup(container, 3))).toBeDefined();
    });
  });
});
