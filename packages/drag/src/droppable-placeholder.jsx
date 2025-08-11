import React from 'react';
import PlaceHolder from './placeholder';
import PropTypes from 'prop-types';

const preventInteractionStyle = {
  flex: 1,
};

export class DroppablePlaceholder extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    disabled: PropTypes.bool,
    isVerticalPool: PropTypes.bool,
    minHeight: PropTypes.number,
  };

  render() {
    const { children, connectDropTarget, isOver, disabled, classes, isVerticalPool, minHeight } = this.props;

    return connectDropTarget(
      <div style={preventInteractionStyle}>
        <PlaceHolder
          disabled={disabled}
          isOver={isOver}
          choiceBoard={true}
          className={classes}
          isVerticalPool={isVerticalPool}
          minHeight={minHeight}
        >
          {children}
        </PlaceHolder>
      </div>,
    );
  }
}
