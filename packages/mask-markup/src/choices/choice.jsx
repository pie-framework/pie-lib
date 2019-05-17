import React from 'react';
import ReactDOM from 'react-dom';
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
  disabled: {}
}))(props => {
  const { connectDragSource, classes, disabled } = props;
  return connectDragSource(
    <span className={classnames(classes.choice, disabled && classes.disabled)}>
      <Chip
        label={<span dangerouslySetInnerHTML={{ __html: props.value }} />}
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
  beginDrag(props, monitor, component) {
    /**
     * Need this in order to have the preview of the item accurately
     * (Math rendering especially)
     * */
    // eslint-disable-next-line
    const choiceDOM = ReactDOM.findDOMNode(component);

    return {
      id: props.targetId,
      value: props.id,
      label: (choiceDOM && choiceDOM.outerHTML) || props.value,
      instanceId: props.instanceId
    };
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      if (props.type === 'target') {
        props.onRemoveChoice(monitor.getItem());
      }
    }
  }
};

const DragDropTile = DragSource(DRAG_TYPE, tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(BlankContent);

export default DragDropTile;
