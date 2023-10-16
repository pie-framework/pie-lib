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
import EditableHtml from '../editable-html/index';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import debug from 'debug';
import takeRight from 'lodash/takeRight';
import PointMenu from './point-menu';

import range from 'lodash/range';
const log = debug('pie-lib:rubric:authoring');

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

export const RubricType = PropTypes.shape({
  excludeZero: PropTypes.bool,
  points: PropTypes.arrayOf(PropTypes.string),
  sampleAnswers: PropTypes.arrayOf(PropTypes.string),
  maxPoints: PropTypes.number,
});

const MaxPoints = withStyles((theme) => ({
  formControl: {
    minWidth: '120px',
    margin: theme.spacing.unit,
  },
}))((props) => {
  const { value, onChange, max, classes } = props;

  return (
    <FormControl className={classes.formControl} variant="outlined">
      <InputLabel width={100} htmlFor="...">
        Max Points
      </InputLabel>
      <Select value={value} onChange={(e) => onChange(e.target.value)} input={<OutlinedInput labelWidth={80} />}>
        {range(1, max).map((v) => (
          <MenuItem key={`${v}`} value={v}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

// if the value is null or 'null', the Sample Answer input field for that point will not be dispalyed
// if the value is '', the Sample Answer input field will be empty
const checkSampleAnswer = (sampleAnswer) => sampleAnswer === null || sampleAnswer === 'null';

export const PointConfig = withStyles((theme) => ({
  pointConfig: {},
  row: {
    display: 'flex',
    width: '100%',
    position: 'relative',
  },
  editor: {
    width: '100%',
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  dragIndicator: {
    paddingTop: theme.spacing.unit,
    color: grey[500],
  },
  pointsLabel: {
    color: grey[500],
    paddingBottom: theme.spacing.unit,
    textTransform: 'uppercase',
  },
  sampleAnswersEditor: {
    paddingLeft: theme.spacing.unit * 3,
  },
  pointMenu: {
    position: 'absolute',
    right: 0,
  },
}))((props) => {
  const { points, content, classes, sampleAnswer, mathMlOptions = {} } = props;
  const pointsLabel = `${points} ${points <= 1 ? 'pt' : 'pts'}`;
  const showSampleAnswer = checkSampleAnswer(sampleAnswer);

  return (
    <div className={classes.pointConfig}>
      <Typography variant="overline" className={classes.pointsLabel}>
        {pointsLabel}
      </Typography>

      <div className={classes.row}>
        <DragIndicator className={classes.dragIndicator} />
        <EditableHtml
          className={classes.editor}
          markup={content}
          onChange={props.onChange}
          mathMlOptions={mathMlOptions}
        />
        <PointMenu
          classes={{
            icon: classes.pointMenu,
          }}
          showSampleAnswer={showSampleAnswer}
          onChange={props.onMenuChange}
        />
      </div>

      {!showSampleAnswer && (
        <div className={classes.sampleAnswersEditor}>
          <Typography variant="overline" className={classes.dragIndicator}>
            Sample Response
          </Typography>
          <EditableHtml
            className={classes.editor}
            markup={sampleAnswer}
            onChange={props.onSampleChange}
            mathMlOptions={mathMlOptions}
          />
        </div>
      )}
    </div>
  );
});

export class RawAuthoring extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    value: RubricType,
    onChange: PropTypes.func,
  };

  static defaultProps = {};

  dragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { value, onChange } = this.props;

    const points = reorder(value.points, result.source.index, result.destination.index);
    const sampleAnswers = reorder(value.sampleAnswers, result.source.index, result.destination.index);

    onChange({ ...value, points, sampleAnswers });
  };

  changeMaxPoints = (maxPoints) => {
    const { value, onChange } = this.props;
    const currentMax = value.points.length - 1;

    log('current', currentMax, 'new: ', maxPoints);

    let points, sampleAnswers;
    if (maxPoints > currentMax) {
      points = times(maxPoints - currentMax)
        .map(() => '')
        .concat(value.points);
      sampleAnswers = times(maxPoints - currentMax)
        .map(() => null)
        .concat(value.sampleAnswers);
    }

    if (maxPoints < currentMax) {
      log('less than');
      points = takeRight(value.points, maxPoints + 1);
      sampleAnswers = takeRight(value.sampleAnswers, maxPoints + 1);
    }

    if (points) {
      onChange({ ...value, points, sampleAnswers });
    }
  };

  changeContent = (index, content, type) => {
    // type could be 'points' or 'sampleAnswers'
    log(`changeModel[${type}]:`, index, content);

    if (type !== 'points' && type !== 'sampleAnswers') {
      return;
    }

    const { value, onChange } = this.props;
    const items = value[type] && Array.from(value[type]);

    items.splice(index, 1, content);
    log(`changeModel[${type}]:`, items);

    onChange({ ...value, [type]: items });
  };

  excludeZeros = () => {
    const { value, onChange } = this.props;

    onChange({ ...value, excludeZero: !value.excludeZero });
  };

  shouldRenderPoint = (index, value) => {
    if (!value.excludeZero) {
      return true;
    } else {
      if (index < value.points.length - 1) {
        return true;
      } else if (index === value.points.length - 1) {
        return false;
      }

      return true;
    }
  };

  onPointMenuChange = (index, clickedItem) => {
    if (clickedItem === 'sample') {
      const { value } = this.props;
      const sampleAnswers = Array.from(value.sampleAnswers || []);

      if (checkSampleAnswer(sampleAnswers[index])) {
        // an empty string will display an empty Sample Answer input field
        this.changeContent(index, '', 'sampleAnswers');
      } else {
        // when the content is null or 'null', the Sample Answer input field will not be displayed
        this.changeContent(index, null, 'sampleAnswers');
      }
    }
  };

  render() {
    const { classes, className, value, mathMlOptions = {} } = this.props;
    let { excludeZeroEnabled = true, maxPointsEnabled = true } = value || {};

    if (value && Number.isFinite(value.maxPoints)) {
      // eslint-disable-next-line no-console
      console.warn('maxPoints is deprecated - remove from model');
    }

    return (
      <div className={classNames(classes.class, className)}>
        <Typography variant="h5" className={classes.rubricTitle}>
          Rubric
        </Typography>
        <FormGroup row>
          {maxPointsEnabled && <MaxPoints max={10} value={value.points.length - 1} onChange={this.changeMaxPoints} />}
          {excludeZeroEnabled && (
            <FormControlLabel
              label="Exclude zeros"
              control={<Checkbox checked={value.excludeZero} onChange={this.excludeZeros} />}
            />
          )}
        </FormGroup>

        <div className={classes.container}>
          <DragDropContext onDragEnd={this.dragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {value.points.map(
                    (p, index) =>
                      this.shouldRenderPoint(index, value) && (
                        <Draggable key={`${p.points}-${index}`} index={index} draggableId={index.toString()}>
                          {(provided) => (
                            <div
                              className={classes.configHolder}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <PointConfig
                                points={value.points.length - 1 - index}
                                content={p}
                                sampleAnswer={value.sampleAnswers && value.sampleAnswers[index]}
                                onChange={(content) => this.changeContent(index, content, 'points')}
                                onSampleChange={(content) => this.changeContent(index, content, 'sampleAnswers')}
                                onMenuChange={(clickedItem) => this.onPointMenuChange(index, clickedItem)}
                                mathMlOptions={mathMlOptions}
                              />
                            </div>
                          )}
                        </Draggable>
                      ),
                  )}
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

const styles = (theme) => ({
  container: {
    backgroundColor: grey[200],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: grey[300],
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit,
  },
  configHolder: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  rubricTitle: {
    paddingLeft: theme.spacing.unit,
    margin: theme.spacing.unit,
  },
});

const StyledRawAuthoring = withStyles(styles)(RawAuthoring);

const Reverse = (props) => {
  const points = Array.from(props.value.points || []).reverse();
  let sampleAnswers = Array.from(props.value.sampleAnswers || []).reverse();

  if (points.length > sampleAnswers.length) {
    sampleAnswers = times(points.length - sampleAnswers.length)
      .map(() => null)
      .concat(sampleAnswers);
  }

  const value = { ...props.value, points, sampleAnswers };

  const onChange = (value) => {
    props.onChange({
      ...value,
      points: Array.from(value.points || []).reverse(),
      sampleAnswers: Array.from(value.sampleAnswers || []).reverse(),
    });
  };

  return <StyledRawAuthoring value={value} onChange={onChange} />;
};

Reverse.propTypes = {
  value: RubricType,
  getIndex: PropTypes.func,
  onChange: PropTypes.func,
};

export default Reverse;
