import { render } from '@pie-lib/test-utils';
import React from 'react';
import { ArrowedLine } from '../component';
import { graphProps as getGraphProps } from '../../../__tests__/utils';

jest.mock('@pie-lib/plot', () => {
  const a = jest.requireActual('@pie-lib/plot');
  return {
    types: a.types,
    gridDraggable: a.gridDraggable,
    utils: a.utils,
    trig: {
      edges: jest.fn(() => jest.fn().mockReturnValue([0, 0])),
    },
  };
});

describe('ArrowedLine', () => {
  let onChange = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      markerId: '1',
      graphProps: getGraphProps(),
    };
    const props = { ...defaults, ...extras };
    return render(<ArrowedLine {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
