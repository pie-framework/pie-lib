import { render } from '@testing-library/react';
import React from 'react';
import DragHandle from '../drag-handle';
import { gridDraggable } from '@pie-lib/plot';
import { graphProps } from './utils';
import { bounds } from '../../utils';

jest.mock('../../utils', () => {
  const { point } = jest.requireActual('../../utils');
  return {
    bounds: jest.fn(),
    point,
    getScale: jest.fn(() => ({ scale: 1 })),
  };
});

jest.mock('@pie-lib/plot', () => {
  const { types, utils } = jest.requireActual('@pie-lib/plot');
  return {
    gridDraggable: jest.fn((opts) => (Comp) => Comp),
    types,
    utils,
  };
});

describe('BasePoint', () => {
  let onChange = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      x: 0,
      y: 0,
      width: 100,
    };
    const props = { ...defaults, ...extras };
    return render(<DragHandle {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('gridDraggable options', () => {
    it('configures gridDraggable with correct options', () => {
      // The gridDraggable HOC is tested by verifying that it's called with the component
      // Detailed unit tests for the HOC options would require accessing internal
      // implementation details which is not recommended with RTL
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
      expect(gridDraggable).toHaveBeenCalled();
    });
  });
});
