import IconBase from './icon-base';
import PropTypes from 'prop-types';
import React from 'react';
import { getStyles } from './icon-root';
import injectSheet from 'react-jss';

const styles = getStyles('correct', '#f8ffe2', '#4aaf46');

const Emoji = ({ className }) => (<g transform={`translate(1, 0)`} >
  <path className={className} d="M24.7,22.1c-1.5,1.7-3.6,2.7-5.8,2.7s-4.5-1.1-5.8-2.7l-2.8,1.6c2,2.7,5.2,4.2,8.7,4.2
    c3.4,0,6.6-1.6,8.7-4.2L24.7,22.1z"/>
            <rect x="21.1" y="13.1" className={className} width="3.7" height="4.7" />
  <rect x="12.7" y="13.1" className={className} width="3.7" height="4.7" />
</g>);

Emoji.defaultProps = {
  x: 0
}

const Check = ({ className, x, y }) => (
  <polygon
    transform={`translate(${x}, ${y})`}
    className={className}
    points="19.1,28.6 11.8,22.3 14.4,19.2 17.9,22.1 23.9,11.4 27.5,13.4" />
)
Check.defaultProps = {
  x: 0,
  y: 0
}

export const Correct = IconBase(Check, Emoji);


Correct.propTypes = {
  iconSet: PropTypes.oneOf(['emoji', 'check']),
  shape: PropTypes.oneOf(['round', 'square']),
  category: PropTypes.oneOf(['feedback', undefined]),
  open: PropTypes.bool
};

Correct.defaultProps = {
  iconSet: 'check',
  shape: 'round',
  category: undefined,
  open: false
};

export default injectSheet(styles)(Correct);

