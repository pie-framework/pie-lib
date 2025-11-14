import { render } from '@pie-lib/test-utils';
import React from 'react';
import { ArrowHead, ArrowMarker } from '../arrow-head';

describe('ArrowHead', () => {
  const renderComponent = (extras) => {
    const defaults = { size: 10, transform: '' };
    const props = { ...defaults, ...extras };
    return render(<ArrowHead {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('ArrowMarker', () => {
  const renderComponent = (extras) => {
    const defaults = { id: 'id', size: 10, className: 'className' };
    const props = { ...defaults, ...extras };
    return render(<ArrowMarker {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
