import { render } from '@pie-lib/test-utils';
import React from 'react';
import { RayLine } from '../component';
import { graphProps as getGraphProps } from '../../../__tests__/utils';
import { utils } from '@pie-lib/plot';

describe('RayLine', () => {
  let onChange = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      markerId: '1',
      graphProps: getGraphProps(),
      from: utils.xy(0, 0),
      to: utils.xy(1, 1),
    };
    const props = { ...defaults, ...extras };
    return render(<RayLine {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
