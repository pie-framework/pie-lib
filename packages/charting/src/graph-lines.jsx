import React from 'react';
import PropTypes from 'prop-types';
import DomainAndRange from './domain-and-range';
import { LineType } from './charting-types';
import ExpressionLine from './expression-line';
import Point, { utils as pointUtils } from './point';
import { snapTo } from './utils';

export default class GraphLines extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    lines: PropTypes.arrayOf(LineType).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    domain: PropTypes.object.isRequired,
    range: PropTypes.object.isRequired,
    onAddPoint: PropTypes.func,
    onAddLine: PropTypes.func.isRequired,
    onLineChange: PropTypes.func.isRequired,
    maxLines: PropTypes.number.isRequired,
    onLineClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    maxLines: 1
  };

  constructor(props) {
    super(props);

    this.state = {
      point: null,
    };
  }

  movePoint = (from, to) => {
    this.setState({ point: pointUtils.trim(to) });
  };

  getPointBounds = p => pointUtils.bounds(p, this.props.domain, this.props.range);

  onDomainClick = point => {
    const { domain, range, maxLines, lines } = this.props;
    const snapped = {
      x: snapTo(domain.min, domain.max, domain.step, point.x),
      y: snapTo(range.min, range.max, range.step, point.y)
    };

    if (!lines.length || (lines.length && maxLines > lines.length)) {
      if (!this.state.point) {
        this.setState({ point: snapped });

        if (this.props.onAddPoint) {
          this.props.onAddPoint(snapped);
        }
      } else if (snapped.x === this.state.point.x && snapped.y === this.state.point.y) {
        // we already have this point, one point cannot define a line so we do nothing
      } else if (lines.find(line => (line.from.x === snapped.x && line.from.y === snapped.y)
              || (line.to.x === snapped.x && line.to.y === snapped.y))) {
        // we're actually trying to select a point that already defines a line, not add a new point - so do nothing
      } else {
        const from = {
          x: this.state.point.x,
          y: this.state.point.y
        };

        this.props.onAddLine({ from, to: snapped });
        this.setState({ point: null });
      }
    }
  };

  render() {
    const {
      className,
      disabled,
      lines,
      onLineChange,
      onLineClick,
      width,
      height,
      domain,
      range
    } = this.props;
    const { point } = this.state;

    return (
      <DomainAndRange
        className={className}
        disabled={disabled}
        width={width}
        height={height}
        domain={domain}
        range={range}
        onClick={this.onDomainClick}
      >
        {lines.map((l, index) => {
          return (
            <ExpressionLine
              disabled={disabled}
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
        {point && <Point
          showCoordinates={true}
          showLabels={false}
          {...point}
          disabled={disabled}
          empty={false}
          bounds={this.getPointBounds(point)}
          interval={1}
          onMove={n => this.movePoint(point, n)}
        />}
      </DomainAndRange>
    );
  }
}
