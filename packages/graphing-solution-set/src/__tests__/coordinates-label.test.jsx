import React from 'react';
import { render } from '@pie-lib/test-utils';
import { CoordinatesLabel, getLabelPosition } from '../coordinates-label';

describe('CoordinatesLabel', () => {
  let defaultProps;
  let graphProps;

  beforeEach(() => {
    graphProps = {
      domain: { min: -10, max: 10, step: 1, label: 'x', axisLabel: 'X' },
      range: { min: -10, max: 10, step: 1, label: 'y', axisLabel: 'Y' },
      scale: {
        x: jest.fn((val) => (val + 10) * 20),
        y: jest.fn((val) => (10 - val) * 20),
      },
    };

    defaultProps = {
      x: 5,
      y: 5,
      graphProps,
    };
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<CoordinatesLabel {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('displays formatted coordinates', () => {
      const { container } = render(<CoordinatesLabel {...defaultProps} />);
      const input = container.querySelector('input');

      expect(input.value).toBe('(5, 5)');
    });

    it('rounds coordinates to 4 decimal places', () => {
      const props = { ...defaultProps, x: 1.123456, y: 2.987654 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const input = container.querySelector('input');

      expect(input.value).toBe('(1.1235, 2.9877)');
    });

    it('handles integer coordinates', () => {
      const props = { ...defaultProps, x: 0, y: 0 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const input = container.querySelector('input');

      expect(input.value).toBe('(0, 0)');
    });

    it('handles negative coordinates', () => {
      const props = { ...defaultProps, x: -3, y: -7 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const input = container.querySelector('input');

      expect(input.value).toBe('(-3, -7)');
    });

    it('renders as an input element', () => {
      const { container } = render(<CoordinatesLabel {...defaultProps} />);
      const input = container.querySelector('input');

      expect(input).toBeTruthy();
      expect(input.tagName).toBe('INPUT');
    });

    it('applies correct styles', () => {
      const { container } = render(<CoordinatesLabel {...defaultProps} />);
      const wrapper = container.firstChild;

      expect(wrapper).toHaveStyle({ position: 'absolute' });
      expect(wrapper).toHaveStyle({ pointerEvents: 'auto' });
    });
  });

  describe('getLabelPosition', () => {
    it('positions label to the right by default', () => {
      const position = getLabelPosition(graphProps, 0, 0, 60);

      expect(position.left).toBeGreaterThan(graphProps.scale.x(0));
      expect(position.top).toBeDefined();
    });

    it('positions label to the left when near right edge', () => {
      const x = 9; // Near max
      const labelLength = 100;
      const position = getLabelPosition(graphProps, x, 0, labelLength);

      expect(position.left).toBeLessThan(graphProps.scale.x(x));
    });

    it('adjusts top position for minimum y value', () => {
      const position = getLabelPosition(graphProps, 0, -10, 60);

      expect(position.top).toBe(graphProps.scale.y(-10) - 16);
    });

    it('adjusts top position for maximum y value', () => {
      const position = getLabelPosition(graphProps, 0, 10, 60);

      expect(position.top).toBe(graphProps.scale.y(10) - 0);
    });

    it('centers label vertically for middle values', () => {
      const position = getLabelPosition(graphProps, 0, 0, 60);

      expect(position.top).toBe(graphProps.scale.y(0) - 8);
    });

    it('applies left shift consistently', () => {
      const leftShift = 10;
      const labelLength = 60;

      const rightPos = getLabelPosition(graphProps, 0, 0, labelLength);
      expect(rightPos.left).toBe(graphProps.scale.x(0) + leftShift);

      const leftPos = getLabelPosition(graphProps, 9, 0, labelLength);
      expect(leftPos.left).toBe(graphProps.scale.x(9) - leftShift - labelLength);
    });
  });

  describe('label width calculation', () => {
    it('calculates width based on label length', () => {
      const props = { ...defaultProps, x: 1, y: 2 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const wrapper = container.firstChild;

      const expectedWidth = 6 * 6;
      expect(wrapper).toHaveStyle({ width: `${expectedWidth}px` });
    });

    it('adjusts width for longer coordinates', () => {
      const props = { ...defaultProps, x: -10.123, y: 10.456 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const wrapper = container.firstChild;

      const style = window.getComputedStyle(wrapper);
      expect(parseInt(style.width)).toBeGreaterThan(42);
    });
  });

  describe('edge cases', () => {
    it('handles very small coordinates', () => {
      const props = { ...defaultProps, x: 0.0001, y: 0.0002 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const input = container.querySelector('input');

      expect(input.value).toContain('(');
      expect(input.value).toContain(')');
      expect(input.value).toContain(',');
    });

    it('handles very large coordinates', () => {
      const props = { ...defaultProps, x: 999999, y: 888888 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const input = container.querySelector('input');

      expect(input.value).toBe('(999999, 888888)');
    });

    it('handles zero coordinates', () => {
      const props = { ...defaultProps, x: 0, y: 0 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const input = container.querySelector('input');

      expect(input.value).toBe('(0, 0)');
    });

    it('handles coordinates at domain/range boundaries', () => {
      const props = { ...defaultProps, x: 10, y: 10 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const input = container.querySelector('input');

      expect(input.value).toBe('(10, 10)');
    });

    it('handles negative boundaries', () => {
      const props = { ...defaultProps, x: -10, y: -10 };
      const { container } = render(<CoordinatesLabel {...props} />);
      const input = container.querySelector('input');

      expect(input.value).toBe('(-10, -10)');
    });
  });

  describe('prop types and validation', () => {
    it('accepts required props', () => {
      expect(() => {
        render(<CoordinatesLabel {...defaultProps} />);
      }).not.toThrow();
    });

    it('renders with missing optional props', () => {
      const props = {
        x: 1,
        y: 2,
        graphProps,
      };

      expect(() => {
        render(<CoordinatesLabel {...props} />);
      }).not.toThrow();
    });
  });

  describe('updates', () => {
    it('updates when x coordinate changes', () => {
      const { container, rerender } = render(<CoordinatesLabel {...defaultProps} />);
      let input = container.querySelector('input');
      expect(input.value).toBe('(5, 5)');

      rerender(<CoordinatesLabel {...defaultProps} x={7} />);
      input = container.querySelector('input');
      expect(input.value).toBe('(7, 5)');
    });

    it('updates when y coordinate changes', () => {
      const { container, rerender } = render(<CoordinatesLabel {...defaultProps} />);
      let input = container.querySelector('input');
      expect(input.value).toBe('(5, 5)');

      rerender(<CoordinatesLabel {...defaultProps} y={3} />);
      input = container.querySelector('input');
      expect(input.value).toBe('(5, 3)');
    });

    it('updates position when coordinates change', () => {
      const { container, rerender } = render(<CoordinatesLabel {...defaultProps} />);
      const initialStyle = window.getComputedStyle(container.firstChild);
      const initialLeft = initialStyle.left;

      rerender(<CoordinatesLabel {...defaultProps} x={8} />);
      const newStyle = window.getComputedStyle(container.firstChild);
      const newLeft = newStyle.left;

      expect(newLeft).not.toBe(initialLeft);
    });
  });
});
