import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import times from 'lodash/times';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import DragIndicator from '@mui/icons-material/DragIndicator';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import debug from 'debug';
import takeRight from 'lodash/takeRight';
import PointMenu from './point-menu';
import range from 'lodash/range';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/config-ui';
import { grey } from '@mui/material/colors';

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
  rubriclessInstruction: PropTypes.string,
});

const MaxPoints = (props) => {
  const { value, onChange, max } = props;
  const labelId = 'max-points-label';

  return (
    <FormControl sx={{ minWidth: 120, m: 1 }} variant="outlined">
      <InputLabel id={labelId}>Max Points</InputLabel>
      <Select
        labelId={labelId}
        label="Max Points"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        input={<OutlinedInput label="Max Points" />}
      >
        {range(1, max + 1).map((v) => (
          <MenuItem key={`${v}`} value={v}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// if the value is null or 'null', the Sample Answer input field for that point will not be dispalyed
// if the value is '', the Sample Answer input field will be empty
const checkSampleAnswer = (sampleAnswer) => sampleAnswer === null || sampleAnswer === 'null';

const PCContainer = styled('div')(() => ({}));
const Row = styled('div')(() => ({ display: 'flex', width: '100%', position: 'relative' }));
const EditorDiv = styled('div')(({ theme }) => ({ width: '100%', backgroundColor: `${theme.palette.common.white}` }));
const DragIndicatorStyled = styled(DragIndicator)(({ theme }) => ({ paddingTop: theme.spacing(1), color: grey[500] }));
const PointsLabel = styled(Typography)(({ theme }) => ({ color: grey[500], paddingBottom: theme.spacing(1), textTransform: 'uppercase' }));
const SampleAnswersEditor = styled('div')(({ theme }) => ({ paddingLeft: theme.spacing(3) }));
const ErrorText = styled('div')(({ theme }) => ({ fontSize: theme.typography.fontSize - 2, color: theme.palette.error.main, paddingLeft: theme.spacing(3), paddingTop: theme.spacing(1) }));
const PointMenuWrapper = styled('div')(() => ({ position: 'absolute', right: 0 }));

export const PointConfig = (props) => {
  const { points, content, sampleAnswer, mathMlOptions = {}, error, pluginOpts = {} } = props;
  const pointsLabel = `${points} ${points <= 1 ? 'pt' : 'pts'}`;
  const showSampleAnswer = checkSampleAnswer(sampleAnswer);

  return (
    <PCContainer>
      <PointsLabel variant="overline">{pointsLabel}</PointsLabel>
      <Row>
        <DragIndicatorStyled />
        <EditorDiv>
          <EditableHtml
            error={error}
            pluginProps={pluginOpts}
            markup={content}
            onChange={props.onChange}
            mathMlOptions={mathMlOptions}
          />
        </EditorDiv>
        <PointMenuWrapper>
          <PointMenu showSampleAnswer={showSampleAnswer} onChange={props.onMenuChange} />
        </PointMenuWrapper>
      </Row>
      {error && <ErrorText>{error}</ErrorText>}
      {!showSampleAnswer && (
        <SampleAnswersEditor>
          <DragIndicatorStyled as={Typography} variant="overline">
            Sample Response
          </DragIndicatorStyled>
          <EditorDiv>
            <EditableHtml
              markup={sampleAnswer}
              pluginProps={pluginOpts}
              onChange={props.onSampleChange}
              mathMlOptions={mathMlOptions}
            />
          </EditorDiv>
        </SampleAnswersEditor>
      )}
    </PCContainer>
  );
};

const Container = styled('div')(({ theme }) => ({
  backgroundColor: grey[200],
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: grey[300],
  padding: theme.spacing(2),
  margin: theme.spacing(1),
}));
const InputContainerWrapper = styled('div')(({ theme }) => ({ width: '100%', paddingTop: theme.spacing(2), marginBottom: theme.spacing(2) }));
const Rubricless = styled('div')(() => ({ display: 'none' }));
const ConfigHolder = styled('div')(({ theme }) => ({ paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1) }));
const RubricTitle = styled(Typography)(({ theme }) => ({ paddingLeft: theme.spacing(1), margin: theme.spacing(1) }));

export class RawAuthoring extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    value: RubricType,
    config: PropTypes.object,
    pluginOpts: PropTypes.object,
    rubricless: PropTypes.bool,
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

  changeRubriclessInstruction = (input) => {
    const { value, onChange } = this.props;
    onChange({ ...value, rubriclessInstruction: input });
  };

  changeMaxPoints = (maxPoints) => {
    const { value, onChange, rubricless } = this.props;
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

    if (points && !rubricless) {
      onChange({ ...value, points, sampleAnswers, maxPoints });
    } else {
      onChange({ ...value, maxPoints });
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
    const {
      className,
      value,
      mathMlOptions = {},
      config = {},
      rubricless = false,
      pluginOpts = {},
    } = this.props;
    let {
      excludeZeroEnabled = true,
      maxPointsEnabled = true,
      errors = {},
      rubriclessInstructionEnabled = false,
      maxPoints = 10,
    } = value || {};
    // rubric will contain a max value for maxPoints
    const { rubriclessInstruction = {}, maxMaxPoints = 10 } = config || {};
    const { pointsDescriptorsErrors } = errors || {};
    if (value && Number.isFinite(value.maxPoints)) {
      // eslint-disable-next-line no-console
      console.warn('maxPoints is deprecated - remove from model');
    }

    // for rubric value is computed based on points
    const maxPointsValue = !rubricless ? value.points.length - 1 : maxPoints;

    return (
      <div className={className}>
        <RubricTitle variant="h5">
          Rubric
        </RubricTitle>
        <FormGroup row>
          {maxPointsEnabled && (
            <MaxPoints
              max={maxMaxPoints < 100 ? maxMaxPoints : 100}
              value={maxPointsValue}
              onChange={this.changeMaxPoints}
              pluginOpts={pluginOpts}
            />
          )}
          {excludeZeroEnabled && (
            <FormControlLabel
              label="Exclude zeros"
              control={<Checkbox checked={value.excludeZero} onChange={this.excludeZeros} />}
            />
          )}
        </FormGroup>

        {rubriclessInstructionEnabled && rubricless && (
          <InputContainerWrapper>
            <InputContainer label={rubriclessInstruction.label}>
              <EditableHtml
                markup={value.rubriclessInstruction || ''}
                onChange={this.changeRubriclessInstruction}
                pluginProps={pluginOpts}
                nonEmpty={false}
                disableUnderline
                languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                mathMlOptions={mathMlOptions}
              />
            </InputContainer>
          </InputContainerWrapper>
        )}

        <div className={rubricless ? undefined : undefined}>
          {rubricless ? (
            <Rubricless />
          ) : (
            <Container>
          <DragDropContext onDragEnd={this.dragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {value.points.map(
                    (p, index) =>
                      this.shouldRenderPoint(index, value) && (
                        <Draggable key={`${p.points}-${index}`} index={index} draggableId={index.toString()}>
                          {(provided) => (
                            <ConfigHolder
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <PointConfig
                                points={value.points.length - 1 - index}
                                content={p}
                                error={
                                  pointsDescriptorsErrors && pointsDescriptorsErrors[value.points.length - 1 - index]
                                }
                                sampleAnswer={value.sampleAnswers && value.sampleAnswers[index]}
                                onChange={(content) => this.changeContent(index, content, 'points')}
                                onSampleChange={(content) => this.changeContent(index, content, 'sampleAnswers')}
                                onMenuChange={(clickedItem) => this.onPointMenuChange(index, clickedItem)}
                                mathMlOptions={mathMlOptions}
                                pluginOpts={pluginOpts}
                              />
                            </ConfigHolder>
                          )}
                        </Draggable>
                      ),
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
            </Container>
          )}
        </div>
      </div>
    );
  }
}

// styles migrated to styled-components above

const Reverse = (props) => {
  const { rubricless = false, config = {}, pluginOpts = {} } = props || {};
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

  return (
    <RawAuthoring
      value={value}
      config={config}
      onChange={onChange}
      rubricless={rubricless}
      pluginOpts={pluginOpts}
    />
  );
};

Reverse.propTypes = {
  value: RubricType,
  config: PropTypes.object,
  pluginOpts: PropTypes.object,
  rubricless: PropTypes.bool,
  getIndex: PropTypes.func,
  onChange: PropTypes.func,
};

export default Reverse;
