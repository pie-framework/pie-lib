import React from 'react';
import PropTypes from 'prop-types';
import DomainAndRange, { ContextTypes } from './domain-and-range';
import { LineType, PointType } from './charting-types';
import { Line } from '@vx/shape';
import ExpressionLine from './expression-line';

import debug from 'debug';

const log = debug('pie-lib:charting:graph-lines');

class ScaledLine extends React.Component {
  static propTypes = {
    from: PointType.isRequired,
    to: PointType.isRequired
  };

  static contextTypes = ContextTypes();

  scalePoint = p => {
    const { scale } = this.context;
    return {
      x: scale.x(p.x),
      y: scale.y(p.y)
    };
  };

  render() {
    const { from, to } = this.props;
    return <Line from={this.scalePoint(from)} to={this.scalePoint(to)} />;
  }
}
export default class GraphLines extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    lines: PropTypes.arrayOf(LineType).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    domain: PropTypes.object.isRequired,
    range: PropTypes.object.isRequired,
    onLineChange: PropTypes.func.isRequired,
    onLineClick: PropTypes.func.isRequired
  };

  render() {
    const {
      disabled,
      lines,
      onLineChange,
      onLineClick,
      width,
      height,
      domain,
      range
    } = this.props;

    return (
      <DomainAndRange
        disabled={disabled}
        width={width}
        height={height}
        domain={domain}
        range={range}
      >
        {lines.map((l, index) => {
          return (
            <ExpressionLine
              key={index}
              index={index}
              line={l}
              onChange={newLine => onLineChange(l, newLine)}
              onClick={onLineClick}
              selected={l.selected}
              domain={domain}
              range={range}
            />
          );
        })}
      </DomainAndRange>
    );
  }
}
