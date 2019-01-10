import { combineReducers } from 'redux';
import marks from './marks';
import undoable from 'redux-undo';

export default combineReducers({ marks: undoable(marks, { debug: true }) });
