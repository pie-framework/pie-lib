import React from 'react';
import PropTypes from 'prop-types';
import * as vx from '@vx/grid';
import { types, utils } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import { getTickValues } from './utils';

export class Grid extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  shouldComponentUpdate(nextProps) {
    const { graphProps } = this.props;
    const { graphProps: nextGraphProps } = nextProps;

    return !utils.isDomainRangeEqual(graphProps, nextGraphProps);
  }

  render() {
    const { classes, graphProps } = this.props;
    const {
      scale,
      size: { height, width },
      domain,
      range
    } = graphProps;
    const rowTickValues = getTickValues(range);
    const columnTickValues = getTickValues(domain);
    const horizontalDistanceToZero = scale.x(0);
    const verticalDistanceToZero = scale.y(0);

    const rowTickLabelValues = getTickValues({ ...range, step: range.labelStep }).filter(value =>
      rowTickValues.includes(value)
    );
    const columnTickLabelValues = getTickValues({
      ...domain,
      step: domain.labelStep
    }).filter(value => columnTickValues.includes(value));

    const displayDarkerGrid =
      rowTickLabelValues.length > 1 &&
      columnTickLabelValues.length > 1 &&
      (rowTickLabelValues.length !== rowTickValues.length ||
        columnTickLabelValues.length !== columnTickValues.length);

    const minValueLength =
      (rowTickLabelValues.length && Math.min(...rowTickLabelValues).toString().length) || 1;
    const maxValueLength =
      (rowTickLabelValues.length && Math.max(...rowTickLabelValues).toString().length) || 1;
    const labelLength = Math.max(minValueLength, maxValueLength) * 8 + 16;

    return (
      <>
        <vx.Grid
          innerRef={r => (this.grid = r)}
          xScale={scale.x}
          yScale={scale.y}
          width={width}
          height={height}
          className={classes.grid}
          rowTickValues={rowTickValues}
          columnTickValues={columnTickValues}
        />
        {displayDarkerGrid && (
          <>
            <vx.GridRows
              scale={scale.y}
              width={width}
              tickValues={rowTickLabelValues}
              stroke={color.primary()}
              strokeDasharray={`${horizontalDistanceToZero - labelLength} ${labelLength} ${width}`}
            />
            <vx.GridColumns
              scale={scale.x}
              height={height}
              tickValues={columnTickLabelValues}
              stroke={color.primary()}
              strokeDasharray={`${verticalDistanceToZero} 28 ${height}`}
            />
          </>
        )}
      </>
    );
  }
}

export default withStyles(() => ({
  grid: {
    stroke: 'purple' // TODO hardcoded color
  }
}))(Grid);
