import { tool as polygon } from './polygon';
import { tool as line } from './line';

const allTools = ['line', 'polygon'];

const toolsArr = [line(), polygon()];

export { allTools, toolsArr, line, polygon };
