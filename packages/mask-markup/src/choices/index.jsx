import React from 'react';
import PropTypes from 'prop-types';
import findKey from 'lodash/findKey';
import Choice from './choice';
import { DropTarget } from '@pie-lib/drag';
import { uid } from '@pie-lib/drag';

export class Choices extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    duplicates: PropTypes.bool,
    choices: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ),
    value: PropTypes.object,
    choicePosition: PropTypes.string.isRequired
  };

  getStyleForWrapper = () => {
    const { choicePosition } = this.props;

    switch (choicePosition) {
      case 'above':
        return {
          margin: '0 0 40px 0'
        };
      case 'below':
        return {
          backgroundColor: 'red',
          margin: '40px 0 0 0'
        };
      case 'right':
        return {
          margin: '0 0 0 40px'
        };
      default:
        return {
          margin: '0 40px 0 0'
        };
    }
  };

  render() {
    const { disabled, duplicates, choices, value, connectDropTarget } = this.props;
    console.log(connectDropTarget, 'connectDrop target');
    const filteredChoices = choices.filter(c => {
      if (duplicates === true) {
        return true;
      }
      const foundChoice = findKey(value, v => v === c.id);
      return foundChoice === undefined;
    });
    const elementStyle = this.getStyleForWrapper();

    return connectDropTarget(
      <div>
        {filteredChoices.map((c, index) => (
          <Choice key={`${c.value}-${index}`} disabled={disabled} choice={c} />
        ))}
      </div>
    );
  }
}

export const spec = {
  drop: (props, monitor) => {
    log('[drop] props: ', props);
    const item = monitor.getItem();
    props.onDropChoice(item);
  },
  canDrop: (props /*, monitor*/) => {
    return !props.disabled;
  }
};

const WithTarget = DropTarget(
  ({ uid }) => uid,
  spec,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  })
)(Choices);

export default uid.withUid(WithTarget);
