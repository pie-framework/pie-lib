import React from 'react';
import PropTypes from 'prop-types';
import { ToolPropTypeFields } from '../types';
import debug from 'debug';
import { types } from '@pie-lib/plot';
import LinePath from '../shared/line-path';
import { curveMonotoneX } from '@vx/curve';
import Point from '@mapbox/point-geometry';
import { BasePoint } from '../common/point/index';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { sinY, buildDataPoints } from '../utils';
import { withRootEdge } from '../shared/with-root-edge';

const FREQ_DIVIDER = 16;

const log = debug('pie-lib:graphing:sine');

log('sine...');
const getAmplitudeAndFreq = (root, edge) => {
  if (!edge) {
    return { freq: 0, amplitude: 0 };
  }

  if (root.x == edge.x) {
    return { freq: 0, amplitude: 0 };
  }

  const r = new Point(root.x, root.y);
  const e = new Point(edge.x, edge.y);
  const d = e.sub(r);
  // edge point describes 1/4 of the freq
  return { freq: d.x * 4, amplitude: d.y };
};

const Sine = withRootEdge((props, state) => {
  const { domain } = props.graphProps;

  if (state.line) {
    /** line is being transformed by drag, so we want to build it's data points off of the props instead of the state.line object. */
    // const root = utils.point(this.props.root).add(this.state.lineAnchor);
    const { amplitude, freq } = getAmplitudeAndFreq(props.root, props.edge);
    const interval = freq / FREQ_DIVIDER;
    const dataPoints = buildDataPoints(
      domain.min,
      domain.max,
      props.root,
      props.edge,
      interval,
      sinY(amplitude, freq, { phase: props.root.x, vertical: props.root.y })
    );
    return {
      root: state.line.root,
      edge: state.line.edge,
      dataPoints,
      onClick: props.onClick,
      changeLabel: props.changeLabel,
      showLabel: props.showLabel
    };
  }

  const root = state.root ? state.root : props.root;
  const edge = state.edge ? state.edge : props.edge;
  const { amplitude, freq } = getAmplitudeAndFreq(root, edge);
  const interval = freq / FREQ_DIVIDER;
  log('[getPoints] amplitude:', amplitude, 'freq:', freq);

  const dataPoints =
    edge && edge.x === root.x
      ? []
      : buildDataPoints(
          domain.min,
          domain.max,
          root,
          edge,
          interval,
          sinY(amplitude, freq, { phase: root.x, vertical: root.y })
        );
  return {
    root: props.root,
    edge: props.edge,
    dataPoints,
    onClick: props.onClick,
    changeLabel: props.changeLabel,
    showLabel: props.showLabel
  };
});

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

  changeLabel = label => {
    const { mark, onChange } = this.props;

    const m = { ...mark, label, showLabel: !(label === undefined) };
    onChange(mark, m);
  };

  render() {
    const { mark, graphProps, onClick } = this.props;
    return (
      <Sine
        root={mark.root}
        edge={mark.edge}
        graphProps={graphProps}
        onClick={onClick}
        onChange={this.changeMark}
        changeLabel={this.changeLabel}
        showLabel={mark.showLabel}
      />
    );
  }
}
