import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from '../../drag';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/math-rendering';
import { color } from '../../render-ui';

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

    // TODO the Chip element is causing drag problems on touch devices. Avoid using Chip and consider refactoring the code. Keep in mind that Chip is a span with a button role, which interferes with seamless touch device dragging.

    return connectDragSource(
      <span className={classnames(classes.choice, disabled && classes.disabled)}>
        <Chip
          clickable={false}
          disabled={true}
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
    borderRadius: theme.spacing.unit * 2,
    margin: theme.spacing.unit / 2,
    transform: 'translate(0, 0)',
  },
  chip: {
    backgroundColor: color.background(),
    border: `1px solid ${color.text()}`,
    color: color.text(),
    alignItems: 'center',
    display: 'inline-flex',
    height: 'initial',
    minHeight: '32px',
    fontSize: 'inherit',
    whiteSpace: 'pre-wrap',
    maxWidth: '374px',
    // Added for touch devices, for image content.
    // This will prevent the context menu from appearing and not allowing other interactions with the image.
    // If interactions with the image in the token will be requested we should handle only the context Menu.
    pointerEvents: 'none',
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
