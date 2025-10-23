import React from 'react';
import PropTypes from 'prop-types';
import { color, InputContainer } from '@pie-lib/render-ui';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NumberTextFieldCustom, Toggle } from '@pie-lib/config-ui';
import EditableHTML from '@pie-lib/editable-html';
import { styled } from '@mui/material/styles';

const Wrapper = styled('div')(({ theme }) => ({
  width: '450px',
}));

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

const ColumnView = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const RowView = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
}));

const TextFieldSmall = styled('div')(({ theme }) => ({
  width: '130px',
  margin: `${theme.spacing(1)} ${theme.spacing(0.5)}`,
}));

const TextFieldMedium = styled('div')(({ theme }) => ({
  width: '160px',
  margin: `${theme.spacing(1)} ${theme.spacing(0.5)}`,
}));

const TextFieldLarge = styled('div')(({ theme }) => ({
  width: '230px',
  margin: `${theme.spacing(1)} ${theme.spacing(0.5)}`,
}));

const ItalicText = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  margin: `${theme.spacing(1)} 0`,
}));

const Dimensions = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const DisabledText = styled(Typography)(({ theme }) => ({
  color: color.disabled(),
}));

const AxisLabel = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

const GridConfig = (props) => {
  const { disabled, displayedFields, labelValue, labelValues, gridValue, gridValues, onChange } = props;
  const { labelStep = {}, step = {} } = displayedFields;

  return (
    <ColumnView>
      {step && step.enabled && (
        <TextFieldMedium>
          <NumberTextFieldCustom
            label={step.label || ''}
            value={gridValue}
            customValues={gridValues}
            variant="outlined"
            disabled={disabled}
            onChange={(e, v) => onChange('step', v)}
          />
        </TextFieldMedium>
      )}
      {labelStep && labelStep.enabled && (
        <TextFieldMedium>
          <NumberTextFieldCustom
            label={labelStep.label || ''}
            value={labelValue}
            customValues={labelValues}
            variant="outlined"
            disabled={disabled}
            onChange={(e, v) => onChange('labelStep', v)}
          />
        </TextFieldMedium>
      )}
    </ColumnView>
  );
};

GridConfig.propTypes = {
  disabled: PropTypes.bool,
  displayedFields: PropTypes.object,
  labelValue: PropTypes.number,
  labelValues: PropTypes.array,
  gridValue: PropTypes.number,
  gridValues: PropTypes.array,
  onChange: PropTypes.func,
};

const AxisConfig = (props) => {
  const { disabled, displayedFields, displayHeader, label, maxValue, minValue, onChange, type } = props;
  const { axisLabel = {}, min = {}, max = {} } = displayedFields;
  const activePlugins = ['bold', 'italic', 'underline', 'strikethrough'];

  return (
    <ColumnView>
      {displayHeader && (
        <Typography variant="subtitle2">
          <i>{type === 'domain' ? 'x' : 'y'}</i>-axis
        </Typography>
      )}
      {min && min.enabled && (
        <TextFieldMedium>
          <NumberTextFieldCustom
            label={min.label || ''}
            value={minValue}
            min={-10000}
            max={maxValue - 0.05}
            variant="outlined"
            disabled={disabled}
            onChange={(e, v) => onChange('min', v)}
          />
        </TextFieldMedium>
      )}
      {max && max.enabled && (
        <TextFieldMedium>
          <NumberTextFieldCustom
            label={max.label || ''}
            value={maxValue}
            min={minValue + 0.05}
            max={10000}
            variant="outlined"
            disabled={disabled}
            onChange={(e, v) => onChange('max', v)}
          />
        </TextFieldMedium>
      )}
      {axisLabel && axisLabel.enabled && (
        <TextFieldMedium>
          <InputContainer label={axisLabel.label || ''}>
            <AxisLabel>
              <EditableHTML
                onChange={(value) => onChange('axisLabel', value)}
                markup={label || ''}
                charactersLimit={5}
                activePlugins={activePlugins}
              />
            </AxisLabel>
          </InputContainer>
        </TextFieldMedium>
      )}
    </ColumnView>
  );
};

AxisConfig.propTypes = {
  disabled: PropTypes.bool,
  displayedFields: PropTypes.object,
  displayHeader: PropTypes.bool,
  label: PropTypes.string,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  type: PropTypes.string,
  onChange: PropTypes.func,
};

