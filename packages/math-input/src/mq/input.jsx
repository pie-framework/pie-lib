import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import classNames from 'classnames';
import { registerLineBreak } from './custom-elements';
import MathQuill from '@pie-framework/mathquill';

let MQ;
if (typeof window !== 'undefined') {
  MQ = MathQuill.getInterface(2);

  if (MQ && MQ.registerEmbed) {
    registerLineBreak(MQ);
  }
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

    this.mathField = MQ.MathField(this.input, {
      handlers: {
        edit: this.onInputEdit.bind(this)
      }
    });

    this.updateLatex();
  }

  componentDidUpdate() {
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

  refresh = () => {
    this.blur();
    this.focus();
  };

  onKeyPress = event => {
    const keys = Object.keys(this.mathField.__controller.options);

    if (keys.indexOf('ignoreNextMousedown') < 0) {
      // It seems like the controller has the above handler as an option
      // when all the right events are set and everything works fine
      // this seems to work in all cases
      this.refresh();
    }

    if (event.charCode === 13) {
      // if enter's pressed, we're going for a custom embedded element that'll
      // have a block display (empty div) - for a hacked line break using ccs
      // all because mathquill doesn't support a line break
      this.write('\\embed{newLine}[]');
      this.onInputEdit();
    }

    if (event.charCode === 47) {
      // Whenever the math editor cursor is positioned after an integer
      // (i.e. a sequence of 1 or more digits) followed immediately by a space followed immediately by another integer,
      // then a side effect of pressing the forward slash key or clicking the B fraction button should be to remove
      // the space between the first integer and the second integer (which is now the numerator of a new fraction).
      // E.g. if the user were trying to enter the mixed number one and two-thirds, and typed [1], [space], [2], [forward slash],
      // producing the latex 1\ \frac{2}{|} (where | is not actually part of the representation, but rather
      // represents the position of the cursor), this should be automatically transformed to 1\frac{2}{|}
      // (with | again representing the position of the cursor).
      // Similarly, if the user had typed [1], [2], [space], [3], [4], [forward slash], then the resulting representation should
      // be transformed from 12\ \frac{34}{|} to 12\frac{34}{|}.
      const latex = this.mathField.latex();

      if (latex.match(/([0-9]*)\\ /)) {
        event.preventDefault();
        event.stopPropagation();

        this.clear();

        const indexOfSpace = latex.lastIndexOf('\\ ');
        // split the latex by the last space added
        const firstPart = latex.slice(0, indexOfSpace);
        const secondPart = latex.slice(indexOfSpace + 2);

        // reconstruct the latex without the extra space
        const newLatex = firstPart + '\\frac{' + secondPart + '}{}';

        this.mathField.latex(newLatex);
        // trigger pressing keydown to move focus on the denominator
        this.mathField.el().dispatchEvent(new KeyboardEvent('keydown', { keyCode: 37 }));

        this.onInputEdit();
      }
    }
  };

  shouldComponentUpdate(nextProps) {
    log('next: ', nextProps.latex);
    log('current: ', this.mathField.latex());
    return nextProps.latex !== this.mathField.latex();
  }

  render() {
    const { onClick, onFocus, onBlur, classes, className } = this.props;

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

const styles = () => ({});

export default withStyles(styles)(Input);
