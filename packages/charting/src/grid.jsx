import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { Grid as VxGrid } from '@vx/grid';
import { utils, types } from '@pie-lib/plot';
import { dataToXBand } from './utils';

export class Grid extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    data: PropTypes.array,
    graphProps: types.GraphPropsType.isRequired
  };

  static defaultProps = {};

  render() {
    const { classes, className, data, graphProps } = this.props;

    const { scale, range, size } = graphProps;

    const xBand = dataToXBand(scale.x, data, size.width);

    return (
      <VxGrid
        xScale={xBand}
        yScale={scale.y}
        className={classNames(classes.grid, className)}
        width={size.width}
        height={size.height}
        xOffset={xBand.bandwidth() / 2}
        numTicksRows={utils.tickCount(range.min, range.max, 1)}
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
