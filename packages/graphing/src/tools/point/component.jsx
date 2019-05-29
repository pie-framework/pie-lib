import React from 'react';
import { BasePoint } from '../common/point';
import debug from 'debug';
import { ToolPropTypeFields } from '../types';
import { types } from '@pie-lib/plot';
import { Label } from '../common/label';

const log = debug('pie-lib:graphing:point');

export class Point extends React.Component {
  static propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    ...ToolPropTypeFields
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      label: null
    };
  }

  move = p => {
    const { mark, onChange } = this.props;
    const m = { ...mark, ...p };
    onChange(mark, m);
  };

  drag = draggedTo => {
    this.setState({ draggedTo });
  };

  render() {
    const { mark, graphProps, labelIsActive } = this.props;
    const { label, draggedTo } = this.state;

    return (
      <g
        onClick={() => {
          if (labelIsActive) {
            this.setState({ label: '' });
          }
        }}
      >
        {label !== null && (
          <Label
            onChange={value => this.setState({ label: value })}
            onRemove={() => this.setState({ label: null })}
            {...mark}
            {...draggedTo}
            graphProps={graphProps}
          />
        )}
        <BasePoint {...mark} onMove={this.move} onDrag={this.drag} graphProps={graphProps} />
      </g>
    );
  }
}

export default Point;
