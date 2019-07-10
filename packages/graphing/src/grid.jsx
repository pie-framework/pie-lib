import React from 'react';
import PropTypes from 'prop-types';
import * as vx from '@vx/grid';
import { types, utils } from '@pie-lib/plot';
import { withStyles } from '@material-ui/core/styles';

const getTickValues = prop => {
  const tickValues = [];
  let tickVal = 0;

  while (tickVal >= prop.min) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal - prop.step) * 100) / 100;
  }

  tickVal = 0;

  while (tickVal <= prop.max) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.step) * 100) / 100;
  }

  return tickValues;
};

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

export default withStyles(theme => ({
  grid: {
    stroke: 'purple'
  }
}))(Grid);
