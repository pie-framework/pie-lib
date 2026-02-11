import { render } from '@pie-lib/test-utils';
import React from 'react';
import { Line } from '../component';
import { graphProps as getGraphProps } from '../../../__tests__/utils';
import { utils } from '@pie-lib/plot';

const { xy } = utils;
describe('Line', () => {
  let onChange = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: getGraphProps(),
      from: xy(0, 0),
      to: xy(1, 1),
    };
    const props = { ...defaults, ...extras };
    return render(<Line {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
