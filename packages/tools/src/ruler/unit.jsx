import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { noSelect, strokeColor } from '../style-utils';
import range from 'lodash/range';

const Tick = withStyles(theme => ({
  tick: {
    stroke: strokeColor(theme)
  }
}))(({ x, height, bottom, classes, major, minor }) => {
  const y1 = major ? bottom - height * 2 : minor ? bottom - height * 1.5 : bottom - height;

  return <line y1={y1} y2={bottom} x1={x} x2={x} className={classes.tick} />;
});

const Ticks = ({ count, width, height }) => {
  return (
    <React.Fragment>
      {range(1, count).map(r => {
        return (
          <Tick
            key={r}
            value={r}
            x={r * (width / count)}
            major={r % (count / 2) === 0}
            minor={r % (count / 4) === 0}
            bottom={height}
            height={10}
          />
        );
      })}
    </React.Fragment>
  );
};

Ticks.propTypes = {
  count: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export class Unit extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    last: PropTypes.bool.isRequired,
    config: PropTypes.object.isRequired
  };

  render() {
    const { index, width, height, classes, last, config } = this.props;

    const style = {
      transform: `translate(${width * (index - 1)}px, 0px)`
    };
    return (
      <g style={style}>
        {!last && <line x1={width} y1={0} x2={width} y2={height} className={classes.endTick} />}

        <Ticks count={config.ticks} width={width} height={height} />
        <text width={width} className={classes.label} x={width - 5} y={15}>
          {index}
        </text>
      </g>
    );
  }
}

export default withStyles(theme => ({
  endTick: {
    stroke: strokeColor(theme),
    strokeWidth: 1
  },
  label: {
    textAnchor: 'end',
    fontSize: '12px',
    fill: strokeColor(theme),
    ...noSelect()
  },
  base: {
    fill: 'none',
    stroke: 'red'
  }
}))(Unit);
