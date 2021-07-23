import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToolPropTypeFields } from '../shared/types';
import { BasePoint } from '../shared/point';
import chunk from 'lodash/chunk';
import initial from 'lodash/initial';
import isEqual from 'lodash/isEqual';
import debug from 'debug';
import Line from './line';
import DraggablePolygon, { Polygon } from './polygon';
import { types, utils } from '@pie-lib/plot';
import invariant from 'invariant';
import ReactDOM from 'react-dom';
import MarkLabel from '../../mark-label';
import isEmpty from 'lodash/isEmpty';
import { getMiddleOfTwoPoints, getRightestPoints, equalPoints } from '../../utils';

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
    return { from, to };
  });

  return closed ? all : initial(all);
};

export const swap = (arr, ...rest) => {
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
    correctness: PropTypes.string,
    points: PropTypes.arrayOf(types.PointType),
    closed: PropTypes.bool,
    coordinatesOnHover: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onClosePolygon: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    onClick: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    isToolActive: PropTypes.bool,
    labelNode: PropTypes.object,
    labelModeEnabled: PropTypes.bool,
    onChangeLabelProps: PropTypes.func,
    onChangeProps: PropTypes.func
  };

  static defaultProps = {
    points: []
  };

  dragPoint = (index, from, to) => {
    log('[dragPoint] from, to:', from, to);
    const { onChange, points } = this.props;
    const update = [...points];
    const overlapPoint = !!(points || []).find(p => equalPoints(p, to));

    if (equalPoints(from, to) || overlapPoint) {
      return;
    }

    if (points[index].label) {
      to.label = points[index].label;
    }

    update.splice(index, 1, to);
    onChange(update);
  };

  dragLine = (existing, next) => {
    log('[dragLine]: ', existing, next);
    const { onChange } = this.props;

    if (existing.from.label) {
      next.from.label = existing.from.label;
    }

    if (existing.to.label) {
      next.to.label = existing.to.label;
    }

    const points = swap(this.props.points, existing.from, next.from, existing.to, next.to);
    onChange(points);
  };

  dragPoly = (existing, next) => {
    log('[dragPoly] ', existing, next);
    const { onChange } = this.props;

    next.forEach((point, index) => {
      if (existing[index].label) {
        next[index].label = existing[index].label;
      }
    });

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

  labelChange = (point, index) => {
    const { points, onChangeProps } = this.props;
    const updatedPoint = { ...point };

    if (!point.label || isEmpty(point.label)) {
      delete updatedPoint.label;
    }

    const update = [...points];

    update.splice(index, 1, updatedPoint);
    onChangeProps(update);
  };

  clickPoint = (point, index, data) => {
    const {
      closed,
      onClick,
      isToolActive,
      labelModeEnabled,
      onChangeProps,
      onChangeLabelProps,
      points
    } = this.props;

    if (labelModeEnabled) {
      if (points && index === points.length) {
        const { a, b } = getRightestPoints(points);
        const middle = { label: '', ...point, ...getMiddleOfTwoPoints(a, b) };

        onChangeLabelProps(middle);
      } else {
        const update = [...points];

        update.splice(index, 1, { label: '', ...point });
        onChangeProps(update);
      }

      if (this.input[index]) {
        this.input[index].focus();
      }
    } else {
      if (isToolActive && !closed && index === 0) {
        this.close();
      } else {
        onClick(data);
      }
    }
  };

  // IMPORTANT, do not remove
  input = {};

  render() {
    const {
      closed,
      coordinatesOnHover,
      correctness,
      disabled,
      graphProps,
      onDragStart,
      onDragStop,
      points,
      middle,
      labelNode,
      labelModeEnabled
    } = this.props;
    const lines = buildLines(points, closed);
    const common = { onDragStart, onDragStop, graphProps, disabled, correctness };
    const polygonLabelIndex = (points && points.length) || 0;
    let polygonLabelNode = null;

    if (labelNode && middle && middle.hasOwnProperty('label')) {
      polygonLabelNode = ReactDOM.createPortal(
        <MarkLabel
          inputRef={r => (this.input[polygonLabelIndex] = r)}
          disabled={!labelModeEnabled}
          mark={middle}
          graphProps={graphProps}
          onChange={() => {}}
        />,
        labelNode
      );
    }

    return (
      <g>
        {closed ? (
          <React.Fragment>
            <DraggablePolygon
              points={points}
              onDrag={this.dragPoly.bind(this, points)}
              closed={closed}
              {...common}
              onClick={this.clickPoint.bind(this, middle, polygonLabelIndex)}
            />
            {polygonLabelNode}
          </React.Fragment>
        ) : (
          <Polygon points={points} graphProps={graphProps} closed={closed} />
        )}
        {(lines || []).map((l, index) => (
          <Line
            key={`line-${index}`}
            from={l.from}
            to={l.to}
            onDrag={this.dragLine.bind(this, l)}
            {...common}
            onClick={this.clickPoint.bind(this, middle, polygonLabelIndex)}
          />
        ))}

        {(points || []).map((p, index) => {
          return [
            <BasePoint
              key={`point-${index}`}
              coordinatesOnHover={coordinatesOnHover}
              labelNode={labelNode}
              x={p.x}
              y={p.y}
              onDrag={this.dragPoint.bind(this, index, p)}
              onClick={this.clickPoint.bind(this, p, index)}
              {...common}
            />,
            labelNode && p.hasOwnProperty('label')
              ? ReactDOM.createPortal(
                  <MarkLabel
                    inputRef={r => (this.input[index] = r)}
                    disabled={!labelModeEnabled}
                    mark={p}
                    graphProps={graphProps}
                    onChange={label => this.labelChange({ ...p, label }, index)}
                  />,
                  labelNode
                )
              : null
          ];
        })}
      </g>
    );
  }
}

