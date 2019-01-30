import React from 'react';
import BasePoint from './base-point';
import debug from 'debug';
import { ToolPropType } from '../types';
import { types } from '@pie-lib/plot';

const log = debug('pie-lib:graphing:point');

export class Point extends React.Component {
  static propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    ...ToolPropType
  };

  static defaultProps = {};

  move = p => {
    const { mark, onChange } = this.props;
    const m = { ...mark, ...p };
    onChange(mark, m);
  };

  render() {
    const { mark, graphProps } = this.props;
    return <BasePoint {...mark} onMove={this.move} graphProps={graphProps} />;
  }
}

export default Point;
