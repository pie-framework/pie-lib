import IconBase from './icon-base';
import PropTypes from 'prop-types';
import React from 'react';
import { getStyles } from './icon-root';
import injectSheet from 'react-jss';

const Ex = ({ className }) => (
  <g transform={`translate(0.5, 0.5)`}>
    <rect x="11" y="17.3" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.852 19.2507)" className={className} width="16.6" height="3.7" />
    <rect x="17.4" y="10.7" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.8175 19.209)" className={className} width="3.7" height="16.6" />
  </g>
);

const Emoji = ({ className }) => (
  <g transform={`translate(1,0)`}>
    <rect x="21" y="12.9" className={className} width="3.7" height="4.7" />
    <rect x="12.7" y="12.9" className={className} width="3.7" height="4.7" />
    <rect x="12.2" y="22.5" className={className} width="13" height="3.3" />
  </g>
)

const styles = getStyles('incorrect', '#fbf2e3', '#fcb733');

export const Incorrect = IconBase(Ex, Emoji);

export default injectSheet(styles)(Incorrect);

Incorrect.propTypes = {
  iconSet: PropTypes.oneOf(['emoji', 'check']),
  shape: PropTypes.oneOf(['round', 'square']),
  category: PropTypes.oneOf(['feedback', undefined]),
  open: PropTypes.bool
};

Incorrect.defaultProps = {
  iconSet: 'check',
  shape: 'round',
  category: undefined,
  open: false
};
