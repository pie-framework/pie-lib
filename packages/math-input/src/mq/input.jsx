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
 *
 * next -
 * try stripping back mq.Input and build back up
 * try clone?
 *  try putting mq inside a custom element?
 */
export class InputWithState extends React.Component {
  static propTypes = {
    latex: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string
  };

  static getDerivedStateFromProps(props, state) {
    if (props.latex !== state.latex) {
      return {
        latex: props.latex
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      latex: props.latex
    };
  }

  changeLatex = latex => {
    if (latex !== this.state.latex) {
      console.log('input with state... setting state');
      this.setState({ latex }, () => {
        // window.requestAnimationFrame(() => {
        //   this.props.onChange(this.state.latex);
        // });
        setTimeout(() => {
          console.log('delay change callback');

          this.props.onChange(this.state.latex);
        }, 1000);
      });
    }
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.latex !== this.state.latex;
  }

  render() {
    const { latex } = this.state;
    const { onClick, onFocus, onBlur, className } = this.props;
    return (
      <StyledInput
        className={className}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        latex={latex}
        onChange={this.changeLatex}
      />
    );
  }
}
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

    if (this.mathField) {
      throw new Error('have mathfield?');
    }
    log('[componentDidMount] input:', this.input);
    this.mathField = MQ.MathField(this.input, {
      handlers: {
        edit: (a, b, c) => {
          console.log('!!! MQ.Input - Edit', a, b, c);
          // this.onInputEdit.bind(this)();
          log('[onInputEdit] ...');
          const { onChange } = this.props;

          const l = a.latex();
          if (onChange && l !== this.props.latex) {
            log('[onInputEdit] calling onChange callback');
            onChange(l);
            // this.updateLatex();
            // setTimeout(() => {
            //   onChange(l);
            // }, 100);
          }
        }
      }
    });
    log('[componentDidMount] mathField:', this.mathField);

    this.updateLatex();
  }

  componentWillUnmount() {
    console.log('comp will unmount!!!!!!!!!!!!!');
    this.mathField = undefined;
  }
  componentDidUpdate() {
    log('>>>>>>>>>>>>>>... [componentDidUpdate]...', this.props.latex);
    //this.updateLatex();
  }

  updateLatex() {
    if (!this.mathField) {
      return;
    }
    const { latex } = this.props;
    if (latex && latex !== this.mathField.latex()) {
      console.log('setting the latex !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
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

    log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! [render]...');
    return (
      <div
        className={classNames(classes.input, className)}
        // onKeyPress={this.onKeyPress}
        // onClick={onClick}
        // onFocus={onFocus}
        // onBlur={onBlur}
        ref={r => (this.input = r)}
      />
    );
  }
}

const styles = theme => ({});

const StyledInput = withStyles(styles)(Input);
export default StyledInput;