export const BaseComponent = withStyles(() => ({}))(RawBaseComponent);

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
    const {
      mark: { middle }
    } = this.props;
    const mark = { ...this.state.mark, points };

    if (middle) {
      const { a, b } = getRightestPoints(points);
      mark.middle = { ...middle, ...getMiddleOfTwoPoints(a, b) };
    }

    this.setState({ mark });
  };

  changeProps = points => {
    const mark = { ...this.props.mark, points };

    this.props.onChange(this.props.mark, mark);
  };

  changeLabelProps = point => {
    const { mark, onChange } = this.props;
    const middle = { ...mark.middle, ...point };

    onChange(mark, { ...mark, middle });
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

  shouldComponentUpdate = (nextProps, nextState) => {
    const { coordinatesOnHover, graphProps, mark } = this.props;
    const { graphProps: nextGraphProps } = nextProps;

    return (
      !utils.isDomainRangeEqual(graphProps, nextGraphProps) ||
      !isEqual(mark, nextProps.mark) ||
      !isEqual(this.state.mark, nextState.mark) ||
      coordinatesOnHover !== nextProps.coordinatesOnHover
    );
  };

  render() {
    const {
      coordinatesOnHover,
      mark,
      graphProps,
      onClick,
      isToolActive,
      labelNode,
      labelModeEnabled
    } = this.props;
    const { mark: stateMark } = this.state;

    return (
      <BaseComponent
        {...(stateMark || mark)}
        coordinatesOnHover={coordinatesOnHover}
        onChange={this.change}
        onChangeLabelProps={this.changeLabelProps}
        onChangeProps={this.changeProps}
        onClosePolygon={this.closePolygon}
        onDragStart={this.dragStart}
        onDragStop={this.dragStop}
        onClick={onClick}
        graphProps={graphProps}
        isToolActive={isToolActive}
        labelNode={labelNode}
        labelModeEnabled={labelModeEnabled}
      />
    );
  }
}
