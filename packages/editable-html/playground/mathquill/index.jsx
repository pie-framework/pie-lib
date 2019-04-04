import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import debug from 'debug';
import { debounce } from 'lodash';

let MQ;
if (typeof window !== 'undefined') {
  const MathQuill = require('@pie-framework/mathquill');
  MQ = MathQuill.getInterface(2);
}

const log = debug('@pie-lib:editable-html:plugins:math:mathquill:editor');

export default class Editor extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    latex: PropTypes.string.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string
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
    this.mathField.latex(this.props.latex);
  }

  componentDidUpdate() {
    log('[componentDidUpdate] latex: ', this.props.latex);
    if (this.mathField) {
      this.mathField.latex(this.props.latex);
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
    this.mathField.cmd(v);
    this.mathField.focus();
    return this.mathField.latex();
  }

  keystroke(v) {
    this.mathField.keystroke(v);
    this.mathField.focus();
    return this.mathField.latex();
  }

  write(v) {
    this.mathField.write(v);
    this.mathField.focus();
    return this.mathField.latex();
  }

  latex() {
    if (this.mathField) {
      return this.mathField.latex();
    }
  }

  _onInputEdit = event => {
    log('[onInputEdit] ...', event);

    if (!this.mathField) {
      return;
    }
    if (this.latexIsEqual(this.mathField.latex(), this.props.latex)) {
      return;
    }
    this.props.onChange(this.mathField.latex());
  };

  onInputEdit = debounce(this._onInputEdit, 300, {
    leading: false,
    trailing: true
  });

  latexIsEqual = (a, b) => {
    if (!a && !b) {
      return true;
    }
    if ((a && !b) || (!a && b)) {
      return false;
    }
    return a.trim().replace(/\s/g, '') === b.trim().replace(/\s/, '');
  };

  shouldComponentUpdate(nextProps) {
    log(
      '[shouldComponentUpdate] nextProps.latex: ',
      nextProps.latex,
      'current: ',
      this.mathField.latex()
    );
    const isEqual = this.latexIsEqual(nextProps.latex, this.mathField.latex());
    log('[shouldComponentUpdate] isEqual? ', isEqual);
    return !isEqual;
  }

  render() {
    log('[render] this.props.latex:', this.props.latex);
    const { onClick, onFocus, onBlur, className } = this.props;

    return (
      <span
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        className={className}
        ref={r => (this.input = r)}
      />
    );
  }
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const latex = '- \\frac{1}{2}';
    return <Editor latex={latex} onChange={() => ({})} />;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(Demo, {});
  ReactDOM.render(el, document.querySelector('#app'));
});
