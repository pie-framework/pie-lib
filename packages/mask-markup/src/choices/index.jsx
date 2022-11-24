import React from 'react';
import PropTypes from 'prop-types';
import findKey from 'lodash/findKey';
import Choice from './choice';
import { PlaceHolder, uid } from '@pie-lib/drag';
import { DropTarget } from 'react-dnd';
import { withDragContext } from '@pie-lib/drag';

export class Choices extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    duplicates: PropTypes.bool,
    choices: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })),
    value: PropTypes.object,
    choicePosition: PropTypes.string.isRequired,
  };

  getStyleForWrapper = () => {
    const { choicePosition } = this.props;

    switch (choicePosition) {
      case 'above':
        return {
          margin: '0 0 40px 0',
        };
      case 'below':
        return {
          backgroundColor: 'red',
          margin: '40px 0 0 0',
        };
      case 'right':
        return {
          margin: '0 0 0 40px',
        };
      default:
        return {
          margin: '0 40px 0 0',
        };
    }
  };

  onDropChoice = (choices) => {
    this.setState({
      filteredChoices: choices.filter((c) => {
        if (duplicates === true) {
          return true;
        }
        const foundChoice = findKey(value, (v) => v === c.id);
        return foundChoice === undefined;
      }),
    });
  };

  render() {
    const { disabled, duplicates, choices, value, connectDropTarget, isOver } = this.props;
    console.log(connectDropTarget, 'connectDrop target');
    const filteredChoices = choices.filter((c) => {
      if (duplicates === true) {
        return true;
      }
      const foundChoice = findKey(value, (v) => v === c.id);
      return foundChoice === undefined;
    });
    const elementStyle = this.getStyleForWrapper();

    return connectDropTarget(
      <div style={{ flex: 1 }}>
        <PlaceHolder style={{ width: '100%', minHeight: '100px', height: 'auto' }}>
          {filteredChoices.map((c, index) => (
            <Choice key={`${c.value}-${index}`} disabled={disabled} choice={c} {...c} />
          ))}
        </PlaceHolder>
      </div>,
    );
  }
}

const spec = {
  drop: (props, monitor) => {
    if (monitor.didDrop()) {
      console.log('ondrop-------');
    }
    log('[drop] props: ', props);

    const item = monitor.getItem();
    onDropChoice(item);
    return {
      dropped: true,
    };
  },
  canDrop: (props /*, monitor*/) => {
    console.log('ondrop-------');
    return !props.disabled;
  },
};

export const DRAG_TYPE = 'CHOICE';

const WithTarget = withDragContext(
  DropTarget(
    ({ uid }) => uid,
    spec,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
    }),
  )(Choices),
);

export default WithTarget;
