import { render } from '@pie-lib/test-utils';
import React from 'react';

import ToolMenu from '../tool-menu';

describe('ToolMenu', () => {
  let onChange = jest.fn();
  const tools = ['one', 'two'];

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      currentTool: tools[0],
      tools,
      gssLineData: {
        selectedTool: 'lineA',
        lineA: { lineType: 'Solid' },
        lineB: { lineType: 'Solid' },
      },
    };
    const props = { ...defaults, ...extras };
    return render(<ToolMenu {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
