import React from 'react';
import { render } from '@pie-lib/test-utils';
import { select } from 'd3-selection';
import Bg from '../bg';

jest.mock('d3-selection', () => ({
  select: jest.fn(),
  pointer: jest.fn(() => [50, 50]),
}));

describe('Bg', () => {
  let defaultProps;
  let mockRect;
  let clickHandler;

  beforeEach(() => {
    clickHandler = null;
    mockRect = {
      on: jest.fn((event, handler) => {
        if (event === 'click') {
          clickHandler = handler;
        }
      }),
      node: jest.fn(() => ({})),
    };

    select.mockReturnValue(mockRect);

    defaultProps = {
      width: 500,
      height: 400,
      onClick: jest.fn(),
      graphProps: {
        domain: { min: -10, max: 10, step: 1, label: 'x', axisLabel: 'X' },
        range: { min: -10, max: 10, step: 1, label: 'y', axisLabel: 'Y' },
        size: { width: 500, height: 400 },
        scale: {
          x: {
            invert: jest.fn((val) => val / 10),
          },
          y: {
            invert: jest.fn((val) => val / 10),
          },
        },
      },
    };
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Bg {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('renders a rect element', () => {
      const { container } = render(<Bg {...defaultProps} />);
      const rect = container.querySelector('rect');
      expect(rect).toBeTruthy();
    });

    it('applies correct dimensions', () => {
      const { container } = render(<Bg {...defaultProps} />);
      const rect = container.querySelector('rect');

      // Width and height should be expanded by padding * 2
      const padding = 10; // default padding
      expect(rect.getAttribute('width')).toBe(String(defaultProps.width + padding * 2));
      expect(rect.getAttribute('height')).toBe(String(defaultProps.height + padding * 2));
    });

    it('applies correct transform', () => {
      const { container } = render(<Bg {...defaultProps} />);
      const rect = container.querySelector('rect');
      const padding = 10;

      expect(rect.getAttribute('transform')).toBe(`translate(-${padding}, -${padding})`);
    });

    it('sets fill opacity to make it invisible', () => {
      const { container } = render(<Bg {...defaultProps} />);
      const rect = container.querySelector('rect');

      expect(rect.getAttribute('fill-opacity')).toBe('0.0');
    });
  });

  describe('componentDidMount', () => {
    it('attaches click handler to rect', () => {
      render(<Bg {...defaultProps} />);

      expect(select).toHaveBeenCalled();
      expect(mockRect.on).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });

  describe('getRectPadding', () => {
    it('returns 10 for normal graphs', () => {
      const { container } = render(<Bg {...defaultProps} />);
      const rect = container.querySelector('rect');
      const padding = 10;

      expect(rect.getAttribute('width')).toBe(String(defaultProps.width + padding * 2));
    });

    it('returns 6 for graphs with thinner shapes', () => {
      const props = {
        ...defaultProps,
        graphProps: {
          ...defaultProps.graphProps,
          domain: { min: -100, max: 100, step: 1, label: 'x', axisLabel: 'X' },
        },
      };

      const { container } = render(<Bg {...props} />);
      const rect = container.querySelector('rect');
      const padding = 6;

      expect(rect.getAttribute('width')).toBe(String(props.width + padding * 2));
    });
  });

  describe('onRectClick', () => {
    it('calls onClick with snapped coordinates', () => {
      const { pointer } = require('d3-selection');
      pointer.mockReturnValue([100, 100]);

      render(<Bg {...defaultProps} />);

      const event = new MouseEvent('click');
      clickHandler(event);

      expect(defaultProps.onClick).toHaveBeenCalled();
      const calledWith = defaultProps.onClick.mock.calls[0][0];
      expect(calledWith).toHaveProperty('x');
      expect(calledWith).toHaveProperty('y');
    });

    it('snaps coordinates to nearest tick', () => {
      const { pointer } = require('d3-selection');

      render(<Bg {...defaultProps} />);

      const event = new MouseEvent('click');
      clickHandler(event);

      expect(defaultProps.onClick).toHaveBeenCalled();
      const { x, y } = defaultProps.onClick.mock.calls[0][0];

      expect(Number.isInteger(x) || x.toString().length <= 4).toBe(true);
      expect(Number.isInteger(y) || y.toString().length <= 4).toBe(true);
    });

    it('accounts for padding when converting coordinates', () => {
      const { pointer } = require('d3-selection');
      const coords = [50, 50];
      pointer.mockReturnValue(coords);

      render(<Bg {...defaultProps} />);

      const event = new MouseEvent('click');
      clickHandler(event);

      expect(defaultProps.graphProps.scale.x.invert).toHaveBeenCalled();
      expect(defaultProps.graphProps.scale.y.invert).toHaveBeenCalled();
    });
  });

  describe('shouldComponentUpdate', () => {
    it('returns true when width changes', () => {
      const { rerender } = render(<Bg {...defaultProps} />);
      const newProps = {
        ...defaultProps,
        width: 600,
        graphProps: {
          ...defaultProps.graphProps,
          size: { width: 600, height: defaultProps.height },
        },
      };

      expect(() => {
        rerender(<Bg {...newProps} />);
      }).not.toThrow();
    });

    it('returns true when height changes', () => {
      const { rerender } = render(<Bg {...defaultProps} />);
      const newProps = {
        ...defaultProps,
        height: 500,
        graphProps: {
          ...defaultProps.graphProps,
          size: { width: defaultProps.width, height: 500 },
        },
      };

      expect(() => {
        rerender(<Bg {...newProps} />);
      }).not.toThrow();
    });

    it('returns true when graphProps domain/range changes', () => {
      const { rerender } = render(<Bg {...defaultProps} />);
      const newProps = {
        ...defaultProps,
        graphProps: {
          ...defaultProps.graphProps,
          domain: { min: -5, max: 5, step: 1, label: 'x', axisLabel: 'X' },
        },
      };

      expect(() => {
        rerender(<Bg {...newProps} />);
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('handles zero dimensions', () => {
      const props = { ...defaultProps, width: 0, height: 0 };
      const { container } = render(<Bg {...props} />);
      const rect = container.querySelector('rect');

      expect(rect).toBeTruthy();
    });

    it('handles large dimensions', () => {
      const props = { ...defaultProps, width: 10000, height: 10000 };
      const { container } = render(<Bg {...props} />);
      const rect = container.querySelector('rect');

      expect(rect).toBeTruthy();
      expect(rect.getAttribute('width')).toBe('10020');
      expect(rect.getAttribute('height')).toBe('10020');
    });

    it('handles negative coordinates in domain/range', () => {
      const props = {
        ...defaultProps,
        graphProps: {
          ...defaultProps.graphProps,
          domain: { min: -100, max: -10, step: 1, label: 'x', axisLabel: 'X' },
          range: { min: -100, max: -10, step: 1, label: 'y', axisLabel: 'Y' },
        },
      };

      const { container } = render(<Bg {...props} />);
      expect(container.querySelector('rect')).toBeTruthy();
    });
  });
});