const GridSetup = (props) => {
  const {
    domain,
    displayedFields = {},
    gridValues = {},
    includeAxes,
    labelValues = {},
    onChange,
    onChangeView,
    range,
    size,
    sizeConstraints,
    standardGrid,
  } = props;

  const gridProps = { min: 2, max: 41 };
  const {
    axisLabel = {},
    dimensionsEnabled,
    includeAxesEnabled,
    labelStep = {},
    min = {},
    max = {},
    standardGridEnabled,
    step = {},
  } = displayedFields || {};

  const displayAxisType = min.enabled || max.enabled || axisLabel.enabled || step.enabled || labelStep.enabled;
  const gridConfigFields = { step, labelStep };
  const axisConfigFields = { min, max, axisLabel };

  const onIncludeAxes = (includeAxes) => {
    const noAxesConfig = (type) => {
      const axis = type === 'domain' ? domain : range;
      return {
        min: 1,
        max: axis.max < gridProps.min || axis.max > gridProps.max ? 16 : axis.max,
        step: 1,
        labelStep: 0,
      };
    };

    const updatedRange = {
      ...range,
      ...(includeAxes ? { labelStep: 1 } : noAxesConfig('range')),
    };
    const updatedDomain = {
      ...domain,
      ...(includeAxes ? { labelStep: 1 } : noAxesConfig('domain')),
    };

    onChange({ includeAxes, range: updatedRange, domain: updatedDomain });
  };

  const onStandardGridChanged = (value) => {
    onChange({
      standardGrid: value,
      range: {
        ...domain,
        axisLabel: range.axisLabel,
      },
      graph: {
        ...size,
        height: size.width,
      },
    });
  };

  const onSizeChanged = (key, value) => {
    const graph = { ...size, [key]: value };
    if (standardGrid) graph.height = value;
    onChange({ graph });
  };

  const onDomainChanged = (key, value) => {
    domain[key] = value;
    if (standardGrid && key !== 'axisLabel') range[key] = value;
    onChange({ domain, range });
  };

  const onRangeChanged = (key, value) => {
    range[key] = value;
    onChange({ range });
  };

  const axesConfig = (
    <>
      <RowView>
        <AxisConfig
          displayedFields={axisConfigFields}
          displayHeader={displayAxisType}
          type="domain"
          minValue={domain.min}
          maxValue={domain.max}
          label={domain.axisLabel}
          includeAxes={includeAxes}
          onChange={onDomainChanged}
        />
        <AxisConfig
          displayedFields={axisConfigFields}
          displayHeader={displayAxisType}
          type="range"
          minValue={range.min}
          maxValue={range.max}
          label={range.axisLabel}
          disabled={standardGrid}
          includeAxes={includeAxes}
          onChange={onRangeChanged}
        />
      </RowView>
      {(min.enabled || max.enabled) && (
        <ItalicText>
          If you want the axis to be visible, use a zero or negative Min Value, and a positive Max Value
        </ItalicText>
      )}
      {(step.enabled || labelStep.enabled) && (
        <RowView>
          <GridConfig
            displayedFields={gridConfigFields}
            gridValue={domain.step}
            labelValue={domain.labelStep}
            gridValues={gridValues.domain || []}
            labelValues={labelValues.domain || []}
            onChange={onDomainChanged}
          />
          <GridConfig
            disabled={standardGrid}
            displayedFields={gridConfigFields}
            gridValue={range.step}
            labelValue={range.labelStep}
            gridValues={gridValues.range || []}
            labelValues={labelValues.range || []}
            onChange={onRangeChanged}
          />
        </RowView>
      )}
      {labelStep.enabled && <ItalicText>For unnumbered gridlines, enter a label interval of 0</ItalicText>}
    </>
  );

  const gridlinesConfig =
    max.enabled ? (
      <ColumnView>
        <TextFieldLarge>
          <NumberTextFieldCustom
            label="Number of Vertical Gridlines"
            value={domain.max}
            min={!includeAxes && gridProps.min}
            max={!includeAxes && gridProps.max}
            variant="outlined"
            onChange={(e, v) => onDomainChanged('max', v)}
          />
        </TextFieldLarge>
        <TextFieldLarge>
          <NumberTextFieldCustom
            label="Number of Horizontal Gridlines"
            value={range.max}
            min={!includeAxes && gridProps.min}
            max={!includeAxes && gridProps.max}
            variant="outlined"
            disabled={standardGrid}
            onChange={(e, v) => onRangeChanged('max', v)}
          />
        </TextFieldLarge>
      </ColumnView>
    ) : null;

  return (
    <Wrapper>
      <Accordion onChange={onChangeView}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Customize Grid Setup</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Content>
            {includeAxesEnabled && (
              <Toggle label="Include axes and labels?" toggle={onIncludeAxes} checked={includeAxes} />
            )}
            {standardGridEnabled && (
              <Toggle
                label="Constrain to standard coordinate grid?"
                toggle={onStandardGridChanged}
                checked={standardGrid}
              />
            )}
            {includeAxes ? axesConfig : gridlinesConfig}
            {dimensionsEnabled && (
              <Dimensions>
                <div>
                  <Typography>Dimensions(px)</Typography>
                  <DisabledText>
                    Min {sizeConstraints.min}, Max {sizeConstraints.max}
                  </DisabledText>
                </div>
                <TextFieldSmall>
                  <NumberTextFieldCustom
                    label="Width"
                    value={size.width}
                    min={sizeConstraints.min}
                    max={sizeConstraints.max}
                    step={sizeConstraints.step}
                    variant="outlined"
                    onChange={(e, v) => onSizeChanged('width', v)}
                  />
                </TextFieldSmall>
                <TextFieldSmall>
                  <NumberTextFieldCustom
                    label="Height"
                    value={size.height}
                    min={sizeConstraints.min}
                    max={sizeConstraints.max}
                    step={sizeConstraints.step}
                    variant="outlined"
                    disabled={standardGrid}
                    onChange={(e, v) => onSizeChanged('height', v)}
                  />
                </TextFieldSmall>
              </Dimensions>
            )}
          </Content>
        </AccordionDetails>
      </Accordion>
    </Wrapper>
  );
};

GridSetup.propTypes = {
  domain: PropTypes.object,
  displayedFields: PropTypes.object,
  gridValues: PropTypes.object,
  includeAxes: PropTypes.bool,
  labelValues: PropTypes.object,
  onChange: PropTypes.func,
  onChangeView: PropTypes.func,
  range: PropTypes.object,
  size: PropTypes.object,
  sizeConstraints: PropTypes.object,
  standardGrid: PropTypes.bool,
};

export default GridSetup;
