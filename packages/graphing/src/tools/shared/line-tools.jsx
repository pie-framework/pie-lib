import _ from 'lodash';
import React from 'react';
import { BasePoint } from '../common/point';
import { types } from '@pie-lib/plot';
import debug from 'debug';

const log = debug('pie-lib:graphing:line-tools');

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
      ...types.ToolPropTypeFields,
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
    static propTypes = {
      graphProps: types.GraphPropsType,
      from: types.PointType,
      to: types.PointType
    };

    constructor(props) {
      super(props);
      this.state = {};
    }

    startDragFrom = () => {};
    dragFrom = from => this.setState({ from });
    dragTo = to => this.setState({ to });
    stopDragFrom = () => this.setState({ from: undefined });
    stopDragTo = () => this.setState({ to: undefined });

    dragComp = ({ from, to }) => {
      log('@@@@ dragComp');
      this.setState({ from, to });
    };
    stopDragComp = () => this.setState({ comp: undefined });
    // buildPoints = () => {
    //   const { comp, from, to } = this.state;

    //   if (comp) {
    //     return {
    //       comp: { from: this.props.from, to: this.props.to },
    //       from: comp.from,
    //       to: comp.to
    //     };
    //   }

    //   log(comp, from, to);

    //   return {
    //     comp: { from: from || this.props.from, to: to || this.props.to },
    //     from: this.props.from,
    //     to: this.props.to
    //   };
    // };
    render() {
      const { graphProps } = this.props;

      // const points = this.buildPoints();
      const from = this.state.from ? this.state.from : this.props.from;
      const to = this.state.to ? this.state.to : this.props.to;

      console.log('[render]', from, to);
      // const compPos = {
      //   from: this.state.comp
      // }
      return (
        <g>
          <Comp
            from={from}
            to={to}
            graphProps={graphProps}
            onDrag={this.dragComp}
            onDragStop={this.stopDragComp}
          />
          <BasePoint
            x={from.x}
            y={from.y}
            graphProps={graphProps}
            onDragStart={this.startDragFrom}
            onDragStop={this.stopDragFrom}
            onDrag={this.dragFrom}
            onClick={this.clickFrom}
          />
          <BasePoint
            x={to.x}
            y={to.y}
            graphProps={graphProps}
            onDragStart={this.startDragTo}
            onDragStop={this.stopDragTo}
            onDrag={this.dragTo}
            onClick={this.clickTo}
          />
        </g>
      );
    }
  };
};
