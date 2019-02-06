import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import { debounce } from 'lodash';

let MQ;
if (typeof window !== 'undefined') {
  const MathQuill = require('mathquill');
  MQ = MathQuill.getInterface(2);

  if (MQ && MQ.registerEmbed) {
    MQ.registerEmbed('answerBlock', id => {
      return {
        htmlString: `<span id=${id}></span>`,
        text: () => "testText",
        latex: () => "\\embed{answerBlock}[" + id + "]"
      };
    });

    MQ.registerEmbed('newLine', () => {
      return {
        htmlString: `<div class="newLine"></div>`,
        text: () => 'testText',
        latex: () => '\\embed{newLine}[]'
      };
    });
  }
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

  onKeyPress = event => {
    if (event.charCode === 13) {
      // if enter's pressed, we're going for a custom embedded element that'll
      // have a block display (empty div) - for a hacked line break using ccs
      // all because mathquill doesn't support a line break
      this.write('\\embed{newLine}[]');
      this._onInputEdit();
    }
  }

  latexIsEqual = (a, b) => {
    if (!a && !b) {
      return true;
    }
    if ((a && !b) || (!a && b)) {
      return false;
    }
    return a.trim().replace(/\s/g, '') === b.trim().replace(/\s/g, '');
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    log('[render] this.props.latex:', this.props.latex);
    const { onClick, onFocus, onBlur, className } = this.props;

    return (
      <span
        onKeyPress={this.onKeyPress}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        className={className}
        ref={r => (this.input = r)}
      />
    );
  }
}
