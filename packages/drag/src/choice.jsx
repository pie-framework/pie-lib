import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import grey from '@material-ui/core/colors/grey';

import { DragSource } from 'react-dnd';

export const DRAG_TYPE = 'CHOICE';

export class Choice extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    connectDragSource: PropTypes.func.isRequired
  };

  static defaultProps = {};

  render() {
    const { classes, className, children, connectDragSource } = this.props;

    return connectDragSource(
      <div className={classNames(classes.choice, className)}>{children}</div>
    );
  }
}

const styles = theme => ({
  choice: {
    backgroundColor: 'white',
    border: `solid 1px ${grey[400]}`,
    padding: theme.spacing.unit,
    minHeight: '30px'
  }
});

const choiceSource = {
  canDrag(props) {
    return !props.disabled;
  },
  beginDrag(props) {
    return props;
  }
};

const styledChoice = withStyles(styles)(Choice);

export default DragSource(DRAG_TYPE, choiceSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(styledChoice);
