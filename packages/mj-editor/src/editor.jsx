import React from 'react';
import { mq } from '@pie-lib/math-input';

export class Editor extends React.Component {
  latexChange = latex => {
    const { onChange } = this.props;
    onChange(latex);
  };
  render() {
    const { math } = this.props;
    return <mq.Input latex={math} onChange={this.latexChange} />;
  }
}
