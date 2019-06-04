import _ from 'lodash';
import React from 'react';
import { BasePoint } from '../common/point';
import { types, utils, gridDraggable, trig } from '@pie-lib/plot';
import PropTypes from 'prop-types';
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

    changeMark = ({ from, to }) => {
      const { mark, onChange } = this.props;
      const update = { ...mark, from, to };
      onChange(mark, update);
    };

    render() {
      const { mark, graphProps, onClick, onDragStart, onDragStop } = this.props;

      log('onDragStart:', onDragStart);
      return (
        <Component
          from={mark.from}
          to={mark.to}
          graphProps={graphProps}
          onChange={this.changeMark}
          onClick={onClick}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        />
      );
    }
  };
};

const dragOpts = () => ({
  bounds: (props, { domain, range }) => {
    const area = utils.lineToArea(props.from, props.to);
    return utils.bounds(area, domain, range);
  },
  anchorPoint: props => {
    const { from } = props;
    return from;
  },
  fromDelta: (props, delta) => {
    const { from, to } = props;
    return {
      from: utils.point(from).add(utils.point(delta)),
      to: utils.point(to).add(utils.point(delta))
    };
  }
});

export const lineBase = (Comp, opts) => {
  const DraggableComp = gridDraggable(dragOpts())(Comp);

  const FromPoint = opts && opts.from ? opts.from : BasePoint;
  const ToPoint = opts && opts.to ? opts.to : BasePoint;

  class LineBase extends React.Component {
    static propTypes = {
      graphProps: types.GraphPropsType,
      from: types.PointType,
      to: types.PointType,
      onChange: PropTypes.func,
      onDragStart: PropTypes.func,
      onDragStop: PropTypes.func
    };

    dragComp = ({ from, to }) => {
      const { onChange } = this.props;
      onChange({ from, to });
    };

    dragFrom = from => {
      const { onChange } = this.props;
      onChange({ from, to: this.props.to });
    };

    dragTo = to => {
      const { onChange } = this.props;
      onChange({ from: this.props.from, to });
    };

    render() {
      const { graphProps, onDragStart, onDragStop, from, to } = this.props;

      const common = { graphProps, onDragStart, onDragStop };

      const angle = trig.toDegrees(trig.angle(from, to));
      log('angle:', angle);
      log('props:', this.props);
      return (
        <g>
          {to && <DraggableComp from={from} to={to} onDrag={this.dragComp} {...common} />}
          <FromPoint
            x={from.x}
            y={from.y}
            onDrag={this.dragFrom}
            onClick={this.clickFrom}
            {...common}
          />
          {to && (
            <ToPoint
              x={to.x}
              y={to.y}
              angle={angle} //angle + 45}
              onDrag={this.dragTo}
              onClick={this.clickTo}
              {...common}
            />
          )}
        </g>
      );
    }
  }

  return LineBase;
};

export const styles = {
  line: theme => ({
    fill: 'transparent',
    stroke: theme.palette.primary.light,
    strokeWidth: 3,
    transition: 'stroke 200ms ease-in, stroke-width 200ms ease-in',
    '&:hover': {
      strokeWidth: 6,
      stroke: theme.palette.primary.dark
    }
  }),
  arrow: theme => ({
    fill: `var(--point-bg, ${theme.palette.secondary.main})`
  })
};
