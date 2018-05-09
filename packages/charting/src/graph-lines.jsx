import React from 'react';
import PropTypes from 'prop-types';
import DomainAndRange from './domain-and-range';
import { LineType } from './charting-types';
import ExpressionLine from './expression-line';

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
