import React from 'react';
import PropTypes from 'prop-types';
import * as vx from '@vx/grid';
import { types, utils } from '@pie-lib/plot';
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
    const { scale, size, domain, range } = graphProps;
    const rowTickValues = getTickValues(range);
    const columnTicksValues = getTickValues(domain);

    return (
      <vx.Grid
        innerRef={r => (this.grid = r)}
        xScale={scale.x}
        yScale={scale.y}
        width={size.width}
        height={size.height}
        className={classes.grid}
        rowTickValues={rowTickValues}
        columnTickValues={columnTicksValues}
      />
    );
  }
}

export default withStyles(() => ({
  grid: {
    stroke: 'purple' // TODO hardcoded color
  }
}))(Grid);
