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
    '& > .mq-math-mode': {
      border: 'solid 1px lightgrey'
    },
    '& > .mq-focused': {
      outline: 'none',
      boxShadow: 'none',
      border: 'solid 1px black',
      borderRadius: '0px'
    },
    '& *': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important'
    },
    '& .mq-overarrow-inner': {
      paddingTop: '0 !important',
      border: 'none !important'
    },
    '& .mq-overarrow.mq-arrow-both': {
      minWidth: '1.23em',
      '&:before': {
        top: '-0.4em',
        left: '-1px'
      },
      '&:after': {
        top: '-2.36em',
        right: '-1px'
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
      lineHeight: 0.8
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
