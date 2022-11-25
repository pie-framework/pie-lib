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
    disabledAdditionalGrid: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    graphProps: types.GraphPropsType.isRequired,
  };

  getAdditionalGridProps = (rowTickValues, columnTickValues) => {
    const {
      graphProps: {
        scale,
        size: { width, height },
        domain,
        range,
      },
    } = this.props;
    const rowTickLabelValues = getTickValues({
      ...range,
      step: range.labelStep,
    }).filter((value) => rowTickValues.includes(value));
    const columnTickLabelValues = getTickValues({
      ...domain,
      step: domain.labelStep,
    }).filter((value) => columnTickValues.includes(value));

    const minValueLength =
      (rowTickLabelValues.length &&
        Math.min(...rowTickLabelValues)
          .toString()
          .replace(/[.-]/g, '').length) ||
      1;
    const maxValueLength =
      (rowTickLabelValues.length &&
        Math.max(...rowTickLabelValues)
          .toString()
          .replace(/[.-]/g, '').length) ||
      1;

    const rowLabelLength = Math.max(minValueLength, maxValueLength) * 9 + 22;
    const horizontalDistanceToZero = scale.x(0);
    const verticalDistanceToZero = scale.y(0);
    const columnLabelLength = 28;
    const rowStrokeDasharray = `${horizontalDistanceToZero - rowLabelLength} ${rowLabelLength} ${width}`;
    const columnStrokeDasharray = `${verticalDistanceToZero} ${columnLabelLength} ${height}`;

    const displayAdditionalGrid =
      domain.labelStep > 0 &&
      range.labelStep > 0 &&
      rowTickLabelValues &&
      columnTickLabelValues &&
      rowTickLabelValues.length > 1 &&
      columnTickLabelValues.length > 1 &&
      (rowTickLabelValues.length !== rowTickValues.length || columnTickLabelValues.length !== columnTickValues.length);

    const filteredColumnValues = columnTickLabelValues.filter(
      (value) => value >= 0 || horizontalDistanceToZero - scale.x(value) > rowLabelLength,
    );
    const filteredRowValues = rowTickLabelValues.filter(
      (value) => value >= 0 || scale.y(value) - verticalDistanceToZero > columnLabelLength,
    );

    return {
      rowTickLabelValues: filteredRowValues,
      columnTickLabelValues: filteredColumnValues,
      rowStrokeDasharray,
      columnStrokeDasharray,
      displayAdditionalGrid,
    };
  };

  render() {
    const { classes, graphProps } = this.props;
    const {
      scale,
      size: { height, width },
      domain,
      range,
    } = graphProps;
    const rowTickValues = getTickValues(range);
    const columnTickValues = getTickValues(domain);
    const {
      rowTickLabelValues,
      columnTickLabelValues,
      rowStrokeDasharray,
      columnStrokeDasharray,
      displayAdditionalGrid,
    } = this.getAdditionalGridProps(rowTickValues, columnTickValues);

    return (
      <>
        <vx.Grid
          innerRef={(r) => (this.grid = r)}
          xScale={scale.x}
          yScale={scale.y}
          width={width}
          height={height}
          className={classes.grid}
          rowTickValues={rowTickValues}
          columnTickValues={columnTickValues}
        />
        {displayAdditionalGrid && (
          <>
            <vx.GridRows
              scale={scale.y}
              width={width}
              tickValues={rowTickLabelValues}
              stroke={color.primary()}
              strokeDasharray={rowStrokeDasharray}
            />
            <vx.GridColumns
              scale={scale.x}
              height={height}
              tickValues={columnTickLabelValues}
              stroke={color.primary()}
              strokeDasharray={columnStrokeDasharray}
            />
          </>
        )}
      </>
    );
  }
}

export default withStyles(() => ({
  grid: {
    stroke: 'purple', // TODO hardcoded color
  },
}))(Grid);
