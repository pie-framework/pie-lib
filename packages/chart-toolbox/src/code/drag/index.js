import { DragSource, DropTarget } from 'react-dnd';

import PlaceHolder from './placeholder';
import Choice from './choice';
import withDragContext from './with-drag-context';
import swap from './swap';
import * as uid from './uid-context';
import MatchDroppablePlaceholder from './match-list-dp';
import DragDroppablePlaceholder from './drag-in-the-blank-dp';
import ICADroppablePlaceholder from './ica-dp';

export {
  PlaceHolder,
  MatchDroppablePlaceholder,
  DragDroppablePlaceholder,
  ICADroppablePlaceholder,
  withDragContext,
  Choice,
  swap,
  uid,
  DragSource,
  DropTarget,
};
