import { shallow } from 'enzyme/build';
import React from 'react';
import { withRootEdge } from '../with-root-edge';
import { graphProps, xy } from '../../../__tests__/utils';

jest.mock('@pie-lib/plot', () => {
  const { types, utils } = jest.requireActual('@pie-lib/plot');
  return {
    gridDraggable: jest.fn(opts => Comp => Comp),
    types,
    utils
  };
});

describe('WithRootEdge', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const root = { ...xy(1, 1) };
    const edge = { ...xy(2, 2) };

    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      root,
      edge
    };
    const props = { ...defaults, ...extras };

    const RootEdge = withRootEdge(({}, {}) => ({
      root,
      edge,
      dataPoints: [
        { x: 1, y: 1 },
        { x: 1.25, y: 1.3826834324 },
        { x: 1.5, y: 1.7071067812 },
        { x: 1.75, y: 1.9238795325 },
        { x: 2, y: 2 }
      ]
    }));
    return shallow(<RootEdge {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;

    beforeEach(() => {
      w = wrapper();
    });

    it('startEdgeDrag', () => {});

    it('stopEdgeDrag', () => {
      w.instance().stopEdgeDrag();

      expect(w.instance().state.edge).toEqual(undefined);
    });

    it('dragEdge', () => {
      w.instance().dragEdge({ ...xy(1, 1) });

      expect(w.instance().state.edge).toEqual({ ...xy(1, 1) });
    });

    it('startRootDrag', () => {});

    it('dragRoot', () => {
      w.instance().dragRoot({ ...xy(0, 0) });

      expect(w.instance().state.root).toEqual({ ...xy(0, 0) });
    });

    it('moveRoot', () => {
      w.instance().moveRoot({ ...xy(0, 0) });

      expect(onChange).toHaveBeenCalledWith({
        root: { ...xy(0, 0) },
        edge: { ...xy(2, 2) }
      });
    });

    it('moveEdge', () => {
      w.instance().moveEdge({ ...xy(0, 0) });

      expect(onChange).toHaveBeenCalledWith({
        root: { ...xy(1, 1) },
        edge: { ...xy(0, 0) }
      });
    });

    it('moveLine', () => {
      w.instance().moveLine({ root: { ...xy(0, 0) }, edge: { ...xy(1, 1) } });

      expect(onChange).toHaveBeenCalledWith({
        root: { ...xy(0, 0) },
        edge: { ...xy(1, 1) }
      });
    });

    it('stopRootDrag', () => {
      w.instance().stopRootDrag();

      expect(w.instance().state.root).toEqual(undefined);
    });

    it('startLineDrag', () => {});

    it('stopLineDrag', () => {
      w.instance().stopLineDrag();

      expect(w.instance().state.line).toEqual(undefined);
    });

    it('dragLine', () => {
      w.instance().dragLine({ root: { ...xy(0, 0) }, edge: { ...xy(1, 1) } });

      expect(w.instance().state.line).toEqual({ root: { ...xy(0, 0) }, edge: { ...xy(1, 1) } });
    });
  });
});
