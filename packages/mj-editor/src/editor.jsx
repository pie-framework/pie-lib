import React from 'react';
import { mq } from '@pie-lib/math-input';
import PropTypes from 'prop-types';
import { toLatex, toMathMl } from './converter';

export class Editor extends React.Component {
  static propTypes = {
    math: PropTypes.string,
    onChange: PropTypes.func
  };

  latexChange = latex => {
    const { onChange } = this.props;
    const math = toMathMl(latex);
    onChange(math);
  };

  render() {
    const { math } = this.props;

    const latex = toLatex(math);
    return <mq.Input latex={latex} onChange={this.latexChange} />;
  }
}
