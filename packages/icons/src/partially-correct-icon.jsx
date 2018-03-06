import IconBase from './icon-base';
import PropTypes from 'prop-types';
import React from 'react';
import { getStyles } from './icon-root';
import injectSheet from 'react-jss';

const styles = getStyles('partially-correct', '#4aaf46', '#c1e1ac');

const Check = ({ className }) => (
  <g transform={`translate(0, 0)`}>
    <polygon className={className} points="27.5,13.4 23.9,11.4 15.9,25.8 19.1,28.6" />
    <polygon className={className} points="16.2,20.6 14.4,19.2 11.8,22.3 14.1,24.3" />
  </g>
)

const Emoji = ({ className }) => (
  <g transform={`translate(2, 0)`}>
    <rect x="20.6" y="11.8" className={className} width="4" height="5" />
    <rect x="11.5" y="11.8" className={className} width="4" height="5" />
    <rect x="10.9" y="22.9" transform="matrix(0.9794 -0.2019 0.2019 0.9794 -4.6237 4.1559)" className={className} width="14.3" height="3.7" />
  </g>
)


export const PartiallyCorrect = IconBase(Check, Emoji);

PartiallyCorrect.propTypes = {
  iconSet: PropTypes.oneOf(['emoji', 'check']),
  shape: PropTypes.oneOf(['round', 'square']),
  category: PropTypes.oneOf(['feedback', undefined]),
  open: PropTypes.bool
};

PartiallyCorrect.defaultProps = {
  iconSet: 'check',
  shape: 'round',
  category: undefined,
  open: false
};

export default injectSheet(styles)(PartiallyCorrect);