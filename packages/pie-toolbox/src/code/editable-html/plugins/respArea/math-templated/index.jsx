import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const MathTemplated = ({ attributes, value, classes, keyToDisplay }) => (
  <span {...attributes} className={classes.spanContainer}>
    <div className={classes.responseBox}>{keyToDisplay}</div>
    <div className={classes.mathBlock} dangerouslySetInnerHTML={{ __html: value || '<div>&nbsp;</div>' }} />
  </span>
);

MathTemplated.propTypes = {
  attributes: PropTypes.object,
  classes: PropTypes.object.isRequired,
  value: PropTypes.string,
  keyToDisplay: PropTypes.string,
};

const styles = (theme) => ({
  responseBox: {
    background: theme.palette.grey['A100'],
    color: theme.palette.grey['A700'],
    display: 'inline-flex',
    borderRight: '2px solid #C0C3CF',
    boxSizing: 'border-box',
    overflow: 'hidden',
    fontSize: '12px',
    height: '100%',
    alignItems: 'center',
  },
  spanContainer: {
    display: 'inline-flex',
    border: '1px solid #C0C3CF',
    margin: '0 5px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '50px',
    minHeight: '36px',
    height: '36px',
  },
  mathBlock: {
    flex: 8,
    color: 'var(--pie-text, black)',
    padding: '4px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--pie-background, rgba(255, 255, 255, 0))',
  },
});

export default withStyles(styles)(MathTemplated);
