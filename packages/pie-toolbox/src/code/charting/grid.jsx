import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { GridRows, GridColumns } from '@vx/grid';

import { types } from '../plot';
import { color } from '../render-ui';

export class Grid extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    graphProps: types.GraphPropsType.isRequired,
    xBand: PropTypes.func,
    columnTickValues: PropTypes.array,
    rowTickValues: PropTypes.array,
  };

  static defaultProps = {};

  render() {
    const { classes, className, graphProps, xBand, rowTickValues, columnTickValues } = this.props;
    const { scale = {}, size = {}, range = {} } = graphProps || {};
    const { step = 0, labelStep = 0 } = range;
    const highlightNonLabel = step && labelStep && step < labelStep;
    // if highlightNonLabel is true, we need to separate the unlabled lines in order to render them in a different color
    const { unlabeledLines, labeledLines } = (rowTickValues || []).reduce(
      (acc, value) => {
        if (highlightNonLabel && value % labelStep !== 0) {
          acc.unlabeledLines.push(value);
        } else {
          acc.labeledLines.push(value);
        }
        return acc;
      },
      { unlabeledLines: [], labeledLines: [] },
    );

    return (
      <g className={classNames(classes.grid, className)}>
        <GridRows
          scale={scale.y}
          width={size.width}
          tickValues={unlabeledLines}
          lineStyle={{
            stroke: color.fadedPrimary(),
            strokeWidth: 1,
          }}
        />
        <GridRows
          scale={scale.y}
          width={size.width}
          tickValues={labeledLines}
          lineStyle={{
            stroke: color.visualElementsColors.GRIDLINES_COLOR,
            strokeWidth: 1,
          }}
        />
        <GridColumns scale={xBand} height={size.height} offset={xBand.bandwidth() / 2} tickValues={columnTickValues} />
      </g>
    );
  }
}

const styles = () => ({
  grid: {
    stroke: color.primaryLight(),
  },
});

export default withStyles(styles)(Grid);
