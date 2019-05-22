import React from 'react';
import PropTypes from 'prop-types';
import { ToolPropTypeFields } from '../types';
import debug from 'debug';
import { types } from '@pie-lib/plot';
import LinePath from './line-path';
import { curveMonotoneX } from '@vx/curve';
// import { genDateValue } from '@vx/mock-data';
import _ from 'lodash';
import Point from '@mapbox/point-geometry';
import BasePoint from '../point/base-point';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { xPoints } from './utils';
const xy = (x, y) => ({ x, y });

const log = debug('pie-lib:graphing:sine');

log('sine...');
const getAmplitudeAndFreq = (root, edge) => {
  const r = new Point(root.x, root.y);
  const e = new Point(edge.x, edge.y);
  const d = e.sub(r);
  // edge point describes 1/4 of the freq
  return { freq: d.x * 4, amplitude: d.y };
};

const sinY = (amplitude, freq) => x => {
  const num = 2 * Math.PI * x;
  const frac = num / freq;
  return amplitude * parseFloat(Math.sin(frac).toFixed(10));
};

const buildDataPoints = (min, max, root, amplitude, freq) => {
  log(
    '[buildDataPoints] min:',
    min,
    'max:',
    max,
    'root:',
    root,
    'amplitude:',
    amplitude,
    'freq:',
    freq
  );
  const fn = sinY(amplitude, freq);
  const diff = max - root.x;
  const plusDiff = min - root.x;
  const xs = xPoints(0, freq / 16, min - root.x - diff, max - root.x - plusDiff);
  log('xs:', xs);
  return xs.map(v => new Point(v, fn(v))).map(p => p.add(new Point(root.x, root.y)));
};

class RawSine extends React.Component {
  static propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    classes: PropTypes.object.isRequired,
    root: types.PointType.isRequired,
    edge: types.PointType.isRequired,
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
      const { amplitude, freq } = getAmplitudeAndFreq(this.props.root, this.props.edge);
      const dataPoints = buildDataPoints(domain.min, domain.max, this.props.root, amplitude, freq);
      return {
        root: this.state.line.root,
        edge: this.state.line.edge,
        dataPoints
      };
    }

    const root = this.state.root ? this.state.root : this.props.root;
    const edge = this.state.edge ? this.state.edge : this.props.edge;
    const { amplitude, freq } = getAmplitudeAndFreq(root, edge);

    log('[getPoints] amplitude:', amplitude, 'freq:', freq);

    const dataPoints = buildDataPoints(domain.min, domain.max, root, amplitude, freq);
    console.table(dataPoints);
    return { root: this.props.root, edge: this.props.edge, dataPoints };
  };

  render() {
    const { classes, graphProps } = this.props;
    const { root, edge, dataPoints } = this.getPoints();

    log('root', root.x, root.y, 'edge: ', edge.x, edge.y);

    const raw = dataPoints.map(d => [graphProps.scale.x(d.x), graphProps.scale.y(d.y)]);
    return (
      <g>
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

        <BasePoint
          graphProps={graphProps}
          x={root.x}
          y={root.y}
          onDragStart={this.startRootDrag}
          onDragStop={this.stopRootDrag}
          onDrag={this.dragRoot}
          onMove={this.moveRoot}
        />
        <BasePoint
          graphProps={graphProps}
          x={edge.x}
          y={edge.y}
          onDragStart={this.startEdgeDrag}
          onDragStop={this.stopEdgeDrag}
          onDrag={this.dragEdge}
          onMove={this.moveEdge}
        />
      </g>
    );
  }
}
const Sine = withStyles(theme => ({
  sinePath: {
    //stroke: theme.palette.secondary.light
  }
}))(RawSine);

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
      <Sine root={mark.root} edge={mark.edge} graphProps={graphProps} onChange={this.changeMark} />
    );
  }
}
