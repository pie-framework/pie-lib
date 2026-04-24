import IconBase from './icon-base';
import PropTypes from 'prop-types';
import React from 'react';

// X mark for incorrect
const Ex = ({ fill }) => (
  <g transform="translate(0.5, 0.5)">
    <rect
      x="11"
      y="17.3"
      transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.852 19.2507)"
      width="16.6"
      height="3.7"
      fill={fill}
    />
    <rect
      x="17.4"
      y="10.7"
      transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.8175 19.209)"
      width="3.7"
      height="16.6"
      fill={fill}
    />
  </g>
);

Ex.propTypes = {
  fill: PropTypes.string.isRequired,
};

// Emoji version
const Emoji = ({ fill }) => (
  <g transform="translate(1,0)">
    <rect x="21" y="12.9" width="3.7" height="4.7" fill={fill} />
    <rect x="12.7" y="12.9" width="3.7" height="4.7" fill={fill} />
    <rect x="12.2" y="22.5" width="13" height="3.3" fill={fill} />
  </g>
);

Emoji.propTypes = {
  fill: PropTypes.string.isRequired,
};

// Exported Incorrect icon
export const Incorrect = IconBase(Ex, Emoji);

Incorrect.propTypes = {
  iconSet: PropTypes.oneOf(['emoji', 'check']),
  shape: PropTypes.oneOf(['round', 'square']),
  category: PropTypes.oneOf(['feedback', undefined]),
  open: PropTypes.bool,
  fg: PropTypes.string,
  bg: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Incorrect.defaultProps = {
  iconSet: 'check',
  shape: 'round',
  category: undefined,
  open: false,
  fg: '#fcb733', // foreground color
  bg: '#fbf2e3', // background color
  size: 30,
};

export default Incorrect;
