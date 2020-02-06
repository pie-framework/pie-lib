import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const Anchor = withStyles(theme => ({
  anchor: {
    cursor: 'pointer',
    width: '20px',
    height: '20px',
    position: 'absolute',
    borderRadius: '10px',
    backgroundColor: `var(--ruler-bg, ${theme.palette.primary.contrastText})`,
    transition: 'background-color 200ms ease-in',
    border: `solid 1px var(--ruler-stroke, ${theme.palette.primary.dark})`,
    '&:hover': {
      backgroundColor: `var(--ruler-bg-hover, ${theme.palette.primary.light})`
    }
  }
}))(({ classes, className }) => <div className={classNames(classes.anchor, className)} />);

export default Anchor;
