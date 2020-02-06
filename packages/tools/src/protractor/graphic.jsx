import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import range from 'lodash/range';
import PropTypes from 'prop-types';
import { strokeColor, noSelect } from '../style-utils';

const Line = withStyles(theme => ({
  line: {
    strokeWidth: '0.2',
    stroke: strokeColor(theme)
  }
}))(({ angle, classes, major, minor }) => (
  <line
    transform={`rotate(${angle}, 50.5,50)`}
    className={classes.line}
    style={{}}
    x1="1"
    x2={major ? 10 : minor ? 6 : 3}
    y1="50"
    y2="50"
  />
));

const Spike = withStyles(theme => ({
  line: {
    strokeWidth: '0.2',
    stroke: strokeColor(theme)
  }
}))(({ angle, classes }) => (
  <line
    transform={`rotate(${angle}, 50.5,50)`}
    className={classes.line}
    style={{}}
    x1="15"
    x2={'46'}
    y1="50"
    y2="50"
  />
));

const Text = withStyles(theme => ({
  text: {
    fontSize: '2.5px',
    textAnchor: 'middle',
    fill: strokeColor(theme),
    ...noSelect()
  }
}))(({ angle, classes }) => (
  <text transform={`rotate(${angle - 90}, 50.5, 50)`} className={classes.text} x="50" y="12.5">
    {angle}
  </text>
));

export class Graphic extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes } = this.props;
    return (
      <svg viewBox="0 0 102 61">
        <path
          className={classes.path}
          d="M 1,50 A 1,1 0 0 1 100,50 L 100,60 L 1,60 Z"
          fill="none"
        />
        {range(0, 181).map(r => (
          <Line minor={r % 5 === 0} major={r % 10 === 0} angle={r} key={r} />
        ))}
        {range(0, 181, 10).map(r => (
          <React.Fragment key={r}>
            <Spike angle={r} />
            <Text angle={r} />
          </React.Fragment>
        ))}
        <circle r="4" cx="50.5" cy="50" className={classes.circle} />
        <line className={classes.line} x1="48.5" x2="52.5" y1="50" y2="50" />
        <line
          className={classes.line}
          transform={'rotate(90 50.5 50)'}
          x1="48.5"
          x2="52.5"
          y1="50"
          y2="50"
        />
      </svg>
    );
  }
}

export default withStyles(theme => ({
  path: {
    strokeWidth: '0.2',
    stroke: strokeColor(theme)
  },
  line: {
    strokeWidth: '0.2',
    stroke: strokeColor(theme)
  },
  circle: {
    strokeWidth: '0.2',
    stroke: strokeColor(theme),
    fill: 'none'
  }
}))(Graphic);
