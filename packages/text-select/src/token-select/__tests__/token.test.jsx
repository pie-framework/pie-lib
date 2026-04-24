import React from 'react';
import { render } from '@testing-library/react';
import { Token } from '../token';

describe('token', () => {
  const defaultProps = {
    classes: {
      token: 'token',
      selectable: 'selectable',
    },
    text: 'foo bar',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders with text', () => {
      const { container } = render(<Token {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with newlines', () => {
      const { container } = render(<Token {...defaultProps} text="foo \nbar" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with multiple newlines', () => {
      const { container } = render(<Token {...defaultProps} text="line1\nline2\nline3" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(<Token {...defaultProps} className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('renders with data-indexkey attribute', () => {
      const { container } = render(<Token {...defaultProps} index={5} />);
      const token = container.querySelector('[data-indexkey]');
      expect(token).toHaveAttribute('data-indexkey', '5');
    });

    it('renders empty text gracefully', () => {
      const { container } = render(<Token {...defaultProps} text="" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders null text gracefully', () => {
      const { container } = render(<Token {...defaultProps} text={null} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('selectable state', () => {
    it('applies selectable class when selectable is true', () => {
      const { container } = render(<Token {...defaultProps} selectable={true} />);
      expect(container.querySelector('.selectable')).toBeInTheDocument();
    });

    it('does not apply selectable class when selectable is false', () => {
      const { container } = render(<Token {...defaultProps} selectable={false} />);
      expect(container.querySelector('.selectable')).not.toBeInTheDocument();
    });

    it('does not apply selectable class when disabled', () => {
      const { container } = render(<Token {...defaultProps} selectable={true} disabled={true} />);
      expect(container.querySelector('.selectable')).not.toBeInTheDocument();
    });
  });

  describe('selected state', () => {
    it('applies selected class when selected is true', () => {
      const { container } = render(<Token {...defaultProps} selected={true} />);
      expect(container.querySelector('.selected')).toBeInTheDocument();
    });

    it('does not apply selected class when selected is false', () => {
      const { container } = render(<Token {...defaultProps} selected={false} />);
      expect(container.querySelector('.selected')).not.toBeInTheDocument();
    });

    it('applies disabledBlack class when selected and disabled without correct prop', () => {
      const { container } = render(<Token {...defaultProps} selected={true} disabled={true} />);
      expect(container.querySelector('.disabledBlack')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('applies disabled class when disabled is true', () => {
      const { container } = render(<Token {...defaultProps} disabled={true} />);
      expect(container.querySelector('.disabled')).toBeInTheDocument();
    });

    it('does not apply disabled class when disabled is false', () => {
      const { container } = render(<Token {...defaultProps} disabled={false} />);
      expect(container.querySelector('.disabled')).not.toBeInTheDocument();
    });
  });

  describe('highlight state', () => {
    it('applies highlight class when highlight is true and selectable', () => {
      const { container } = render(<Token {...defaultProps} highlight={true} selectable={true} />);
      expect(container.querySelector('.highlight')).toBeInTheDocument();
    });

    it('does not apply highlight class when not selectable', () => {
      const { container } = render(<Token {...defaultProps} highlight={true} selectable={false} />);
      expect(container.querySelector('.highlight')).not.toBeInTheDocument();
    });

    it('does not apply highlight class when disabled', () => {
      const { container } = render(<Token {...defaultProps} highlight={true} selectable={true} disabled={true} />);
      expect(container.querySelector('.highlight')).not.toBeInTheDocument();
    });

    it('does not apply highlight class when selected', () => {
      const { container } = render(<Token {...defaultProps} highlight={true} selectable={true} selected={true} />);
      expect(container.querySelector('.highlight')).not.toBeInTheDocument();
    });
  });

  describe('correct/incorrect state', () => {
    it('applies custom class when correct is true', () => {
      const { container } = render(<Token {...defaultProps} correct={true} />);
      expect(container.querySelector('.custom')).toBeInTheDocument();
    });

    it('applies custom class when correct is false', () => {
      const { container } = render(<Token {...defaultProps} correct={false} />);
      expect(container.querySelector('.custom')).toBeInTheDocument();
    });

    it('renders check icon when correct is true', () => {
      const { container } = render(<Token {...defaultProps} correct={true} />);
      const checkIcon = container.querySelector('svg[data-testid="CheckIcon"]');
      expect(checkIcon).toBeInTheDocument();
    });

    it('renders close icon when correct is false', () => {
      const { container } = render(<Token {...defaultProps} correct={false} />);
      const closeIcon = container.querySelector('svg[data-testid="CloseIcon"]');
      expect(closeIcon).toBeInTheDocument();
    });

    it('wraps token in correct container when correct is true', () => {
      const { container } = render(<Token {...defaultProps} correct={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('wraps token in incorrect container when correct is false', () => {
      const { container } = render(<Token {...defaultProps} correct={false} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('missing state', () => {
    it('applies missing class when isMissing is true', () => {
      const { container } = render(<Token {...defaultProps} isMissing={true} />);
      expect(container.querySelector('.missing')).toBeInTheDocument();
    });

    it('renders close icon when isMissing is true', () => {
      const { container } = render(<Token {...defaultProps} isMissing={true} />);
      const closeIcon = container.querySelector('svg[data-testid="CloseIcon"]');
      expect(closeIcon).toBeInTheDocument();
    });

    it('applies custom class when isMissing is true', () => {
      const { container } = render(<Token {...defaultProps} isMissing={true} />);
      expect(container.querySelector('.custom')).toBeInTheDocument();
    });
  });

  describe('animations disabled state', () => {
    it('applies print class when animationsDisabled is true', () => {
      const { container } = render(<Token {...defaultProps} animationsDisabled={true} />);
      expect(container.querySelector('.print')).toBeInTheDocument();
    });

    it('does not apply print class when animationsDisabled is false', () => {
      const { container } = render(<Token {...defaultProps} animationsDisabled={false} />);
      expect(container.querySelector('.print')).not.toBeInTheDocument();
    });
  });

  describe('Wrapper component behavior', () => {
    it('uses wrapper when correct is defined', () => {
      const { container } = render(<Token {...defaultProps} correct={true} />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('uses wrapper when isMissing is true', () => {
      const { container } = render(<Token {...defaultProps} isMissing={true} />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('does not use wrapper when correct is undefined and isMissing is false', () => {
      const { container } = render(<Token {...defaultProps} />);
      const icon = container.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('className combinations', () => {
    it('combines multiple state classes', () => {
      const { container } = render(<Token {...defaultProps} selectable={true} selected={true} highlight={true} />);
      expect(container.querySelector('.selected')).toBeInTheDocument();
    });

    it('applies correct precedence for disabled and selected', () => {
      const { container } = render(<Token {...defaultProps} selectable={true} selected={true} disabled={true} />);
      expect(container.querySelector('.disabledBlack')).toBeInTheDocument();
    });

    it('applies tokenRootClass to all tokens', () => {
      const { container } = render(<Token {...defaultProps} />);
      expect(container.querySelector('.tokenRootClass')).toBeInTheDocument();
    });
  });

  describe('prop defaults', () => {
    it('uses default value for selectable', () => {
      const { container } = render(<Token text="test" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('uses default value for text', () => {
      const { container } = render(<Token />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
