import React from 'react';
import PropTypes from 'prop-types';
import DomainAndRange from './domain-and-range';
import Point, { utils } from './point';
import debug from 'debug';
import { snapTo } from './utils';
import { PointType } from './charting-types';

const { hasPoint, trim, pointIndex } = utils;

const log = debug('pie-lib:charting:plot-points');

export default class PlotPoints extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    points: PropTypes.arrayOf(PointType),
    domain: PropTypes.object.isRequired,
    range: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    onAddPoint: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    onMovePoint: PropTypes.func.isRequired,
    selection: PropTypes.arrayOf(PointType),
    labels: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.oneOf(['numbers', 'letters'])
    ]),
    showPointCoordinates: PropTypes.bool,
    showPointLabels: PropTypes.bool,
    maxNoOfPoints: PropTypes.oneOfType([
      PropTypes.string, PropTypes.number
    ]),
  };

  static defaultProps = {
    showPointLabels: true
  };

  getPointBounds = p => utils.bounds(p, this.props.domain, this.props.range);

  onDomainClick = point => {
    const { onAddPoint, domain, range, points, maxNoOfPoints } = this.props;
    const snapped = {
      x: snapTo(domain.min, domain.max, domain.step, point.x),
      y: snapTo(range.min, range.max, range.step, point.y)
    };
    const max = maxNoOfPoints || 0;

    if (!hasPoint(points, snapped) && (max === 0 || points.length < max)) {
      //Note: adding the label is outside the scope of this comp.
      onAddPoint(snapped);
    }
  };

  selectedIndex = p => {
    return pointIndex(this.props.selection, p);
  };

  isSelected = p => {
    return hasPoint(this.props.selection, p);
  };

  toggleSelectPoint = p => {
    const { onSelectionChange } = this.props;
    const point = trim(p);
    const index = this.selectedIndex(point);

    const selection = (this.props.selection || []).slice();

    if (index === -1) {
      selection.push(point);
    } else {
      selection.splice(index, 1);
    }

    log('[toggleSelectPoint] selection:', selection);

    onSelectionChange(selection);
  };

  movePoint = (from, to) => {
    const { onMovePoint } = this.props;
    onMovePoint(trim(from), trim(to));
  };

  render() {
    const {
      title,
      width,
      height,
      domain,
      range,
      points,
      disabled,
      showPointLabels,
      showPointCoordinates
    } = this.props;

    const preppedPoints = (points || []).map(p => ({
      ...p,
      selected: this.isSelected(p)
    }));

    return (
      <DomainAndRange
        title={title}
        disabled={disabled}
        onClick={this.onDomainClick}
        width={width}
        height={height}
        domain={domain}
        range={range}
      >
        {preppedPoints.map((p, index) => (
          <Point
            key={index}
            showCoordinates={showPointCoordinates}
            showLabels={showPointLabels}
            {...p}
            disabled={disabled}
            onClick={() => this.toggleSelectPoint(p)}
            empty={false}
            bounds={this.getPointBounds(p)}
            onMove={n => this.movePoint(p, n)}
            interval={1}
          />
        ))}
      </DomainAndRange>
    );
  }
}
