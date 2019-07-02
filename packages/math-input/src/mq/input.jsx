import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import classNames from 'classnames';
import { registerLineBreak } from './custom-elements';
import { load as loadMathQuill } from './load-mathquill';

const MQ = loadMathQuill();

if (MQ && MQ.registerEmbed) {
  registerLineBreak(MQ);
}

const log = debug('@pie-lib:math-input:mq:input');

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

    log('[componentDidMount] input:', this.input);
    this.mathField = MQ.MathField(this.input, {
      handlers: {
        edit: () => {
          console.log('!!! Edit');
          this.onInputEdit.bind(this)();
        }
      }
    });
    log('[componentDidMount] mathField:', this.mathField);

    this.updateLatex();
  }

  componentDidUpdate() {
    log('[componentDidUpdate]...');
    this.updateLatex();
  }

  updateLatex() {
    if (!this.mathField) {
      return;
    }
    const { latex } = this.props;
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

  // onKeyPress = event => {
  //   if (event.charCode === 13) {
  //     // if enter's pressed, we're going for a custom embedded element that'll
  //     // have a block display (empty div) - for a hacked line break using ccs
  //     // all because mathquill doesn't support a line break
  //     this.write('\\embed{newLine}[]');
  //     this.onInputEdit();
  //   }
  // };

  shouldComponentUpdate(nextProps) {
    log('next: ', nextProps.latex);
    log('current: ', this.mathField.latex());
    return nextProps.latex !== this.mathField.latex();
  }

  render() {
    const { onClick, onFocus, onBlur, classes, className } = this.props;

    log('[render]...');
    return (
      <span
        className={classNames(classes.input, className)}
        onKeyPress={this.onKeyPress}
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
