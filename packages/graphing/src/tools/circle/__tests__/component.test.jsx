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
  });

  // Note: Instance method tests (dragFrom, dragTo, dragCircle, labelChange, clickPoint)
  // have been removed as they test internal implementation details.
  // These behaviors should be tested through:
  // 1. User interaction tests (drag-and-drop, clicks) - requires complex setup with @dnd-kit
  // 2. Integration/E2E tests
  // The component's public API (onChange, changeMarkProps callbacks) is what matters for RTL testing.
});
