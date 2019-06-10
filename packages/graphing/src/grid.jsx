import React from 'react';
import PropTypes from 'prop-types';
import * as vx from '@vx/grid';
import { tickCount } from './utils';
import { types, utils } from '@pie-lib/plot';
import { withStyles } from '@material-ui/core/styles';

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
    return (
      <vx.Grid
        innerRef={r => (this.grid = r)}
        xScale={scale.x}
        yScale={scale.y}
        width={size.width}
        height={size.height}
        numTicksColumns={tickCount(domain.min, domain.max, domain.step)}
        className={classes.grid}
        numTicksRows={tickCount(range.min, range.max, range.step)}
      />
    );
  }
}

export default withStyles(theme => ({
  grid: {
    stroke: 'purple'
  }
}))(Grid);
