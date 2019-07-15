import React from 'react';
import PropTypes from 'prop-types';
import { select, mouse } from 'd3-selection';
import { types, utils } from '@pie-lib/plot';
import { getTickValues } from './utils';

export default class Bg extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  static defaultProps = {};

  componentDidMount() {
    const rect = select(this.rect);
    rect.on('click', this.onRectClick.bind(this, rect));
  }

  shouldComponentUpdate(nextProps) {
    return (
      !utils.isDomainRangeEqual(this.props.graphProps, nextProps.graphProps) ||
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height
    );
  }
  /**
   * Note: we use d3 click + mouse to give us domain values directly.
   * Saves us having to calculate them ourselves from a MouseEvent.
   */
  onRectClick = rect => {
    const { onClick, graphProps } = this.props;
    const { scale } = graphProps;
    const coords = mouse(rect._groups[0][0]);
    const x = scale.x.invert(coords[0]);
    const y = scale.y.invert(coords[1]);
    const rowTicks = getTickValues(graphProps.range);
    const columnTicks = getTickValues(graphProps.domain);

    const closest = (ticks, value) => {
      return ticks.reduce((prev, curr) => {
        const currentDistance = Math.abs(curr - value);
        const previousDistance = Math.abs(prev - value);
        return currentDistance <= previousDistance ? curr : prev;
      });
    };

    let snapped = {};

    if (columnTicks.indexOf(x) >= 0 && rowTicks.indexOf(y) >= 0) {
      snapped.x = x;
      snapped.y = y;
    } else {
      snapped.x = closest(columnTicks, x);
      snapped.y = closest(rowTicks, y);
    }

    onClick(snapped);
  };

  render() {
    const { width, height } = this.props;
    return (
      <rect
        ref={rect => (this.rect = rect)}
        fill="red"
        fillOpacity="0.0"
        width={width}
        height={height}
      />
    );
  }
}
