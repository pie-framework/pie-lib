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
import invariant from 'invariant';
const log = debug('pie-lib:graphing:polygon');

export const buildLines = (points, closed) => {
  const expanded = points.reduce((acc, p, index) => {
    acc.push({ ...p, index });
    const isLast = index === points.length - 1;
    const next = isLast ? 0 : index + 1;
    acc.push({ ...points[next], index: next });
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
        invariant(Number.isFinite(e.index), 'Index must be defined');
        const index = e.index;
        // const i = acc.findIndex(pt => pt.x === e.x && pt.y === e.y);
        if (index >= 0) {
          acc.splice(index, 1, replacement);
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

  dragPoint = (index, from, to) => {
    log('[dragPoint] from, to:', from, to);
    const { onChange } = this.props;

    if (isEqual(from, to)) {
      return;
    }
    const update = [...this.props.points];
    update.splice(index, 1, to);
    onChange(update);
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

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   return false;
  // };

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
              onDrag={this.dragPoint.bind(this, index, p)}
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

  constructor(props) {
    super(props);
    this.state = {};
  }
  change = points => {
    const mark = { ...this.state.mark, points };
    this.setState({ mark });
  };

  closePolygon = () => {
    log('[closePolygon] ...');
    const { onComplete, mark } = this.props;
    const update = { ...mark, closed: true };
    onComplete(mark, update);
  };

  dragStart = () => this.setState({ mark: this.props.mark });

  dragStop = () => {
    const { onChange } = this.props;
    const m = { ...this.state.mark };
    this.setState({ mark: undefined }, () => {
      onChange(this.props.mark, m);
    });
  };

  render() {
    const { mark, graphProps, onClick, isToolActive } = this.props;
    return (
      <BaseComponent
        {...this.state.mark || mark}
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
