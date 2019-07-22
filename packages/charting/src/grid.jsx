import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { Grid as VxGrid } from '@vx/grid';
import { types } from '@pie-lib/plot';
import { dataToXBand } from './utils';
import { getTickValues } from './utils';

export class Grid extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    data: PropTypes.array,
    graphProps: types.GraphPropsType.isRequired
  };

  static defaultProps = {};

  render() {
    const { classes, className, data, graphProps, type } = this.props;

    const { scale, range, size, domain } = graphProps;

    const xBand = dataToXBand(scale.x, data, size.width, type);
    const rowTickValues = getTickValues(range);
    // TODO use columnTickValues when needed
    const columnTickValues = type === 'line' ? undefined : [];

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
