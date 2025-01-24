import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { mq } from '../../../../math-input';

const MathTemplated = ({ attributes, value, classes, keyToDisplay }) => (
  <span {...attributes} className={classes.spanContainer}>
    <div className={classes.responseBox}>{keyToDisplay}</div>
    <div className={classes.mathBlock}>
      <mq.Static latex={value} />
    </div>
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
    minHeight: '36px',
    height: '100%',
    alignItems: 'center',
    fontFamily: 'Symbola, Times New Roman, serif',
    padding: '0 2px',
  },
  spanContainer: {
    display: 'inline-flex',
    border: '1px solid #C0C3CF',
    margin: '1px 5px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '50px',
    minHeight: '36px',
    height: 'fit-content',
  },
  mathBlock: {
    flex: 8,
    color: 'var(--pie-text, black)',
    padding: '4px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--pie-background, rgba(255, 255, 255, 0))',
    '& > .mq-math-mode sup.mq-nthroot': {
      fontSize: '70% !important',
      verticalAlign: '1em !important',
    },
    '& > .mq-math-mode .mq-sqrt-stem': {
      borderTop: '0.07em solid',
      marginLeft: '-1.5px',
      marginTop: '-2px !important',
      paddingTop: '5px !important',
    },
    '& .mq-overarrow-inner': {
      paddingTop: '0 !important',
      border: 'none !important',
    },
    '& .mq-overarrow.mq-arrow-both': {
      marginTop: '0px',
      minWidth: '1.23em',
      '& *': {
        lineHeight: '1 !important',
      },
      '&:before': {
        top: '-0.4em',
        left: '-1px',
      },
      '&:after': {
        top: '0px !important',
        position: 'absolute !important',
        right: '-2px',
      },
      '&.mq-empty:after': {
        top: '-0.45em',
      },
    },
    '& .mq-overarrow.mq-arrow-right': {
      '&:before': {
        top: '-0.4em',
        right: '-1px',
      },
    },
    '& .mq-overarrow-inner-right': {
      display: 'none !important',
    },
    '& .mq-overarrow-inner-left': {
      display: 'none !important',
    },
  },
});

export default withStyles(styles)(MathTemplated);
