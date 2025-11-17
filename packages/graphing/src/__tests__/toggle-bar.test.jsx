import { render } from '@pie-lib/test-utils';
import React from 'react';

import { ToggleBar } from '../toggle-bar';

// TODO: Component uses drag-and-drop context that requires full component tree setup
describe.skip('ToggleBar (needs proper RTL setup with providers)', () => {
  let onChange = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      options: ['one', 'two'],
    };
    const props = { ...defaults, ...extras };
    return render(<ToggleBar {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
