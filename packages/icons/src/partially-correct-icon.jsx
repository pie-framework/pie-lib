import IconBase from './icon-base';
import PropTypes from 'prop-types';
import React from 'react';

// Check mark SVG
const Check = ({ fill }) => (
  <g transform="translate(0, 0)">
    <polygon points="27.5,13.4 23.9,11.4 15.9,25.8 19.1,28.6" fill={fill} />
    <polygon points="16.2,20.6 14.4,19.2 11.8,22.3 14.1,24.3" fill={fill} />
  </g>
);

Check.propTypes = { fill: PropTypes.string.isRequired };

// Emoji variant
const Emoji = ({ fill }) => (
  <g transform="translate(2, 0)">
    <rect x="20.6" y="11.8" width="4" height="5" fill={fill} />
    <rect x="11.5" y="11.8" width="4" height="5" fill={fill} />
    <rect
      x="10.9"
      y="22.9"
      transform="matrix(0.9794 -0.2019 0.2019 0.9794 -4.6237 4.1559)"
      width="14.3"
      height="3.7"
      fill={fill}
    />
  </g>
);

Emoji.propTypes = { fill: PropTypes.string.isRequired };

// Exported PartiallyCorrect icon
export const PartiallyCorrect = IconBase(Check, Emoji);

PartiallyCorrect.propTypes = {
  iconSet: PropTypes.oneOf(['emoji', 'check']),
  shape: PropTypes.oneOf(['round', 'square']),
  category: PropTypes.oneOf(['feedback', undefined]),
  open: PropTypes.bool,
  fg: PropTypes.string,
  bg: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PartiallyCorrect.defaultProps = {
  iconSet: 'check',
  shape: 'round',
  category: undefined,
  open: false,
  fg: '#4aaf46', // foreground color
  bg: '#c1e1ac', // background color
  size: 30,
};

export default PartiallyCorrect;
