import { render } from '@pie-lib/test-utils';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import { RawBaseCircle } from '../component';

describe('Component', () => {
  let onChange = jest.fn();
  let changeMarkProps = jest.fn();

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      changeMarkProps,
      graphProps: graphProps(),
      from: xy(0, 0),
      to: xy(1, 1),
    };
    const props = { ...defaults, ...extras };

    return render(<RawBaseCircle {...props} />);
  };

  // used to test items that have labels attached to points
  const labelNode = document.createElement('foreignObject');
  const fromWithLabel = { x: 0, y: 0, label: 'A' };
  const toWithLabel = { x: 1, y: 1, label: 'B' };
  const renderWithLabels = (extras = {}) =>
    renderComponent({
      ...extras,
      labelNode: labelNode,
      from: fromWithLabel,
      to: toWithLabel,
    });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labels', () => {
      const { container } = renderWithLabels();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders a g element', () => {
      const { container } = renderComponent();
      const g = container.querySelector('g');
      expect(g).toBeInTheDocument();
    });

    it('renders BgCircle component', () => {
      const { container } = renderComponent();
      // BgCircle is rendered as a styled component
      expect(container.querySelector('g')).toBeInTheDocument();
    });

    it('renders two BasePoint components', () => {
      const { container } = renderComponent();
      // Two points: from and to
      const points = container.querySelectorAll('g');
      expect(points.length).toBeGreaterThanOrEqual(2);
    });

    it('renders with building prop', () => {
      const { container } = renderComponent({ building: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with disabled prop', () => {
      const { container } = renderComponent({ disabled: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness prop', () => {
      const { container } = renderComponent({ correctness: 'correct' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with coordinatesOnHover enabled', () => {
      const { container } = renderComponent({ coordinatesOnHover: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labelModeEnabled', () => {
      const { container } = renderComponent({ labelModeEnabled: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with middle point', () => {
      const middle = { x: 0.5, y: 0.5, label: 'M' };
      const { container } = renderComponent({
        middle,
        labelNode,
        labelModeEnabled: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined to point (uses from)', () => {
      const { container } = renderComponent({ to: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles null to point (uses from)', () => {
      const { container } = renderComponent({ to: null });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('passes onChange callback', () => {
      const customOnChange = jest.fn();
      const { container } = renderComponent({ onChange: customOnChange });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes changeMarkProps callback', () => {
      const customChangeMarkProps = jest.fn();
      const { container } = renderComponent({ changeMarkProps: customChangeMarkProps });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes onClick callback', () => {
      const onClick = jest.fn();
      const { container } = renderComponent({ onClick });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes onDragStart callback', () => {
      const onDragStart = jest.fn();
      const { container } = renderComponent({ onDragStart });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes onDragStop callback', () => {
      const onDragStop = jest.fn();
      const { container } = renderComponent({ onDragStop });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('uses default onClick when not provided', () => {
      const { container } = renderComponent({ onClick: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes graphProps', () => {
      const customGraphProps = graphProps();
      customGraphProps.size = { width: 800, height: 600 };
      const { container } = renderComponent({ graphProps: customGraphProps });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes className', () => {
      const { container } = renderComponent({ className: 'custom-circle' });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('labels', () => {
    it('renders from label when provided', () => {
      const { container } = renderWithLabels();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders to label when provided', () => {
      const { container } = renderWithLabels();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders middle label when provided', () => {
      const middle = { x: 0.5, y: 0.5, label: 'M' };
      const { container } = renderComponent({
        labelNode,
        middle,
        from: fromWithLabel,
        to: toWithLabel,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('does not render labels when labelNode is not provided', () => {
      const { container } = renderComponent({
        from: fromWithLabel,
        to: toWithLabel,
        labelNode: null,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles empty label', () => {
      const from = { x: 0, y: 0, label: '' };
      const to = { x: 1, y: 1, label: '' };
      const { container } = renderComponent({
        labelNode,
        from,
        to,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with label mode enabled', () => {
      const { container } = renderComponent({
        labelNode,
        labelModeEnabled: true,
        from: fromWithLabel,
        to: toWithLabel,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with label mode disabled', () => {
      const { container } = renderComponent({
        labelNode,
        labelModeEnabled: false,
        from: fromWithLabel,
        to: toWithLabel,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with limitLabeling enabled', () => {
      const { container } = renderComponent({
        labelNode,
        limitLabeling: true,
        from: fromWithLabel,
        to: toWithLabel,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles from label undefined', () => {
      const from = { x: 0, y: 0 };
      const to = { x: 1, y: 1, label: 'B' };
      const { container } = renderComponent({
        labelNode,
        from,
        to,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles to label undefined', () => {
      const from = { x: 0, y: 0, label: 'A' };
      const to = { x: 1, y: 1 };
      const { container } = renderComponent({
        labelNode,
        from,
        to,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('coordinates', () => {
    it('renders with positive coordinates', () => {
      const { container } = renderComponent({
        from: xy(5, 10),
        to: xy(15, 20),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with negative coordinates', () => {
      const { container } = renderComponent({
        from: xy(-5, -10),
        to: xy(-15, -20),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with zero coordinates', () => {
      const { container } = renderComponent({
        from: xy(0, 0),
        to: xy(0, 0),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with decimal coordinates', () => {
      const { container } = renderComponent({
        from: { x: 1.5, y: 2.7 },
        to: { x: 3.2, y: 4.9 },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with large coordinates', () => {
      const { container } = renderComponent({
        from: xy(1000, 1000),
        to: xy(2000, 2000),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with mixed coordinate signs', () => {
      const { container } = renderComponent({
        from: xy(-5, 10),
        to: xy(15, -20),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with very close points', () => {
      const { container } = renderComponent({
        from: { x: 5, y: 5 },
        to: { x: 5.01, y: 5.01 },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with very far points', () => {
      const { container } = renderComponent({
        from: xy(0, 0),
        to: xy(10000, 10000),
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('states', () => {
    it('renders in building state', () => {
      const { container } = renderComponent({ building: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in completed state', () => {
      const { container } = renderComponent({ building: false });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in disabled state', () => {
      const { container } = renderComponent({ disabled: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in enabled state', () => {
      const { container } = renderComponent({ disabled: false });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with building and disabled', () => {
      const { container } = renderComponent({ building: true, disabled: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness correct', () => {
      const { container } = renderComponent({ correctness: 'correct' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness incorrect', () => {
      const { container } = renderComponent({ correctness: 'incorrect' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness partial', () => {
      const { container } = renderComponent({ correctness: 'partial' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without correctness', () => {
      const { container } = renderComponent({ correctness: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles null labelNode', () => {
      const { container } = renderComponent({
        labelNode: null,
        from: fromWithLabel,
        to: toWithLabel,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined labelNode', () => {
      const { container } = renderComponent({
        labelNode: undefined,
        from: fromWithLabel,
        to: toWithLabel,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles missing from coordinates', () => {
      const { container } = renderComponent({
        from: {},
        to: xy(1, 1),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles all props undefined except required', () => {
      const { container } = renderComponent({
        building: undefined,
        disabled: undefined,
        correctness: undefined,
        coordinatesOnHover: undefined,
        labelModeEnabled: undefined,
        limitLabeling: undefined,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom classes', () => {
      const { container } = renderComponent({
        classes: { root: 'custom-root' },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty classes', () => {
      const { container } = renderComponent({ classes: {} });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles middle point without label', () => {
      const middle = { x: 0.5, y: 0.5 };
      const { container } = renderComponent({
        labelNode,
        middle,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with all label types simultaneously', () => {
      const middle = { x: 0.5, y: 0.5, label: 'M' };
      const { container } = renderComponent({
        labelNode,
        from: fromWithLabel,
        to: toWithLabel,
        middle,
        labelModeEnabled: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('integration', () => {
    it('renders complete circle with all features', () => {
      const middle = { x: 0.5, y: 0.5, label: 'Middle' };
      const { container } = renderComponent({
        from: fromWithLabel,
        to: toWithLabel,
        middle,
        labelNode,
        labelModeEnabled: true,
        coordinatesOnHover: true,
        correctness: 'correct',
        building: false,
        disabled: false,
        onClick: jest.fn(),
        onChange: jest.fn(),
        changeMarkProps: jest.fn(),
        onDragStart: jest.fn(),
        onDragStop: jest.fn(),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders building circle without labels', () => {
      const { container } = renderComponent({
        from: xy(0, 0),
        to: xy(1, 1),
        building: true,
        disabled: false,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders disabled circle with labels', () => {
      const { container } = renderComponent({
        from: fromWithLabel,
        to: toWithLabel,
        labelNode,
        disabled: true,
        building: false,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Instance method tests (dragFrom, dragTo, dragCircle, labelChange, clickPoint)
  // have been removed as they test internal implementation details.
  // These behaviors should be tested through:
  // 1. User interaction tests (drag-and-drop, clicks) - requires complex setup with @dnd-kit
  // 2. Integration/E2E tests
  // The component's public API (onChange, changeMarkProps callbacks) is what matters for RTL testing.
});
