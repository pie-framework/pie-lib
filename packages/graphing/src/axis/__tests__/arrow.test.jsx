import { render } from '@pie-lib/test-utils';
import React from 'react';
import { Arrow } from '../arrow';

describe('Arrow', () => {
  let onChange = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      scale: {
        x: jest.fn((n) => n),
        y: jest.fn((n) => n),
      },
    };
    const props = { ...defaults, ...extras };
    return render(<Arrow {...props} />);
  };
  describe('rendering', () => {
    it('renders with direction up', () => {
      const { container } = renderComponent({ direction: 'up' });
      expect(container.firstChild).toBeInTheDocument();
    });
    it('renders with direction down', () => {
      const { container } = renderComponent({ direction: 'down' });
      expect(container.firstChild).toBeInTheDocument();
    });
    it('renders with direction left', () => {
      const { container } = renderComponent({ direction: 'left' });
      expect(container.firstChild).toBeInTheDocument();
    });
    it('renders with direction right', () => {
      const { container } = renderComponent({ direction: 'right' });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
