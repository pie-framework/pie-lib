import _ from 'lodash';
import React from 'react';
import { BasePoint } from '../common/point';
import { types } from '@pie-lib/plot';
import { ToolPropTypeFields } from '../../../lib/tools/types';
export const lineTool = (type, Component) => () => ({
  type,
  Component,
  addPoint: (point, mark) => {
    if (!mark) {
      return {
        type,
        building: true,
        from: point
      };
    }

    if (_.isEqual(point, mark.from)) {
      return { ...mark };
    }

    return { ...mark, building: false, to: point };
  }
});

export const lineToolComponent = Component => {
  return class LineToolComponent extends React.Component {
    static propTypes = {
      ...ToolPropTypeFields,
      graphProps: types.GraphPropsType.isRequired
    };

    static defaultProps = {};

    changeMark = ({ root, edge }) => {
      const { mark, onChange } = this.props;
      const update = { ...mark, root, edge };
      onChange(mark, update);
    };

    render() {
      const { mark, graphProps, onClick } = this.props;
      console.log('mark:', mark);
      return (
        <Component
          from={mark.from}
          to={mark.to}
          graphProps={graphProps}
          onChange={this.changeMark}
          onClick={onClick}
        />
      );
    }
  };
};

export const lineBase = Comp => {
  return class LineBase extends React.Component {
    render() {
      const { graphProps, from, to } = this.props;
      console.log(Comp);
      return (
        <g>
          <Comp from={from} to={to} graphProps={graphProps} />
          <BasePoint x={from.x} y={from.y} graphProps={graphProps} />
          <BasePoint x={to.x} y={to.y} graphProps={graphProps} />
        </g>
      );
    }
  };
};
