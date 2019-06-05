import React from 'react';
import debug from 'debug';
import { DragSource } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';

const log = debug('pie-lib:mask-markup:choice');

export const DRAG_TYPE = 'MaskBlank';

export const BlankContent = withStyles(theme => ({
  choice: {
    border: `solid 0px ${theme.palette.primary.main}`
  },
  chip: {
    alignItems: 'center',
    display: 'inline-flex',
    height: 'initial',
    minHeight: '32px'
  },
  disabled: {}
}))(props => {
  const { connectDragSource, classes, disabled } = props;
  return connectDragSource(
    <span className={classnames(classes.choice, disabled && classes.disabled)}>
      <Chip
        className={classes.chip}
        label={<span dangerouslySetInnerHTML={{ __html: props.choice.value }} />}
        variant={disabled ? 'outlined' : undefined}
      />
    </span>,
    {}
  );
});

const tileSource = {
  canDrag(props) {
    return !props.disabled;
  },
  beginDrag(props) {
    return {
      choice: props.choice,
      instanceId: props.instanceId
    };
  }
};

const DragDropTile = DragSource(DRAG_TYPE, tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(BlankContent);

export default DragDropTile;
