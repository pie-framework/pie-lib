import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';

const Label = ({ label, editable }) => {
  const onChange = e => {
    console.log('change..', e);
  };
  return <input type="text" value={label} onChange={onChange} />;
};

export class RawBp extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const { classes, className, x, y, disabled, correctness, graphProps, ...rest } = this.props;
    const { scale } = graphProps;
    return (
      <g
        className={classNames(
          classes.point,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        {...rest}
      >
        <circle r="7" cx={scale.x(x)} cy={scale.y(y)} />
      </g>
    );
  }
}
