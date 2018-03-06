import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

const OpenIcon = ({ bg, fg }) => <svg preserveAspectRatio="xMinYMin meet" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="-283 359 34 35" style={{ enableBackground: 'new -283 359 34 35' }}>
  <circle className={bg} cx="-266" cy="375.9" r="14" />
  <path className={bg} d="M-280.5,375.9c0-8,6.5-14.5,14.5-14.5s14.5,6.5,14.5,14.5s-6.5,14.5-14.5,14.5S-280.5,383.9-280.5,375.9z
    M-279.5,375.9c0,7.4,6.1,13.5,13.5,13.5c7.4,0,13.5-6.1,13.5-13.5s-6.1-13.5-13.5-13.5C-273.4,362.4-279.5,368.5-279.5,375.9z" />
          <polygon className={fg} points="-265.4,383.1 -258.6,377.2 -261.2,374.2 -264.3,376.9 -268.9,368.7 -272.4,370.6         " />
</svg>;


const CloseIcon = ({ bg, fg, border }) => <svg preserveAspectRatio="xMinYMin meet" version="1.1" x="0px" y="0px" viewBox="-129.5 127 34 35" style={{ enableBackground: 'new -129.5 127 34 35' }}>
  <path style={{ fill: '#D0CAC5', stroke: '#E6E3E0', strokeWidth: 0.75, strokeMiterlimit: 10 }} d="M-112.9,160.4c-8.5,0-15.5-6.9-15.5-15.5c0-8.5,6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5
    C-97.4,153.5-104.3,160.4-112.9,160.4z"/>
        <path style={{ fill: '#B3ABA4', stroke: '#CDC7C2', strokeWidth: 0.5, strokeMiterlimit: 10 }} d="M-113.2,159c-8,0-14.5-6.5-14.5-14.5s6.5-14.5,14.5-14.5s14.5,6.5,14.5,14.5S-105.2,159-113.2,159z" />
  <circle className={bg}
    cx="-114.2" cy="143.5" r="14" />
  <path className={border} d="M-114.2,158c-8,0-14.5-6.5-14.5-14.5s6.5-14.5,14.5-14.5s14.5,6.5,14.5,14.5S-106.2,158-114.2,158z
    M-114.2,130c-7.4,0-13.5,6.1-13.5,13.5s6.1,13.5,13.5,13.5s13.5-6.1,13.5-13.5S-106.8,130-114.2,130z"/>
        <polygon className={fg} points="-114.8,150.7 -121.6,144.8 -119,141.8 -115.9,144.5 -111.3,136.3 -107.8,138.2" />
</svg>;


const styles = {
  root: {
    width: props => props.size || '25px',
    height: props => props.size || '25px'
  },
  hideIconBg: {
    fill: '#bce2ff'
  },
  hideIconFg: {
    fill: '#1a9cff'
  },
  showIconBg: {
    fill: 'white'
  },
  showIconFg: {
    fill: '#1a9cff'
  },
  showIconBorder: {
    fill: '#bce2ff'
  }
}

const CorrectResponse = ({ open, classes, className }) => <div className={classNames(className, classes.root)}>{open ? <OpenIcon
  bg={classes.hideIconBg}
  fg={classes.hideIconFg} /> : <CloseIcon
    bg={classes.showIconBg}
    border={classes.showIconBorder}
    fg={classes.showIconFg} />}</div>;

CorrectResponse.propTypes = {
  open: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string
};

CorrectResponse.defaultProps = {
  open: false
};

export default injectSheet(styles)(CorrectResponse);

