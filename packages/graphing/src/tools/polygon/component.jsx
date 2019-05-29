import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToolPropTypeFields } from '../types';
import { BasePoint } from '../common/point';
import chunk from 'lodash/chunk';
import initial from 'lodash/initial';
import isEqual from 'lodash/isEqual';
import debug from 'debug';
import Line from './line';
import DraggablePolygon, { Polygon } from './polygon';
import { types } from '@pie-lib/plot';
import { Label } from '../common/label';
const log = debug('pie-lib:graphing:polygon');

export const buildLines = (points, closed) => {
  const expanded = points.reduce((acc, p, index) => {
    acc.push(p);
    const isLast = index === points.length - 1;
    const next = isLast ? 0 : index + 1;
    acc.push(points[next]);
    return acc;
  }, []);

  const all = chunk(expanded, 2).map(([from, to]) => {
    const line = { from, to };
    return line;
  });

  return closed ? all : initial(all);
};

const swap = (arr, ...rest) => {
  const pairs = chunk(rest, 2);

  return pairs.reduce(
    (acc, pr) => {
      if (pr.length === 2) {
        let [e, replacement] = pr;
        const i = acc.findIndex(pt => pt.x === e.x && pt.y === e.y);
        if (i >= 0) {
          acc.splice(i, 1, replacement);
          return acc;
        } else {
          return acc;
        }
      } else {
        return acc;
      }
    },
    [...arr]
  );
};

const xy = p => `${p.x}-${p.y}`;

