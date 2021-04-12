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
  sampleAnswers: PropTypes.arrayOf(PropTypes.string)
});

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
      <Select
        value={value}
        onChange={e => onChange(e.target.value)}
        input={<OutlinedInput labelWidth={80} />}
      >
        {range(1, max).map(v => (
          <MenuItem key={`${v}`} value={v}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export const PointConfig = withStyles(theme => ({
  pointConfig: {},
  row: {
    display: 'flex',
    width: '100%',
    position: 'relative'
  },
  editor: {
    width: '100%',
    backgroundColor: 'white !important'
  },
  dragIndicator: {
    paddingTop: theme.spacing.unit,
    color: grey[500]
  },
  pointsLabel: {
    color: grey[500],
    paddingBottom: theme.spacing.unit,
    textTransform: 'uppercase'
  },
  sampleAnswersEditor: {
    paddingLeft: theme.spacing.unit * 3
  },
  pointMenu: {
    position: 'absolute',
    right: 0
  }
}))(props => {
  const { points, content, classes, sampleAnswer } = props;
  const pointsLabel = `${points} ${points <= 1 ? 'pt' : 'pts'}`;

  return (
    <div className={classes.pointConfig}>
      <Typography variant="overline" className={classes.pointsLabel}>
        {pointsLabel}
      </Typography>
      <div className={classes.row}>
        <DragIndicator className={classes.dragIndicator} />
        <EditableHtml className={classes.editor} markup={content} onChange={props.onChange} />
        <PointMenu
          classes={{
            icon: classes.pointMenu
          }}
          sampleAnswer={sampleAnswer}
          onChange={props.onMenuChange}
        />
      </div>
      {sampleAnswer !== undefined && (
        <div className={classes.sampleAnswersEditor}>
          <Typography variant="overline" className={classes.dragIndicator}>
            Sample Response
          </Typography>
          <EditableHtml
            className={classes.editor}
            markup={sampleAnswer}
            onChange={props.onSampleChange}
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
    onChange: PropTypes.func
  };

  static defaultProps = {};

  dragEnd = result => {
    if (!result.destination) {
      return;
    }

    const { value, onChange } = this.props;
    const points = reorder(value.points, result.source.index, result.destination.index);
    const sampleAnswers = reorder(
      value.sampleAnswers,
      result.source.index,
      result.destination.index
    );
    onChange({ ...this.props.value, points, sampleAnswers });
  };

  changeMaxPoints = maxPoints => {
    const { value, onChange } = this.props;
    const currentMax = value.points.length - 1;

    log('current', currentMax, 'new: ', maxPoints);
    let points, sampleAnswers;
    if (maxPoints > currentMax) {
      points = times(maxPoints - currentMax)
        .map(() => '')
        .concat(value.points);
      sampleAnswers = times(maxPoints - currentMax)
        .map(() => undefined)
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

  changePoint = (index, content) => {
    log('changePoint:', index, content);
    const { value, onChange } = this.props;
    const points = Array.from(value.points);
    points.splice(index, 1, content);
    log('changePoint: points:', points);
    onChange({ ...value, points });
  };

  changeSampleAnswer = (index, content) => {
    log('changeSampleAnswer:', index, content);
    const { value, onChange } = this.props;
    const sampleAnswers = Array.from(value.sampleAnswers);
    sampleAnswers.splice(index, 1, content);
    log('changeSampleAnswer: sampleAnswers:', sampleAnswers);
    onChange({ ...value, sampleAnswers });
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
    if (clickedItem === 'text') {
      this.changePoint(index, '');
    }

    if (clickedItem === 'sample') {
      const { value } = this.props;
      const sampleAnswers = Array.from(value.sampleAnswers);

      // an undefined content will not display the Sample Answer input field
      if (sampleAnswers[index] === undefined) {
        this.changeSampleAnswer(index, '');
      } else {
        this.changeSampleAnswer(index, undefined);
      }
    }
  };

  render() {
    const { classes, className, value } = this.props;

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
          <MaxPoints max={10} value={value.points.length - 1} onChange={this.changeMaxPoints} />
          <FormControlLabel
            label="Exclude zeros"
            control={<Checkbox checked={value.excludeZero} onChange={this.excludeZeros} />}
          />
        </FormGroup>
        <div className={classes.container}>
          <DragDropContext onDragEnd={this.dragEnd}>
            <Droppable droppableId="droppable">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {value.points.map(
                    (p, index) =>
                      this.shouldRenderPoint(index, value) && (
                        <Draggable
                          key={`${p.points}-${index}`}
                          index={index}
                          draggableId={index.toString()}
                        >
                          {provided => (
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
                                onChange={this.changePoint.bind(this, index)}
                                onSampleChange={this.changeSampleAnswer.bind(this, index)}
                                onMenuChange={this.onPointMenuChange.bind(this, index)}
                              />
                            </div>
                          )}
                        </Draggable>
                      )
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

const styles = theme => ({
  container: {
    backgroundColor: grey[200],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: grey[300],
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit
  },
  configHolder: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  rubricTitle: {
    paddingLeft: theme.spacing.unit,
    margin: theme.spacing.unit
  }
});

const StyledRawAuthoring = withStyles(styles)(RawAuthoring);

const Reverse = props => {
  const points = Array.from(props.value.points).reverse();
  let sampleAnswers = Array.from(props.value.sampleAnswers || []).reverse();

  if (points.length > sampleAnswers.length) {
    sampleAnswers = times(points.length - sampleAnswers.length)
      .map(() => undefined)
      .concat(sampleAnswers);
  }

  const value = { ...props.value, points, sampleAnswers };

  const onChange = value => {
    props.onChange({
      ...value,
      points: Array.from(value.points).reverse(),
      sampleAnswers: Array.from(value.sampleAnswers).reverse()
    });
  };

  return <StyledRawAuthoring value={value} onChange={onChange} />;
};
Reverse.propTypes = {
  value: RubricType,
  getIndex: PropTypes.func,
  onChange: PropTypes.func
};
export default Reverse;
