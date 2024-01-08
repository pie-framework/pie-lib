import { tool as point } from './point';
import { tool as circle } from './circle';
import { tool as polygon } from './polygon';
import { tool as sine } from './sine';
import { tool as parabola } from './parabola';
import { tool as line } from './line';
import { tool as segment } from './segment';
import { tool as ray } from './ray';
import { tool as vector } from './vector';
import { tool as absolute } from './absolute';
import { tool as exponential } from './exponential';

const allTools = [
  'circle',
  'line',
  'label',
  'parabola',
  'point',
  'polygon',
  'ray',
  'segment',
  'sine',
  'vector',
  'absolute',
  'exponential',
];

const toolsArr = [
  circle(),
  line(),
  parabola(),
  point(),
  polygon(),
  ray(),
  segment(),
  sine(),
  vector(),
  absolute(),
  exponential(),
];

export { allTools, toolsArr, circle, line, point, parabola, polygon, ray, sine, vector, absolute, exponential };