export class RawBaseComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    points: PropTypes.arrayOf(types.PointType),
    closed: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onClosePolygon: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    labelIsActive: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      label: null
    };
  }

  movePoint = (from, to) => {
    log('[movePoint] ', from, to);

    const { onChange, points } = this.props;

    const update = swap(points, from, to);
    onChange(update);
  };

  moveLine = (existing, next) => {
    log('[moveLine]', existing, next);
    const { points, onChange } = this.props;
    const update = swap(points, existing.from, next.from, existing.to, next.to);
    onChange(update);
  };

  movePoly = (existing, next) => {
    const { onChange } = this.props;
    log('[movePoly]', existing, next);
    onChange(next);
  };

  dragPoint = (from, index, to) => {
    log('[dragPoint] from, to:', from, to);
    this.setState({ dragPoint: { from, to, index } });
  };

  dragLine = (existing, next) => {
    log('[dragLine]: ', existing, next);
    this.setState({ dragLine: { existing, next } });
  };

  dragPoly = (existing, next) => {
    log('[dragPoly] ', existing, next);
    this.setState({ dragPoly: { existing, next } });
  };

  clearDragState = done => {
    this.setState(
      {
        dragPoint: undefined,
        dragLine: undefined,
        dragPoly: undefined
      },
      () => {
        if (this.props.onDragStop) {
          this.props.onDragStop();
        }
        if (done) {
          done();
        }
      }
    );
  };

  /**
   * Return points for polygon, points for points and lines for lines.
   * These will be different depending on what is being dragged.
   */
  getPointsAndLines = () => {
    const { dragLine, dragPoint, dragPoly } = this.state;
    const { points, closed } = this.props;
    if (dragPoint && dragLine) {
      throw new Error('should never have a point and line dragged at the same time');
    }

    if (dragPoint) {
      const i = points.findIndex(p => isEqual(p, dragPoint.from));
      if (i >= 0) {
        const poly = [...points];
        poly.splice(i, 1, dragPoint.to);
        const lines = buildLines(poly, closed);
        /** a point is being dragged - so we just pass the original alongn */
        return { poly, lines, points };
      }
    }

    if (dragLine) {
      const { existing, next } = dragLine;

      let swapped = swap(points, existing.from, next.from, existing.to, next.to);
      /** We do a little visual trick here so we don't need to update the lines array.
       * The Line components are transparent until you hover over them or drag.
       * The bars you see are actually part of the polygon.
       */
      const updatedLines = buildLines(points, closed);
      return { lines: updatedLines, poly: swapped, points: swapped };
    }

    if (dragPoly) {
      const lines = buildLines(dragPoly.next, closed);
      // pass points through - drag is already applying the tranform.
      return { poly: points, points: dragPoly.next, lines };
    }

    // the unadulterated set..
    return { poly: points, lines: buildLines(points, closed), points };
  };

  close = () => {
    const { points, onClosePolygon } = this.props;
    log('[close] ...');
    if (points.length >= 3) {
      onClosePolygon();
    } else {
      log('[close] - nope');
    }
  };

  render() {
    const { closed, points, disabled, graphProps, labelIsActive } = this.props;
    log('[render]', points.join(','));
    const pl = this.getPointsAndLines();
    const { dragPoly, dragPoint } = this.state;

    let labelPosition = pl.points[0];

    if (dragPoly && dragPoly.next) {
      labelPosition = dragPoly && dragPoly.next[0];
    }

    if (dragPoint && dragPoint.index === 0) {
      labelPosition = dragPoint.to;
    }

    log('[render] graphProps:', graphProps);
    return (
      <g
        onClick={() => {
          if (labelIsActive) {
            this.setState({ label: '' });
          }
        }}
      >
        {this.state.label !== null && (
          <Label
            disabled={disabled}
            onChange={value => this.setState({ label: value })}
            onRemove={() => this.setState({ label: null })}
            x={labelPosition.x}
            y={labelPosition.y}
            graphProps={graphProps}
          />
        )}
        {closed ? (
          <DraggablePolygon
            disabled={disabled}
            points={pl.poly}
            onDragStart={this.props.onDragStart}
            onDrag={this.dragPoly.bind(this, pl.poly)}
            onDragStop={this.clearDragState}
            onMove={this.movePoly.bind(this, pl.poly)}
            graphProps={graphProps}
            closed={closed}
          />
        ) : (
          <Polygon points={pl.poly} graphProps={graphProps} closed={closed} />
        )}
        {(pl.lines || []).map((l, index) => (
          <Line
            disabled={disabled}
            key={`${xy(l.from)}-${xy(l.to)}-${index}`}
            from={l.from}
            to={l.to}
            onDragStart={this.props.onDragStart}
            onDrag={this.dragLine.bind(this, l)}
            onDragStop={this.clearDragState}
            onMove={this.moveLine.bind(this, l)}
            graphProps={graphProps}
          />
        ))}
        {(pl.points || []).map((p, index) => {
          return (
            <BasePoint
              disabled={disabled}
              key={`${xy(p)}-${index}`}
              onDragStart={this.props.onDragStart}
              onDrag={this.dragPoint.bind(this, p, index)}
              onDragStop={this.clearDragState}
              onMove={this.movePoint.bind(this, p)}
              onClick={index === 0 ? this.close : () => {}}
              x={p.x}
              y={p.y}
              graphProps={graphProps}
            />
          );
        })}
      </g>
    );
  }
}

export const BaseComponent = withStyles(theme => ({}))(RawBaseComponent);

export default class Component extends React.Component {
  static propTypes = {
    ...ToolPropTypeFields,
    graphProps: types.GraphPropsType.isRequired
  };

  static defaultProps = {};

  change = points => {
    const { mark, onChange } = this.props;
    const update = { ...mark, points };
    onChange(mark, update);
  };

  closePolygon = () => {
    log('[closePolygon] ...');
    const { onComplete, mark } = this.props;
    const update = { ...mark, closed: true };
    onComplete(mark, update);
  };

  dragStart = () => {
    const { onDragStart } = this.props;
    if (onDragStart) {
      onDragStart();
    }
  };

  dragStop = () => {
    const { onDragStop } = this.props;
    if (onDragStop) {
      onDragStop();
    }
  };

  render() {
    const { mark, graphProps, labelIsActive } = this.props;
    return (
      <BaseComponent
        {...mark}
        onChange={this.change}
        onClosePolygon={this.closePolygon}
        onDragStart={this.dragStart}
        onDragStop={this.dragStop}
        graphProps={graphProps}
        labelIsActive={labelIsActive}
      />
    );
  }
}
