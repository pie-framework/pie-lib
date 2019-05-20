import React from 'react';
import PropTypes from 'prop-types';
import { ToolPropType } from '../types';
import debug from 'debug';
import { types } from '@pie-lib/plot';
import { LinePath } from '@vx/shape';
import { Group } from '@vx/group';
import { curveMonotoneX, curveNatural } from '@vx/curve';
// import { genDateValue } from '@vx/mock-data';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';
import _ from 'lodash';
import Point from '@mapbox/point-geometry';
import BasePoint from '../point/base-point';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { PointType } from '../../../lib/tools/types';
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
  return amplitude * parseFloat(Math.sin(frac).toFixed(3));
};

const buildDataPoints = (min, max, amplitude, freq) => {
  const fn = sinY(amplitude, freq);
  return _.range(min, max + freq / 4, freq / 4).map(v => ({
    x: v,
    y: fn(v)
  }));
};

class RawSine extends React.Component {
  static propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    classes: PropTypes.object.isRequired,
    root: PointType.isRequired,
    edge: PointType
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  startEdgeDrag = edge => {
    // this.setState({ edge });
  };

  stopEdgeDrag = () => {
    this.setState({ edge: undefined });
  };

  dragEdge = edge => {
    log('[dragEdge] edge:', edge);
    this.setState({ edge });
  };

  startRootDrag = root => {};

  dragRoot = root => {
    this.setState({ root });
  };

  stopRootDrag = () => {
    this.setState({ root: undefined });
  };

  render() {
    const { classes, graphProps } = this.props;
    log('graphProps', graphProps);

    const edge = this.state.edge ? this.state.edge : this.props.edge;
    const root = this.state.root ? this.state.root : this.props.root;
    const { amplitude, freq } = getAmplitudeAndFreq(root, edge);

    log('amplitude: ', amplitude, 'freq: ', freq);
    // now build out the data points
    const { domain } = graphProps;
    const dataPoints = buildDataPoints(domain.min, domain.max, amplitude, freq);

    log('dataPoints:', dataPoints);
    const raw = dataPoints.map(d => [graphProps.scale.x(d.x), graphProps.scale.y(d.y)]);
    return (
      <g>
        <LinePath
          className={classNames(classes.sinePath)}
          xScale={d => graphProps.scale.x(d.x)}
          ySCale={d => graphProps.scale.y(d.y)}
          strokeWidth={2}
          data={raw}
        />

        <BasePoint
          graphProps={graphProps}
          x={this.props.root.x}
          y={this.props.root.y}
          onDragStart={this.startRootDrag}
          onDragStop={this.stopRootDrag}
          onDrag={this.dragRoot}
        />
        <BasePoint
          graphProps={graphProps}
          x={this.props.edge.x}
          y={this.props.edge.y}
          onDragStart={this.startEdgeDrag}
          onDragStop={this.stopEdgeDrag}
          onDrag={this.dragEdge}
        />
      </g>
    );
  }
}
const Sine = withStyles(theme => ({
  sinePath: {
    stroke: theme.palette.secondary.light
  }
}))(RawSine);

// ({ classes, root, edge, graphProps }) => {
//   log('graphProps', graphProps);

//   const { amplitude, freq } = getAmplitudeAndFreq(root, edge);

//   log('amplitude: ', amplitude, 'freq: ', freq);
//   // now build out the data points
//   const { domain } = graphProps;
//   const dataPoints = buildDataPoints(domain.min, domain.max, amplitude, freq);

//   log('dataPoints:', dataPoints);
//   const raw = dataPoints.map(d => [graphProps.scale.x(d.x), graphProps.scale.y(d.y)]);
//   return (
//     <g>
//       <LinePath
//         className={classNames(classes.sinePath)}
//         xScale={d => graphProps.scale.x(d.x)}
//         ySCale={d => graphProps.scale.y(d.y)}
//         strokeWidth={2}
//         data={raw}
//       />

//       <BasePoint graphProps={graphProps} x={root.x} y={root.y} />
//       <BasePoint
//         graphProps={graphProps}
//         x={edge.x}
//         y={edge.y}
//         onDragStart={startEdgeDrag}
//         onDragStop={stopEdgeDrag}
//         onDrag={dragEdge}
//       />
//     </g>
//   );
// });

export default class Component extends React.Component {
  static propTypes = {
    ...ToolPropType,
    graphProps: types.GraphPropsType.isRequired,
    foo: PropTypes.string
  };

  static defaultProps = {};

  render() {
    const { mark, graphProps } = this.props;
    return <Sine root={mark.root} edge={mark.edge} graphProps={graphProps} />;
  }
}
