import { render } from '@pie-lib/test-utils';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import Component from '../component';

describe('Component', () => {
  let onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
    };
    const props = { ...defaults, ...extras };
    return render(<Component {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with mark', () => {
      const { container } = renderComponent({ mark: { ...xy(0, 0) } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with label', () => {
      const { container } = renderComponent({ mark: { label: 'foo', ...xy(0, 0) } });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
