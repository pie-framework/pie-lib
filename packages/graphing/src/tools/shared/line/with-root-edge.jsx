import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { LinePath } from '../line/line-path';
import { curveMonotoneX } from '@vx/curve';
import { lineBase, lineToolComponent } from './index';

const toRootEdge = m => {
  const out = { ...m };
  out.root = { ...m.from };
  out.edge = m.to ? { ...m.to } : undefined;
  delete out.from;
  delete out.to;
  return out;
};

const toFromTo = m => {
  const out = { ...m };
  out.from = { ...m.root };
  out.to = m.edge ? { ...m.edge } : undefined;
  delete out.root;
  delete out.edge;
  return out;
};

export const rootEdgeToFromToWrapper = BaseComp => {
  const Wrapper = props => {
    const m = toFromTo(props.mark);

    const onChange = (current, next) => {
      props.onChange(toRootEdge(current), toRootEdge(next));
    };

    return <BaseComp {...props} mark={m} onChange={onChange} />;
  };

  Wrapper.propTypes = {
    onChange: PropTypes.func,
    mark: PropTypes.object
  };

  return Wrapper;
};

export const rootEdgeComponent = RootEdgeComp => {
  const BaseComponent = lineToolComponent(RootEdgeComp);
  return rootEdgeToFromToWrapper(BaseComponent);
};

const withPointsGenerationLinePath = getPoints => {
  const LinePathComponent = props => {
    const {
      graphProps,
      from,
      to,
      onClick,
      onDragStart,
      onDragStop,
      onChange,
      disabled,
      correctness,
      ...rest
    } = props;

    const { dataPoints } = getPoints({
      graphProps: props.graphProps,
      root: from,
      edge: to
    });
    const raw = dataPoints.map(d => [graphProps.scale.x(d.x), graphProps.scale.y(d.y)]);

    const common = {
      onClick,
      graphProps,
      onDragStart,
      onDragStop,
      onChange,
      disabled,
      correctness
    };

    return <LinePath data={raw} from={from} to={to} curve={curveMonotoneX} {...common} {...rest} />;
  };
  LinePathComponent.propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    from: types.PointType.isRequired,
    to: types.PointType,
    onClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    correctness: PropTypes.string
  };
  return LinePathComponent;
};

export const withRootEdge = getPoints => {
  const LinePathComp = withPointsGenerationLinePath(getPoints);
  return lineBase(LinePathComp);
};
