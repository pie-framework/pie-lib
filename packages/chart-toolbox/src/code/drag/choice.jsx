import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import grey from '@material-ui/core/colors/grey';

import { DragSource } from 'react-dnd';
import { withUid } from './uid-context';

export const DRAG_TYPE = 'CHOICE';

export class Choice extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    connectDragSource: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  render() {
    const { classes, className, children, connectDragSource } = this.props;

    return connectDragSource(<div className={classNames(classes.choice, className)}>{children}</div>);
  }
}

const styles = (theme) => ({
  choice: {
    backgroundColor: theme.palette.background.paper,
    border: `solid 1px ${grey[400]}`,
    padding: theme.spacing.unit,
    minHeight: '30px',
    minWidth: theme.spacing.unit * 20,
    maxWidth: theme.spacing.unit * 75,
  },
});

const choiceSource = {
  canDrag(props) {
    return !props.disabled;
  },
  beginDrag(props) {
    const out = {
      choiceId: props.choice.id,
      from: props.category.id,
      alternateResponseIndex: props.alternateResponseIndex,
      choiceIndex: props.choiceIndex,
    };
    return out;
  },

  endDrag: (props, monitor) => {
    if (!monitor.didDrop()) {
      const item = monitor.getItem();
      if (item.from) {
        props.onRemoveChoice(item);
      }
    }
  },
};

const styledChoice = withStyles(styles)(Choice);

const DraggableChoice = DragSource(
  ({ uid }) => uid,
  choiceSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(styledChoice);

export default withUid(DraggableChoice);
