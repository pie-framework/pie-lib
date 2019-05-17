import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';
import debug from 'debug';
import { DropTarget } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';
const log = debug('pie-lib:mask-markup:blank');
export const DRAG_TYPE = 'MaskBlank';

const useStyles = withStyles(theme => ({
  content: {
    border: `solid 0px ${theme.palette.primary.main}`,
    minWidth: '200px',
    padding: theme.spacing.unit
  },
  chip: {
    minWidth: '90px'
  },
  correct: {
    border: 'solid 1px green'
  },
  incorrect: {
    border: 'solid 1px red'
  }
}));

export class BlankContent extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    value: PropTypes.string,
    classes: PropTypes.object,
    isOver: PropTypes.bool,
    dragItem: PropTypes.object,
    correct: PropTypes.bool,
    onChange: PropTypes.func
  };

  componentDidUpdate() {
    renderMath(this.rootRef);
  }

  render() {
    const { id, disabled, value, classes, isOver, dragItem, correct, onChange } = this.props;
    const label = dragItem && isOver ? dragItem.label : value;

    return (
      <Chip
        ref={ref => {
          //eslint-disable-next-line
          this.rootRef = ReactDOM.findDOMNode(ref);
        }}
        component="span"
        label={<span dangerouslySetInnerHTML={{ __html: label }} />}
        className={classnames(
          classes.chip,
          classes[correct !== undefined ? (correct ? 'correct' : 'incorrect') : undefined]
        )}
        variant={disabled ? 'outlined' : undefined}
        onDelete={value && !disabled ? () => onChange(id, undefined) : undefined}
      />
    );
  }
}

const StyledBlankContent = useStyles(BlankContent);

const connectedBlankContent = useStyles(({ connectDropTarget, ...props }) => {
  const { classes, isOver } = props;

  return connectDropTarget(
    <span className={classnames(classes.content, isOver && classes.over)}>
      <StyledBlankContent {...props} />
    </span>
  );
});

const tileTarget = {
  drop(props, monitor) {
    const draggedItem = monitor.getItem();
    log('props.instanceId', props.instanceId, 'draggedItem.instanceId:', draggedItem.instanceId);
    props.onChange(props.id, draggedItem.value);
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();

    return draggedItem.instanceId === props.instanceId;
  }
};

const DropTile = DropTarget(DRAG_TYPE, tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem()
}))(connectedBlankContent);

// export default () => <div>hi</div>;
export default DropTile;
