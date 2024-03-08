import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types, gridDraggable } from '../../../plot';
import { color } from '../../../render-ui';
import * as utils from '../../utils';
import classNames from 'classnames';
import { correct, disabled, incorrect, missing } from '../shared/styles';

class RawLine extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    from: types.PointType,
    to: types.PointType,
    graphProps: types.GraphPropsType.isRequired,
    disabled: PropTypes.bool,
    correctness: PropTypes.string,
  };

  static defaultProps = {
    from: {},
    to: {},
  };

  render() {
    const { graphProps, classes, from, to, className, disabled, correctness, ...rest } = this.props;
    const { scale } = graphProps;
    return (
      <line
        x1={scale.x(from.x)}
        y1={scale.y(from.y)}
        x2={scale.x(to.x)}
        y2={scale.y(to.y)}
        className={classNames(classes.line, disabled && classes.disabled, className, classes[correctness])}
        {...rest}
      />
    );
  }
}

export const Line = withStyles(() => ({
  line: {
    strokeWidth: 6,
    transition: 'stroke-width 200ms ease-in, stroke 200ms ease-in',
    stroke: 'transparent',
    '&:hover': {
      strokeWidth: 7,
      stroke: color.defaults.SECONDARY,
    },
  },
  disabled: {
    ...disabled('stroke'),
    strokeWidth: 2,
  },
  correct: correct('stoke'),
  incorrect: incorrect('stroke'),
  missing: missing('stroke'),
}))(RawLine);

export default gridDraggable({
  bounds: (props, { domain, range }) => {
    const { from, to } = props;
    const area = utils.lineToArea(from, to);
    return utils.bounds(area, domain, range);
  },
  anchorPoint: (props) => {
    const { from } = props;
    return from;
  },
  fromDelta: (props, delta) => {
    const { from, to } = props;
    return {
      from: utils.point(from).add(utils.point(delta)),
      to: utils.point(to).add(utils.point(delta)),
    };
  },
})(Line);
