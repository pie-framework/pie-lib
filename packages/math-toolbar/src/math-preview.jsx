import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { mq } from '@pie-lib/math-input';

const log = debug('@pie-lib:math-toolbar:math-preview');

export class RawMathPreview extends React.Component {
  static propTypes = {
    latex: PropTypes.string,
    node: PropTypes.object,
    classes: PropTypes.object,
    isSelected: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
  };

  render() {
    log('[render] data: ', this.props.node.data);
    const latex = this.props.node.data.get('latex');
    const { classes, isSelected, onFocus, onBlur } = this.props;
    return (
      <div className={classNames(classes.root, isSelected && classes.selected)}>
        {' '}
        <span className={classes.insideOverlay} />
        <mq.Static latex={latex} onFocus={onFocus} onBlur={onBlur} />
      </div>
    );
  }
}

const mp = theme => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    '& *': {
      fontFamily: 'MJXZERO, MJXTEX !important',
      '-webkit-font-smoothing': 'antialiased !important'
    },
    '& > .mq-math-mode': {
      border: 'solid 1px lightgrey'
    },
    '& > .mq-focused': {
      outline: 'none',
      boxShadow: 'none',
      border: 'solid 1px black',
      borderRadius: '0px'
    },
    '& > .mq-math-mode .mq-root-block': {
      paddingTop: '7px !important'
    },
    '& > .mq-math-mode .mq-overarc ': {
      paddingTop: '0.45em !important'
    },
    '& > .mq-math-mode .mq-sqrt-prefix': {
      verticalAlign: 'bottom !important',
      top: '0 !important',
      left: '-0.1em !important'
    },
    '& > .mq-math-mode .mq-denominator': {
      marginTop: '-5px !important',
      padding: '0.5em 0.1em 0.1em !important'
    },
    '& > .mq-math-mode .mq-numerator, .mq-math-mode .mq-over': {
      padding: '0 0.1em !important',
      paddingBottom: '0 !important',
      marginBottom: '4.5px'
    },
    '& > .mq-math-mode sup.mq-nthroot': {
      fontSize: '70.7% !important',
      verticalAlign: '0.5em !important',
      paddingRight: '0.15em'
    },
    '& > .mq-longdiv-inner': {
      marginTop: '-1px',
      marginLeft: '5px !important;',

      '& > .mq-empty': {
        padding: '0 !important',
        marginLeft: '0px !important',
        marginTop: '2px'
      }
    },
    '& > .mq-math-mode .mq-longdiv': {
      display: 'inline-flex !important'
    },
    '& > .mq-math-mode .mq-longdiv .mq-longdiv-inner .mq-empty': {
      paddingTop: '6px !important',
      paddingLeft: '4px !important'
    },
    '& > .mq-math-mode .mq-longdiv .mq-longdiv-inner': {
      marginLeft: '0 !important'
    },
    '& > .mq-math-mode .mq-supsub': {
      fontSize: '70.7% !important'
    },
    '& > .mq-math-mode .mq-overarrow': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important'
    },
    '& > .mq-math-mode .mq-paren': {
      verticalAlign: 'top !important',
      padding: '1px 0.1em !important'
    },

    '& > .mq-math-mode .mq-sqrt-stem': {
      borderTop: '0.07em solid',
      marginLeft: '-1.5px',
      marginTop: '-2px !important',
      paddingTop: '5px !important'
    },
    '& > .mq-supsub ': {
      fontSize: '70.7%'
    },

    '& > .mq-math-mode .mq-supsub.mq-sup-only': {
      verticalAlign: '-0.1em !important',

      '& .mq-sup': {
        marginBottom: '0px !important'
      }
    },
    '& .mq-overarrow-inner': {
      paddingTop: '0 !important',
      border: 'none !important'
    },
    '& .mq-editable-field .mq-cursor': {
      marginTop: '-15px !important'
    },
    '& .mq-overarrow.mq-arrow-both': {
      top: '7.5px',
      marginTop: '0px',
      minWidth: '1.23em',
      '& *': {
        lineHeight: '1 !important'
      },
      '&:before': {
        top: '-0.4em',
        left: '-1px'
      },
      '&:after': {
        top: '-3.15em',
        right: '-2px'
      },
      '&.mq-empty:after': {
        top: '-0.45em'
      }
    },
    '& .mq-overarrow.mq-arrow-right': {
      '&:before': {
        top: '-0.4em',
        right: '-1px'
      }
    },
    '& .mq-overarrow-inner-right': {
      display: 'none !important'
    },
    '& .mq-overarrow-inner-left': {
      display: 'none !important'
    },
    '& .mq-longdiv-inner': {
      borderTop: '1px solid !important',
      paddingTop: '1.5px !important'
    },
    '& .mq-parallelogram': {
      lineHeight: 0.85
    }
  },
  selected: {
    border: `solid 1px ${theme.palette.primary.main}`,
    '& > .mq-math-mode': {
      border: 'solid 0px lightgrey'
    }
  },
  insideOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  }
});

export default withStyles(mp)(RawMathPreview);
