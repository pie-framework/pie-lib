import React from 'react';
import PropTypes from 'prop-types';
import { ToolPropTypeFields } from '../types';
import debug from 'debug';
import { types } from '@pie-lib/plot';
import LinePath from '../shared/line-path';
import { curveMonotoneX } from '@vx/curve';
import BasePoint from '../point/base-point';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { buildDataPoints, parabolaFromTwoPoints } from '../utils';

const log = debug('pie-lib:graphing:sine');

class RawParabola extends React.Component {
  static propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    classes: PropTypes.object.isRequired,
    root: types.PointType.isRequired,
    edge: types.PointType,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  startEdgeDrag = () => {};

  stopEdgeDrag = () => this.setState({ edge: undefined });

  dragEdge = edge => {
    log('[dragEdge] edge:', edge);
    this.setState({ edge });
  };

  startRootDrag = () => {};

  dragRoot = root => this.setState({ root });

  moveRoot = root => {
    const { edge, onChange } = this.props;
    const update = { root, edge };
    onChange(update);
  };

  moveEdge = edge => {
    const { root, onChange } = this.props;
    const update = { root, edge };
    onChange(update);
  };

  moveLine = ({ root, edge }) => {
    const { onChange } = this.props;
    onChange({ root, edge });
  };

  stopRootDrag = () => this.setState({ root: undefined });
  startLineDrag = () => {};
  stopLineDrag = () => this.setState({ line: undefined });
  dragLine = line => this.setState({ line });

  getPoints = () => {
    const { domain } = this.props.graphProps;

    if (this.state.line) {
      /** line is being transformed by drag, so we want to build it's data points off of the props instead of the state.line object. */
      // const root = utils.point(this.props.root).add(this.state.lineAnchor);
      // const { freq } = getAmplitudeAndFreq(root, edge);
      // const interval = freq / FREQ_DIVIDER;
      const dataPoints = buildDataPoints(
        domain.min,
        domain.max,
        this.props.root,
        this.props.edge,
        1,
        parabolaFromTwoPoints(this.props.root, this.props.edge)
      );

      log('dataPoints:', dataPoints);
      return {
        root: this.state.line.root,
        edge: this.state.line.edge,
        dataPoints
      };
    }

    const root = this.state.root ? this.state.root : this.props.root;
    const edge = this.state.edge ? this.state.edge : this.props.edge;
    const interval = 1;

    const dataPoints =
      edge && edge.x === root.x
        ? []
        : buildDataPoints(
            domain.min,
            domain.max,
            root,
            edge,
            interval,
            parabolaFromTwoPoints(root, edge)
          );
    log('dataPoints:', dataPoints);
    return { root: this.props.root, edge: this.props.edge, dataPoints };
  };

  render() {
    const { classes, graphProps } = this.props;
    const { root, edge, dataPoints } = this.getPoints();

    const raw = dataPoints.map(d => [graphProps.scale.x(d.x), graphProps.scale.y(d.y)]);

    return (
      <g>
        {edge && (
          <LinePath
            className={classNames(classes.sinePath)}
            xScale={d => graphProps.scale.x(d.x)}
            yScale={d => graphProps.scale.y(d.y)}
            data={raw}
            graphProps={graphProps}
            onDragStart={this.startLineDrag}
            onDragStop={this.stopLineDrag}
            onDrag={this.dragLine}
            root={this.props.root}
            edge={this.props.edge}
            onMove={this.moveLine}
            curve={curveMonotoneX}
          />
        )}

        <BasePoint
          graphProps={graphProps}
          x={root.x}
          y={root.y}
          onDragStart={this.startRootDrag}
          onDragStop={this.stopRootDrag}
          onDrag={this.dragRoot}
          onMove={this.moveRoot}
        />
        {edge && (
          <BasePoint
            graphProps={graphProps}
            x={edge.x}
            y={edge.y}
            onDragStart={this.startEdgeDrag}
            onDragStop={this.stopEdgeDrag}
            onDrag={this.dragEdge}
            onMove={this.moveEdge}
          />
        )}
      </g>
    );
  }
}
const Parabola = withStyles(theme => ({}))(RawParabola);

export default class Component extends React.Component {
  static propTypes = {
    ...ToolPropTypeFields,
    graphProps: types.GraphPropsType.isRequired
  };

  static defaultProps = {};

  changeMark = ({ root, edge }) => {
    const { mark, onChange } = this.props;
    const update = { ...mark, root, edge };
    onChange(mark, update);
  };

  render() {
    const { mark, graphProps } = this.props;
    return (
      <Parabola
        root={mark.root}
        edge={mark.edge}
        graphProps={graphProps}
        onChange={this.changeMark}
      />
    );
  }
}
