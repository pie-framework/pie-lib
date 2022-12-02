import React from 'react';
import PlaceHolder from './placeholder';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

const DRAG_TYPE = window.demo?.markup?.includes('match-list') ? 'Answer' : 'MaskBlank';

class DroppablePlaceholder extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    disabled: PropTypes.bool,
  };

  render() {
    const { children, connectDropTarget, isOver, disabled, classes } = this.props;

    return connectDropTarget(
      <div style={{ flex: 1 }}>
        <PlaceHolder disabled={disabled} isOver={isOver} choiceBoard={true} className={classes}>
          {children}
        </PlaceHolder>
      </div>,
    );
  }
}

export const spec = {
  canDrop: (props /*, monitor*/) => {
    return !props.disabled;
  },
  drop: (props) => {
    log('[drop] props: ', props);
  },
};

const WithTarget = DropTarget(DRAG_TYPE, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(DroppablePlaceholder);

export default WithTarget;
