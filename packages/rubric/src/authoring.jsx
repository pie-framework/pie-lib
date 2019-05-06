import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import times from 'lodash/times';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
import DragIndicator from '@material-ui/icons/DragIndicator';
import EditableHtml from '@pie-lib/editable-html';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { swap } from '@pie-lib/drag';

export const RubricType = {
  maxPoints: PropTypes.number.isRequired,
  excludeZero: PropTypes.bool,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      points: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired
    })
  )
};

const MaxPoints = withStyles(theme => ({
  formControl: {
    minWidth: '120px',
    margin: theme.spacing.unit
  }
}))(props => {
  const { value, onChange, max, classes } = props;

  return (
    <FormControl className={classes.formControl} variant="outlined">
      <InputLabel width={100} htmlFor="...">
        Max Points
      </InputLabel>
      <Select value={value} onChange={onChange} input={<OutlinedInput labelWidth={80} />}>
        {times(max).map((v, index) => (
          <MenuItem key={`${v}`} value={v}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export const PointConfig = withStyles(theme => ({
  pointConfig: {
    // marginTop: theme.spacing.unit,
    // marginBottom: theme.spacing.unit,
    // paddingTop: theme.spacing.unit,
    // paddingBottom: theme.spacing.unit
  },
  row: {
    display: 'flex',
    width: '100%'
  },
  editor: {
    width: '100%'
  },
  dragIndicator: {
    paddingTop: theme.spacing.unit,
    color: grey[500]
  },
  pointsLabel: {
    color: grey[500],
    paddingBottom: theme.spacing.unit,
    textTransform: 'uppercase'
  }
}))(props => {
  const { points, content, classes } = props;
  const pointsLabel = `${points} ${points <= 1 ? 'pt' : 'pts'}`;
  return (
    <div className={classes.pointConfig}>
      <Typography variant="overline" className={classes.pointsLabel}>
        {pointsLabel}
      </Typography>
      <div className={classes.row}>
        <DragIndicator className={classes.dragIndicator} />
        <EditableHtml className={classes.editor} markup={content} onChange={() => ({})} />
      </div>
    </div>
  );
});

export class RawAuthoring extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    value: RubricType,
    onChange: PropTypes.func
  };
  static defaultProps = {};
  // <PointConfig value={p} key={`${p.points}-${index}`} />

  dragEnd = result => {
    if (!result.destination) {
      return;
    }

    const { value, onChange } = this.props;
    const points = swap(value.points, parseInt(result.draggableId, 10), result.destination.index);
    onChange({ ...this.props.value, points });
  };

  render() {
    const { classes, className, value } = this.props;
    return (
      <div className={classNames(classes.class, className)}>
        <FormGroup row>
          <MaxPoints max={10} value={value.maxPoints} onChange={this.changeMaxPoints} />
          <FormControlLabel
            label="Exclude Zero"
            control={<Checkbox value={value.excludeZero} onChange={this.changeExcludeZero} />}
          />
        </FormGroup>
        <div className={classes.container}>
          <DragDropContext onDragEnd={this.dragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {value.points.map((p, index) => (
                    <Draggable
                      key={`${p.points}-${index}`}
                      index={index}
                      draggableId={index.toString()}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <PointConfig points={value.points.length - 1 - index} content={p} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    backgroundColor: grey[200],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: grey[300]
    // padding: theme.spacing.unit * 2,
    // margin: theme.spacing.unit
  }
});

const StyledRawAuthoring = withStyles(styles)(RawAuthoring);
const Authoring = props => {
  const value = { ...props.value, points: props.value.points.reverse() };

  const onChange = value => {
    props.onChange({ ...value, points: value.points.reverse() });
  };
  return <StyledRawAuthoring value={value} onChange={onChange} />;
};

Authoring.propTypes = {
  value: RubricType,
  onChange: PropTypes.func
};

export default Authoring;
