import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/math-rendering';

export const DRAG_TYPE = 'MaskBlank';

class BlankContentComp extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    choice: PropTypes.object,
    classes: PropTypes.object,
    connectDragSource: PropTypes.func,
  };

  componentDidUpdate() {
    renderMath(this.rootRef);
  }

  render() {
    const { connectDragSource, choice, classes, disabled } = this.props;

    return connectDragSource(
      <span className={classnames(classes.choice, disabled && classes.disabled)}>
        <Chip
          ref={(ref) => {
            //eslint-disable-next-line
            this.rootRef = ReactDOM.findDOMNode(ref);
          }}
          className={classes.chip}
          label={
            <span
              className={classes.chipLabel}
              ref={(ref) => {
                if (ref) {
                  ref.innerHTML = choice.value || ' ';
                }
              }}
            >
              {' '}
            </span>
          }
          variant={disabled ? 'outlined' : undefined}
        />
      </span>,
      {},
    );
  }
}

export const BlankContent = withStyles((theme) => ({
  choice: {
    border: `solid 0px ${theme.palette.primary.main}`,
  },
  chip: {
    alignItems: 'center',
    display: 'inline-flex',
    height: 'initial',
    minHeight: '32px',
    fontSize: 'inherit',
    whiteSpace: 'pre-wrap',
    maxWidth: '374px',
    margin: '4px',
  },
  chipLabel: {
    whiteSpace: 'pre-wrap',
    '& img': {
      display: 'block',
      padding: '2px 0',
    },
  },
  disabled: {},
}))(BlankContentComp);

const tileSource = {
  canDrag(props) {
    return !props.disabled;
  },
  beginDrag(props) {
    return {
      choice: props.choice,
      instanceId: props.instanceId,
    };
  },
};

const DragDropTile = DragSource(DRAG_TYPE, tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(BlankContent);

export default DragDropTile;
