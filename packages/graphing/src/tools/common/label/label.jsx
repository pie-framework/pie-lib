import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';

export class RawLabel extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    graphProps: types.GraphPropsType.isRequired,
    onChange: PropTypes.func,
    onRemove: PropTypes.func
  };

  render() {
    const {
      classes,
      className,
      x,
      y,
      disabled,
      correctness,
      graphProps,
      onChange,
      onRemove
    } = this.props;
    const { scale } = graphProps;

    return (
      <g
        className={classNames(
          classes.point,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
      >
        <foreignObject x={scale.x(x)} y={scale.y(y)} width="1" height="1" overflow="visible">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <input
              size="35"
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none'
              }}
              placeholder="Label"
              onChange={({ target }) => {
                onChange(target.value);
              }}
              onBlur={({ target }) => {
                if (target.value === '') {
                  onRemove();
                }
              }}
            />
          </div>
        </foreignObject>
      </g>
    );
  }
}
