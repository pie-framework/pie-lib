import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { Grid as VxGrid } from '@vx/grid';
import { types } from '@pie-lib/plot';

export class Grid extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    data: PropTypes.array,
    graphProps: types.GraphPropsType.isRequired,
    xBand: PropTypes.object,
    columnTickValues: PropTypes.array,
    rowTickValues: PropTypes.array
  };

  static defaultProps = {};

  render() {
    const { classes, className, graphProps, xBand, rowTickValues, columnTickValues } = this.props;
    const { scale, size } = graphProps;

    return (
      <VxGrid
        xScale={xBand}
        yScale={scale.y}
        className={classNames(classes.grid, className)}
        width={size.width}
        height={size.height}
        xOffset={xBand.bandwidth() / 2}
        rowTickValues={rowTickValues}
        columnTickValues={columnTickValues}
      />
    );
  }
}

const styles = theme => ({
  grid: {
    stroke: theme.palette.primary.light
  }
});

export default withStyles(styles)(Grid);
