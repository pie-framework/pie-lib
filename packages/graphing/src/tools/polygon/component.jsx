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
    onClick: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    isToolActive: PropTypes.bool
  };

  dragPoint = (from, to) => {
    log('[dragPoint] from, to:', from, to);
    const { onChange } = this.props;
    const points = this.props.points.map(p => {
      if (isEqual(p, from)) {
        return to;
      }
      return p;
    });

    onChange(points);
  };

  dragLine = (existing, next) => {
    log('[dragLine]: ', existing, next);
    const { onChange } = this.props;
    // this.setState({ dragLine: { existing, next } });
    let points = swap(this.props.points, existing.from, next.from, existing.to, next.to);
    onChange(points);
  };

  dragPoly = (existing, next) => {
    log('[dragPoly] ', existing, next);
    const { onChange } = this.props;
    onChange(next);
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

  clickPoint = (point, index, data) => {
    const { closed, onClosePolygon, onClick, isToolActive } = this.props;
    if (isToolActive && !closed && index === 0) {
      onClosePolygon();
    } else {
      onClick(data);
    }
  };

  render() {
    const { closed, disabled, graphProps, onClick, onDragStart, onDragStop, points } = this.props;
    const lines = buildLines(points, closed);
    const common = { onDragStart, onDragStop, graphProps, disabled };
    return (
      <g>
        {closed ? (
          <DraggablePolygon
            points={points}
            onDrag={this.dragPoly.bind(this, points)}
            closed={closed}
            onClick={onClick}
            {...common}
          />
        ) : (
          <Polygon points={points} graphProps={graphProps} closed={closed} />
        )}
        {(lines || []).map((l, index) => (
          <Line
            key={`line-${index}`}
            from={l.from}
            to={l.to}
            onDrag={this.dragLine.bind(this, l)}
            onClick={onClick}
            {...common}
          />
        ))}

        {(points || []).map((p, index) => {
          return (
            <BasePoint
              key={`point-${index}`}
              onDrag={this.dragPoint.bind(this, p)}
              x={p.x}
              y={p.y}
              onClick={this.clickPoint.bind(this, p, index)}
              {...common}
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
    const { mark, graphProps, onClick, isToolActive } = this.props;
    return (
      <BaseComponent
        {...mark}
        onChange={this.change}
        onClosePolygon={this.closePolygon}
        onDragStart={this.dragStart}
        onDragStop={this.dragStop}
        onClick={onClick}
        graphProps={graphProps}
        isToolActive={isToolActive}
      />
    );
  }
}
