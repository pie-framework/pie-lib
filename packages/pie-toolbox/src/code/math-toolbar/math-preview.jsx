import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { mq } from '../math-input';
import { markFractionBaseSuperscripts } from './utils';
import { commonMqFontStyles, longdivStyles, supsubStyles } from '../math-input/mq/common-mq-styles';

const log = debug('@pie-lib:math-toolbar:math-preview');

export class RawMathPreview extends React.Component {
  static propTypes = {
    latex: PropTypes.string,
    node: PropTypes.object,
    classes: PropTypes.object,
    isSelected: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  componentDidMount() {
    markFractionBaseSuperscripts();
  }

  componentDidUpdate(prevProps) {
    // Re-run only if LaTeX changed
    if (this.props.node.data.get('latex') !== prevProps.node.data.get('latex')) {
      markFractionBaseSuperscripts();
    }
  }

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

const mp = (theme) => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    '& *': commonMqFontStyles,
    ...supsubStyles,
    ...longdivStyles,
    '& > .mq-math-mode': {
      border: 'solid 1px lightgrey',
    },
    '& > .mq-focused': {
      outline: 'none',
      boxShadow: 'none',
      border: 'solid 1px black',
      borderRadius: '0px',
    },
    '& > .mq-math-mode .mq-root-block': {
      paddingTop: '7px !important',
    },
    '& > .mq-math-mode .mq-overarc ': {
      paddingTop: '0.45em !important',
    },
    '& > .mq-math-mode .mq-sqrt-prefix': {
      verticalAlign: 'baseline !important',
      top: '1px !important',
      left: '-0.1em !important',
    },
    '& > .mq-math-mode .mq-denominator': {
      marginTop: '-5px !important',
      padding: '0.5em 0.1em 0.1em !important',
    },
    '& > .mq-math-mode .mq-numerator, .mq-math-mode .mq-over': {
      padding: '0 0.1em !important',
      paddingBottom: '0 !important',
      marginBottom: '-2px',
    },
    '& > .mq-math-mode .mq-longdiv .mq-longdiv-inner .mq-empty': {
      paddingTop: '6px !important',
      paddingLeft: '4px !important',
    },
    '& > .mq-math-mode .mq-longdiv .mq-longdiv-inner': {
      marginLeft: '0 !important',
    },
    '& > .mq-math-mode .mq-overarrow': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
    },
    '& > .mq-math-mode .mq-paren': {
      verticalAlign: 'top !important',
      padding: '1px 0.1em !important',
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
    '& .mq-editable-field .mq-cursor': {
      marginTop: '-15px !important',
    },
    '& .mq-overarrow.mq-arrow-both': {
      top: '7.5px',
      marginTop: '0px',
      minWidth: '1.23em',
      '& *': {
        lineHeight: '1 !important',
      },
      '&:before': {
        top: '-0.4em',
        left: '-1px',
      },
      // NOTE: This workaround adds `!important` to enforce the correct positioning and styling
      // of `.mq-overarrow.mq-arrow-both` elements in MathQuill. This ensures consistent display
      // regardless of the order in which MathQuill is initialized on our websites.
      //
      // In the future, investigate why MathQuill scripts and styles are being initialized
      // more than once and address the root cause to prevent potential conflicts and ensure
      // optimal performance.
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
    '& .mq-longdiv-inner': {
      borderTop: '1px solid !important',
      paddingTop: '1.5px !important',
    },
    '& .mq-parallelogram': {
      lineHeight: 0.85,
    },
    '& span[data-prime="true"]': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
    },
  },
  selected: {
    border: `solid 1px ${theme.palette.primary.main}`,
    '& > .mq-math-mode': {
      border: 'solid 0px lightgrey',
    },
  },
  insideOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});

export default withStyles(mp)(RawMathPreview);
