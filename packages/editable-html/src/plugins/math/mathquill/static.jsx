import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';

let MQ;
if (typeof window !== 'undefined') {
  const MathQuill = require('mathquill');
  MQ = MathQuill.getInterface(2);
}

const log = debug('editable-html:plugins:math:mathquill');

/**
 * Wrapper for MathQuill MQ.MathField.
 */
export default class Static extends React.Component {
  static propTypes = {
    latex: PropTypes.string.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
  };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  update() {
    if (!MQ) {
      throw new Error('MQ is not defined - but component has mounted?');
    }
    this.input.innerHTML = this.props.latex;
    this.mathField = MQ.StaticMath(this.input);
  }

  blur() {
    log('blur mathfield');
    this.mathField.blur();
  }

  focus() {
    log('focus mathfield...');
    this.mathField.focus();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.latex !== this.mathField.latex();
  }

  render() {
    const { onFocus, onBlur } = this.props;

    return (
      <span onFocus={onFocus} onBlur={onBlur} ref={r => (this.input = r)} />
    );
  }
}
