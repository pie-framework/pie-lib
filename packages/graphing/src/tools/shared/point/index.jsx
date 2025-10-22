import React from 'react';
import { styled } from '@mui/material/styles';
import { gridDraggable } from '@pie-lib/plot';
import * as utils from '../../../utils';
import { color } from '@pie-lib/render-ui';
import { RawBp } from './base-point';
import { RawArrow } from './arrow-point';
import BaseArrow from './arrow';

// Drag & bounds options
const opts = {
  bounds: (props, { domain, range }) => {
    const { x, y } = props;
    const area = { left: x, top: y, bottom: y, right: x };
    return utils.bounds(area, domain, range);
  },
  anchorPoint: (props) => {
    const { x, y } = props;
    return { x, y };
  },
  fromDelta: (props, delta) => {
    return utils.point(props).add(utils.point(delta));
  },
};

// Common styled point
const PointStyle = styled('g')(({ disabled, correctness }) => ({
  '& circle, & polygon': {
    cursor: 'pointer',
    fill: color.defaults.BLACK,
  },
  ...(disabled && {
    '& circle, & polygon': {
      fill: '#ccc',
    },
  }),
  ...(correctness === 'correct' && {
    '& circle, & polygon': {
      stroke: 'green',
    },
  }),
  ...(correctness === 'incorrect' && {
    '& circle, & polygon': {
      stroke: 'red',
    },
  }),
  ...(correctness === 'missing' && {
    '& circle, & polygon': {
      stroke: 'orange',
    },
  }),
}));

export const BasePoint = gridDraggable(opts)((props) => (
  <PointStyle {...props}>
    <RawBp {...props} />
  </PointStyle>
));

export const ArrowPoint = gridDraggable(opts)((props) => (
  <PointStyle {...props}>
    <RawArrow {...props} />
  </PointStyle>
));

export const Arrow = gridDraggable(opts)((props) => (
  <PointStyle {...props}>
    <BaseArrow {...props} />
  </PointStyle>
));
