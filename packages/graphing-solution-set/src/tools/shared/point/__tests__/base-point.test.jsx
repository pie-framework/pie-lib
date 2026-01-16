import { render } from '@pie-lib/test-utils';
import React from 'react';
import { BasePoint } from '../index';
import { gridDraggable } from '@pie-lib/plot';
import { graphProps } from '../../../../__tests__/utils';
import { bounds } from '../../../../utils';

jest.mock('../../../../utils', () => {
  const { point, thinnerShapesNeeded } = jest.requireActual('../../../../utils');
  return {
    bounds: jest.fn(),
    point,
    thinnerShapesNeeded,
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
    };
    const props = { ...defaults, ...extras };
    return render(<BasePoint {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
  describe('gridDraggable options', () => {
    let opts;
    let domain;
    let range;
    beforeEach(() => {
      domain = {
        min: 0,
        max: 1,
        step: 1,
      };
      range = {
        min: 0,
        max: 1,
        step: 1,
      };
      renderComponent();
      opts = gridDraggable.mock.calls[gridDraggable.mock.calls.length - 1][0];
    });

    describe('bounds', () => {
      it('calls utils.bounds with area', () => {
        const result = opts.bounds({ x: 0, y: 0 }, { domain, range });
        expect(bounds).toHaveBeenCalledWith({ left: 0, top: 0, bottom: 0, right: 0 }, domain, range);
      });
    });
    describe('anchorPoint', () => {
      it('returns x/y', () => {
        const result = opts.anchorPoint({ x: 0, y: 0 });
        expect(result).toEqual({ x: 0, y: 0 });
      });
    });

    describe('fromDelta', () => {
      it('returns a new point from the x/y + delta', () => {
        const result = opts.fromDelta({ x: -1, y: 0 }, { x: 1, y: 3 });
        expect(result).toEqual({ x: 0, y: 3 });
      });
    });
  });
});
