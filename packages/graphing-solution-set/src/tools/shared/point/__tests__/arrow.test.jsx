import { render } from '@pie-lib/test-utils';
import React from 'react';
import Arrow from '../arrow';
import { graphProps } from '../../../../__tests__/utils';

jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  thinnerShapesNeeded: jest.fn(() => false),
}));

import { thinnerShapesNeeded } from '../../../../utils';

describe('Arrow', () => {
  let onChange = jest.fn();

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'arrow-class',
      onChange,
      graphProps: graphProps(),
      x: 5,
      y: 10,
      angle: 45,
    };
    const props = { ...defaults, ...extras };
    return render(<Arrow {...props} />);
  };

  beforeEach(() => {
    onChange = jest.fn();
    thinnerShapesNeeded.mockReturnValue(false);
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders a g element with correct class names', () => {
      const { container } = renderComponent({
        classes: { point: 'point-class' },
        className: 'custom-class',
      });
      const gElement = container.querySelector('g');
      expect(gElement).toBeInTheDocument();
      expect(gElement).toHaveClass('point-class');
      expect(gElement).toHaveClass('custom-class');
    });

    it('renders ArrowHead component', () => {
      const { container } = renderComponent();
      const polygon = container.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
    });

    it('applies disabled class when disabled is true', () => {
      const { container } = renderComponent({
        classes: { point: 'point-class', disabled: 'disabled-class' },
        disabled: true,
      });
      const gElement = container.querySelector('g');
      expect(gElement).toHaveClass('disabled-class');
    });

    it('does not apply disabled class when disabled is false', () => {
      const { container } = renderComponent({
        classes: { point: 'point-class', disabled: 'disabled-class' },
        disabled: false,
      });
      const gElement = container.querySelector('g');
      expect(gElement).not.toHaveClass('disabled-class');
    });

    it('applies correctness class when provided', () => {
      const { container } = renderComponent({
        classes: { point: 'point-class', correct: 'correct-class' },
        correctness: 'correct',
      });
      const gElement = container.querySelector('g');
      expect(gElement).toHaveClass('correct-class');
    });

    it('applies incorrect correctness class', () => {
      const { container } = renderComponent({
        classes: { point: 'point-class', incorrect: 'incorrect-class' },
        correctness: 'incorrect',
      });
      const gElement = container.querySelector('g');
      expect(gElement).toHaveClass('incorrect-class');
    });
  });

  describe('size calculation', () => {
    it('uses size 14 when thinnerShapesNeeded returns false', () => {
      thinnerShapesNeeded.mockReturnValue(false);
      const { container } = renderComponent({ x: 0, y: 0 });
      const polygon = container.querySelector('polygon');

      // Expected points: "0,0 -14,-7 -14,7"
      expect(polygon).toHaveAttribute('points');
      const points = polygon.getAttribute('points');
      expect(points).toContain('-14');
    });

    it('uses size 12 when thinnerShapesNeeded returns true', () => {
      thinnerShapesNeeded.mockReturnValue(true);
      const { container } = renderComponent({ x: 0, y: 0 });
      const polygon = container.querySelector('polygon');

      // Expected points: "0,0 -12,-6 -12,6"
      expect(polygon).toHaveAttribute('points');
      const points = polygon.getAttribute('points');
      expect(points).toContain('-12');
    });

    it('calls thinnerShapesNeeded with graphProps', () => {
      const gp = graphProps();
      renderComponent({ graphProps: gp });
      expect(thinnerShapesNeeded).toHaveBeenCalledWith(gp);
    });
  });

  describe('coordinate scaling', () => {
    it('scales x and y coordinates using graphProps.scale', () => {
      const mockScale = {
        x: jest.fn((n) => n * 10),
        y: jest.fn((n) => n * 20),
      };
      const gp = {
        ...graphProps(),
        scale: mockScale,
      };

      renderComponent({ x: 5, y: 10, graphProps: gp });

      expect(mockScale.x).toHaveBeenCalledWith(5);
      expect(mockScale.y).toHaveBeenCalledWith(10);
    });

    it('renders arrow with scaled coordinates', () => {
      const mockScale = {
        x: jest.fn((n) => n * 2),
        y: jest.fn((n) => n * 3),
      };
      const gp = {
        ...graphProps(),
        scale: mockScale,
      };

      const { container } = renderComponent({ x: 5, y: 10, graphProps: gp, angle: 0 });
      const polygon = container.querySelector('polygon');

      // scaledX = 5 * 2 = 10, scaledY = 10 * 3 = 30
      // Expected points: "10,30 -4,23 -4,37" (with size 14)
      const points = polygon.getAttribute('points');
      expect(points).toContain('10');
      expect(points).toContain('30');
    });
  });

  describe('angle rotation', () => {
    it('applies rotation transform with negative angle', () => {
      const { container } = renderComponent({ x: 5, y: 10, angle: 45 });
      const polygon = container.querySelector('polygon');
      const transform = polygon.getAttribute('transform');

      // Angle should be negated: rotate(-45, 5, 10)
      expect(transform).toContain('rotate(-45');
      expect(transform).toContain('5');
      expect(transform).toContain('10');
    });

    it('handles zero angle', () => {
      const { container } = renderComponent({ x: 3, y: 7, angle: 0 });
      const polygon = container.querySelector('polygon');
      const transform = polygon.getAttribute('transform');

      // will convert -0 to 0
      expect(transform).toMatch(/rotate\((-)?0/);
      expect(transform).toContain('3');
      expect(transform).toContain('7');
    });

    it('handles negative angle', () => {
      const { container } = renderComponent({ x: 2, y: 4, angle: -30 });
      const polygon = container.querySelector('polygon');
      const transform = polygon.getAttribute('transform');

      // -(-30) = 30
      expect(transform).toContain('rotate(30');
      expect(transform).toContain('2');
      expect(transform).toContain('4');
    });

    it('handles 360 degree angle', () => {
      const { container } = renderComponent({ x: 1, y: 1, angle: 360 });
      const polygon = container.querySelector('polygon');
      const transform = polygon.getAttribute('transform');

      expect(transform).toContain('rotate(-360');
    });
  });

  describe('arrow points calculation', () => {
    it('calculates correct points for arrow head', () => {
      thinnerShapesNeeded.mockReturnValue(false);
      const { container } = renderComponent({ x: 0, y: 0, angle: 0 });
      const polygon = container.querySelector('polygon');

      // size = 14
      // points = "0,0 -14,-7 -14, 7" (note the space after comma in the template literal)
      const points = polygon.getAttribute('points');
      expect(points).toContain('0,0');
      expect(points).toContain('-14,-7');
      expect(points).toMatch(/-14,\s*7/);
    });

    it('calculates points with scaled coordinates', () => {
      thinnerShapesNeeded.mockReturnValue(false);
      const mockScale = {
        x: jest.fn((n) => n),
        y: jest.fn((n) => n),
      };
      const gp = {
        ...graphProps(),
        scale: mockScale,
      };

      const { container } = renderComponent({ x: 10, y: 20, graphProps: gp });
      const polygon = container.querySelector('polygon');

      // scaledX = 10, scaledY = 20, size = 14
      // points = "10,20 -4,13 -4, 27" (note the space after comma in the template literal)
      const points = polygon.getAttribute('points');
      expect(points).toContain('10,20');
      expect(points).toContain('-4,13');
      expect(points).toMatch(/-4,\s*27/);
    });
  });

  describe('props handling', () => {
    it('passes through additional props to g element', () => {
      const { container } = renderComponent({
        'data-test': 'arrow-test',
        role: 'graphics-symbol',
      });
      const gElement = container.querySelector('g');
      expect(gElement).toHaveAttribute('data-test', 'arrow-test');
      expect(gElement).toHaveAttribute('role', 'graphics-symbol');
    });

    it('excludes filtered props from g element', () => {
      const { container } = renderComponent({
        x: 5,
        y: 10,
        angle: 45,
        disabled: false,
        correctness: 'correct',
        graphProps: graphProps(),
      });
      const gElement = container.querySelector('g');

      // These props should not be passed to the g element
      expect(gElement).not.toHaveAttribute('x');
      expect(gElement).not.toHaveAttribute('y');
      expect(gElement).not.toHaveAttribute('angle');
      expect(gElement).not.toHaveAttribute('disabled');
      expect(gElement).not.toHaveAttribute('correctness');
      expect(gElement).not.toHaveAttribute('graphProps');
    });
  });

  describe('edge cases', () => {
    it('handles zero coordinates', () => {
      const { container } = renderComponent({ x: 0, y: 0, angle: 0 });
      const polygon = container.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
      expect(polygon.getAttribute('points')).toBeTruthy();
      expect(polygon.getAttribute('transform')).toBeTruthy();
    });

    it('handles negative coordinates', () => {
      const { container } = renderComponent({ x: -5, y: -10, angle: 0 });
      const polygon = container.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
      expect(polygon.getAttribute('points')).toBeTruthy();
      expect(polygon.getAttribute('transform')).toBeTruthy();
    });

    it('handles large coordinates', () => {
      const { container } = renderComponent({ x: 1000, y: 2000, angle: 0 });
      const polygon = container.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
    });

    it('handles fractional coordinates', () => {
      const { container } = renderComponent({ x: 3.5, y: 7.25, angle: 22.5 });
      const polygon = container.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
      expect(polygon.getAttribute('transform')).toContain('rotate(-22.5');
    });

    it('renders with empty classes prop', () => {
      const { container } = render(<Arrow x={5} y={10} angle={45} graphProps={graphProps()} classes={{}} />);
      const gElement = container.querySelector('g');
      expect(gElement).toBeInTheDocument();
    });

    it('renders without className prop', () => {
      const { container } = render(<Arrow x={5} y={10} angle={45} graphProps={graphProps()} classes={{}} />);
      const gElement = container.querySelector('g');
      expect(gElement).toBeInTheDocument();
    });
  });

  describe('graphProps integration', () => {
    it('works with different domain and range values', () => {
      const gp = graphProps(-10, 10, -20, 20);
      const { container } = renderComponent({ graphProps: gp });
      expect(container.querySelector('polygon')).toBeInTheDocument();
      expect(thinnerShapesNeeded).toHaveBeenCalledWith(gp);
    });

    it('works with custom size in graphProps', () => {
      const gp = {
        ...graphProps(),
        size: {
          width: 800,
          height: 600,
        },
      };
      const { container } = renderComponent({ graphProps: gp });
      expect(container.querySelector('polygon')).toBeInTheDocument();
    });

    it('handles graphProps with small step values', () => {
      const gp = {
        ...graphProps(),
        domain: { min: 0, max: 10, step: 0.1 },
        range: { min: 0, max: 10, step: 0.1 },
      };
      thinnerShapesNeeded.mockReturnValue(true);
      const { container } = renderComponent({ graphProps: gp });
      const polygon = container.querySelector('polygon');

      // Should use size 12 for thinner shapes
      expect(polygon).toBeInTheDocument();
      expect(thinnerShapesNeeded).toHaveBeenCalledWith(gp);
    });
  });

  describe('multiple correctness states', () => {
    it('handles partial correctness', () => {
      const { container } = renderComponent({
        classes: { point: 'point-class', partial: 'partial-class' },
        correctness: 'partial',
      });
      const gElement = container.querySelector('g');
      expect(gElement).toHaveClass('partial-class');
    });

    it('handles undefined correctness', () => {
      const { container } = renderComponent({
        classes: { point: 'point-class' },
        correctness: undefined,
      });
      const gElement = container.querySelector('g');
      expect(gElement).toHaveClass('point-class');
    });

    it('handles null correctness', () => {
      const { container } = renderComponent({
        classes: { point: 'point-class' },
        correctness: null,
      });
      const gElement = container.querySelector('g');
      expect(gElement).toHaveClass('point-class');
    });
  });

  describe('combined states', () => {
    it('handles disabled and correct states together', () => {
      const { container } = renderComponent({
        classes: {
          point: 'point-class',
          disabled: 'disabled-class',
          correct: 'correct-class',
        },
        disabled: true,
        correctness: 'correct',
      });
      const gElement = container.querySelector('g');
      expect(gElement).toHaveClass('point-class');
      expect(gElement).toHaveClass('disabled-class');
      expect(gElement).toHaveClass('correct-class');
    });

    it('handles disabled and incorrect states together', () => {
      const { container } = renderComponent({
        classes: {
          point: 'point-class',
          disabled: 'disabled-class',
          incorrect: 'incorrect-class',
        },
        disabled: true,
        correctness: 'incorrect',
      });
      const gElement = container.querySelector('g');
      expect(gElement).toHaveClass('point-class');
      expect(gElement).toHaveClass('disabled-class');
      expect(gElement).toHaveClass('incorrect-class');
    });
  });

  describe('re-rendering', () => {
    it('updates when x coordinate changes', () => {
      const { container, rerender } = renderComponent({ x: 5, y: 10, angle: 0 });
      let polygon = container.querySelector('polygon');
      const initialPoints = polygon.getAttribute('points');

      rerender(<Arrow x={15} y={10} angle={0} graphProps={graphProps()} classes={{}} className="arrow-class" />);

      polygon = container.querySelector('polygon');
      const newPoints = polygon.getAttribute('points');
      expect(newPoints).not.toBe(initialPoints);
    });

    it('updates when y coordinate changes', () => {
      const { container, rerender } = renderComponent({ x: 5, y: 10, angle: 0 });
      let polygon = container.querySelector('polygon');
      const initialPoints = polygon.getAttribute('points');

      rerender(<Arrow x={5} y={20} angle={0} graphProps={graphProps()} classes={{}} className="arrow-class" />);

      polygon = container.querySelector('polygon');
      const newPoints = polygon.getAttribute('points');
      expect(newPoints).not.toBe(initialPoints);
    });

    it('updates when angle changes', () => {
      const { container, rerender } = renderComponent({ x: 5, y: 10, angle: 0 });
      let polygon = container.querySelector('polygon');
      const initialTransform = polygon.getAttribute('transform');

      rerender(<Arrow x={5} y={10} angle={90} graphProps={graphProps()} classes={{}} className="arrow-class" />);

      polygon = container.querySelector('polygon');
      const newTransform = polygon.getAttribute('transform');
      expect(newTransform).not.toBe(initialTransform);
      expect(newTransform).toContain('rotate(-90');
    });

    it('updates when thinnerShapesNeeded result changes', () => {
      thinnerShapesNeeded.mockReturnValue(false);
      const { container, rerender } = renderComponent({ x: 0, y: 0, angle: 0 });
      let polygon = container.querySelector('polygon');
      const initialPoints = polygon.getAttribute('points');

      thinnerShapesNeeded.mockReturnValue(true);
      rerender(<Arrow x={0} y={0} angle={0} graphProps={graphProps()} classes={{}} className="arrow-class" />);

      polygon = container.querySelector('polygon');
      const newPoints = polygon.getAttribute('points');
      // Points should change due to size change (14 vs 12)
      expect(newPoints).not.toBe(initialPoints);
    });
  });
});
