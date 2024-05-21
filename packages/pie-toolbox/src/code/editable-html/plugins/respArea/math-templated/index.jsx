import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const MathTemplated = (props) => {
  const { attributes, value, classes } = props;

  return (
    <span
      {...attributes}
      style={{
        display: 'inline-flex',
        minHeight: '50px',
        minWidth: '50px',
        position: 'relative',
        margin: '0 5px',
        cursor: 'pointer',
      }}
    >
      <div
        className={classes.responseBox}
        dangerouslySetInnerHTML={{
          __html: value || '<div>&nbsp;</div>',
        }}
      />
    </span>
  );
};

MathTemplated.propTypes = {
  attributes: PropTypes.object,
  classes: PropTypes.object,
  error: PropTypes.any,
  value: PropTypes.string,
};

const style = (theme) => ({
  responseBox: {
    background: theme.palette.grey['A100'],
    color: theme.palette.grey['A700'],
    display: 'inline-flex',
    minWidth: '50px',
    minHeight: '36px',
    height: '36px',
    border: '1px solid #C0C3CF',
    boxSizing: 'border-box',
    overflow: 'hidden',
    padding: '8px',
  },
});

export default withStyles(style)(MathTemplated);
