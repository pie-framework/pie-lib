import React from 'react';
import PropTypes from 'prop-types';
import { GraphPropsType } from './types';
import { DraggableCore } from './draggable';
import debug from 'debug';
import * as utils from './utils';
import isFunction from 'lodash/isFunction';
import invariant from 'invariant';
import { clientPoint } from 'd3-selection';
const log = debug('pie-lib:plot:grid-draggable');

export const deltaFn = (scale, snap, val) => delta => {
  const normalized = delta + scale(0);
  const inverted = scale.invert(normalized);

  const fixDecimalsArithmetic = (snap(val + inverted).toFixed(4) * 1000) / 1000;

  return fixDecimalsArithmetic;
};

/**
 * Creates a Component that is draggable, within a bounded grid.
 * @param {*} opts
 */
export const gridDraggable = opts => Comp => {
  invariant(
    !!opts && isFunction(opts.fromDelta) && isFunction(opts.bounds) && isFunction(opts.anchorPoint),
    'You must supply an object with: { anchorPoint: Function, fromDelta: Function, bounds: Function }'
  );
  return class GridDraggable extends React.Component {
    static propTypes = {
      disabled: PropTypes.bool,
      onDragStart: PropTypes.func,
      onDrag: PropTypes.func,
      onDragStop: PropTypes.func,
      onClick: PropTypes.func,
      onMove: PropTypes.func,
      graphProps: GraphPropsType.isRequired
    };
    grid = () => {
      const { graphProps } = this.props;
      const { scale, domain, range } = graphProps;
      return {
        x: scale.x(domain.step) - scale.x(0),
        y: scale.y(range.step) - scale.y(0)
      };
    };
    onStart = e => {
      const { onDragStart } = this.props;
      if (document.activeElement) {
        document.activeElement.blur();
      }
      this.setState({ startX: e.clientX, startY: e.clientY });
      if (onDragStart) {
        onDragStart();
      }
    };
    position = () => {
      const { x, y } = opts.anchorPoint(this.props);
      const { graphProps } = this.props;
      const { scale, snap } = graphProps;

      return {
        anchorPoint: {
          x,
          y
        },
        x: deltaFn(scale.x, snap.x, x),
        y: deltaFn(scale.y, snap.y, y)
      };
    };

    tiny = (key, event) => {
      const K = key.toUpperCase();
      const end = event[`client${K}`];
      const start = this.state[`start${K}`];
      const delta = Math.abs(end - start);
      const out = delta < Math.abs(this.grid()[key]) / 10;
      log('[tiny] key: ', key, 'delta: ', delta, 'out: ', out);
      return out;
    };

    getScaledBounds = () => {
      const bounds = opts.bounds(this.props, this.props.graphProps);
      log('bounds: ', bounds);
      const grid = this.grid();

      const scaled = {
        left: (bounds.left / grid.interval) * grid.x,
        right: (bounds.right / grid.interval) * grid.x,
        top: (bounds.top / grid.interval) * grid.y,
        bottom: (bounds.bottom / grid.interval) * grid.y
      };
      log('[getScaledBounds]: ', scaled);
      return scaled;
    };

    skipDragOutsideOfBounds = (dd, e, graphProps) => {
      // ignore drag movement outside of the domain and range.
      const rootNode = graphProps.getRootNode();
      const [rawX, rawY] = clientPoint(rootNode, e);
      const { scale, domain, range } = graphProps;
      let x = scale.x.invert(rawX);
      let y = scale.y.invert(rawY);

      const xOutside = (dd.deltaX > 0 && x < domain.min) || (dd.deltaX < 0 && x > domain.max);
      const yOutside = (dd.deltaY > 0 && y > range.max) || (dd.deltaY < 0 && y < range.min);
      return xOutside || yOutside;
    };

    onDrag = (e, dd) => {
      const { onDrag, graphProps } = this.props;

      if (!onDrag) {
        return;
      }

      const bounds = this.getScaledBounds();

      if (dd.deltaX < 0 && dd.deltaX < bounds.left) {
        return;
      }

      if (dd.deltaX > 0 && dd.deltaX > bounds.right) {
        return;
      }

      if (dd.deltaY < 0 && dd.deltaY < bounds.top) {
        return;
      }

      if (dd.deltaY > 0 && dd.deltaY > bounds.bottom) {
        return;
      }

      if (this.skipDragOutsideOfBounds(dd, e, graphProps)) {
        return;
      }

      const dragArg = this.applyDelta({ x: dd.deltaX, y: dd.deltaY });

      if (dragArg !== undefined || dragArg !== null) {
        onDrag(dragArg);
      }
    };

    getDelta = point => {
      const pos = this.position();

      const p = {
        x: pos.x(point.x),
        y: pos.y(point.y)
      };

      return utils.getDelta(pos.anchorPoint, p);
    };

    applyDelta = point => {
      const delta = this.getDelta(point);
      log('[applyDelta] delta:', delta);
      return opts.fromDelta(this.props, delta);
    };

    onStop = (e, dd) => {
      log('[onStop] dd:', dd);
      const { onDragStop, onClick } = this.props;

      if (onDragStop) {
        onDragStop();
      }

      log('[onStop] lastX/Y: ', dd.lastX, dd.lastY);
      const isClick = this.tiny('x', e) && this.tiny('y', e);

      if (isClick) {
        if (onClick) {
          log('call onClick');
          this.setState({ startX: null });
          const { graphProps } = this.props;
          const { scale, snap } = graphProps;
          const [rawX, rawY] = clientPoint(e.target, e);
          let x = scale.x.invert(rawX);
          let y = scale.y.invert(rawY);
          x = snap.x(x);
          y = snap.y(y);
          onClick({ x, y });
          return false;
        }
      }

      this.setState({ startX: null, startY: null });
      // return false to prevent state updates in the underlying draggable - a move will have triggered an update already.
      return false;
    };

    render() {
      /* eslint-disable no-unused-vars */
      //Note: we pull onClick out so that it's not in ...rest.
      const { disabled, onClick, ...rest } = this.props;
      /* eslint-enable no-unused-vars */

      const grid = this.grid();
      //prevent the text select icon from rendering.
      const onMouseDown = e => e.nativeEvent.preventDefault();

      /**
       * TODO: This shouldnt be necessary, we should be able to use the r-d classnames.
       * But they aren't being unset. If we continue with this lib, we'll have to fix this.
       */
      const isDragging = this.state ? !!this.state.startX : false;

      return (
        <DraggableCore
          disabled={disabled}
          onMouseDown={onMouseDown}
          onStart={this.onStart}
          onDrag={this.onDrag}
          onStop={this.onStop}
          axis={opts.axis || 'both'}
          grid={[grid.x, grid.y]}
        >
          <Comp {...rest} disabled={disabled} isDragging={isDragging} />
        </DraggableCore>
      );
    }
  };
};
