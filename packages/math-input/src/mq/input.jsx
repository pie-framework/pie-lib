import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import classNames from 'classnames';

let MQ;
if (typeof window !== 'undefined') {
  const MathQuill = require('mathquill');
  MQ = MathQuill.getInterface(2);
}

const log = debug('math-input:mq:input');

/**
 * Wrapper for MathQuill MQ.MathField.
 */
export class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    latex: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
  };

  componentDidMount() {
    if (!MQ) {
      throw new Error('MQ is not defined - but component has mounted?');
    }

    const { latex } = this.props;
    this.mathField = MQ.MathField(this.input, {
      handlers: {
        edit: this.onInputEdit.bind(this)
      }
    });

    if (latex) {
      this.mathField.latex(latex);
    }
  }

  clear() {
    this.mathField.latex('');
    return '';
  }

  blur() {
    log('blur mathfield');
    this.mathField.blur();
  }

  focus() {
    log('focus mathfield...');
    this.mathField.focus();
  }

  command(v) {
    log('command: ', v);
    if (Array.isArray(v)) {
      v.forEach(vv => {
        this.mathField.cmd(vv);
      });
    } else {
      this.mathField.cmd(v);
    }
    this.mathField.focus();
    return this.mathField.latex();
  }

  keystroke(v) {
    this.mathField.keystroke(v);
    this.mathField.focus();
    return this.mathField.latex();
  }

  write(v) {
    log('write: ', v);
    this.mathField.write(v);
    this.mathField.focus();
    return this.mathField.latex();
  }

  onInputEdit = () => {
    log('[onInputEdit] ...');
    const { onChange } = this.props;
    if (!this.mathField) {
      return;
    }

    if (onChange) {
      onChange(this.mathField.latex());
    }
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.latex !== this.mathField.latex();
  }

  render() {
    const { onClick, onFocus, onBlur, classes, className } = this.props;

    return (
      <span
        className={classNames(classes.input, className)}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={r => (this.input = r)}
      />
    );
  }
}

const styles = theme => ({});

export default withStyles(styles)(Input);
