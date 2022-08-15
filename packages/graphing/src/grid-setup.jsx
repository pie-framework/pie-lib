import React from 'react';
import PropTypes from 'prop-types';
import { color, InputContainer } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NumberTextFieldCustom, Toggle } from '@pie-lib/config-ui';
import EditableHTML from '@pie-lib/editable-html';

const GridConfig = props => {
  const {
    classes,
    disabled,
    displayedFields,
    labelValue,
    labelValues,
    gridValue,
    gridValues,
    onChange
  } = props;
  const { labelStep = {}, step = {} } = displayedFields;

  return (
    <div className={classes.columnView}>
      {step && step.enabled && (
        <NumberTextFieldCustom
          className={classes.mediumTextField}
          label={step.label || ''}
          value={gridValue}
          customValues={gridValues}
          variant="outlined"
          disabled={disabled}
          onChange={(e, v) => onChange('step', v)}
        />
      )}
      {labelStep && labelStep.enabled && (
        <NumberTextFieldCustom
          className={classes.mediumTextField}
          label={labelStep.label || ''}
          value={labelValue}
          customValues={labelValues}
          variant="outlined"
          disabled={disabled}
          onChange={(e, v) => onChange('labelStep', v)}
        />
      )}
    </div>
  );
};

GridConfig.propTypes = {
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  displayedFields: PropTypes.object,
  labelValue: PropTypes.number,
  labelValues: PropTypes.array,
  gridValue: PropTypes.number,
  gridValues: PropTypes.array,
  onChange: PropTypes.func
};

const AxisConfig = props => {
  const {
    classes,
    disabled,
    displayedFields,
    displayHeader,
    label,
    maxValue,
    minValue,
    onChange,
    type
  } = props;
  const { axisLabel = {}, min = {}, max = {} } = displayedFields;
  const activePlugins = [
    'bold',
    'italic',
    'underline',
    'strikethrough'
    // 'languageCharacters'
  ];

  return (
    <div className={classes.columnView}>
      {displayHeader && (
        <Typography variant="subtitle2">
          <i>{type === 'domain' ? 'x' : 'y'}</i>
          -axis
        </Typography>
      )}
      {min && min.enabled && (
        <NumberTextFieldCustom
          className={classes.mediumTextField}
          label={min.label || ''}
          value={minValue}
          min={-10000}
          max={maxValue - 0.01}
          variant="outlined"
          disabled={disabled}
          onChange={(e, v) => onChange('min', v)}
        />
      )}
      {max && max.enabled && (
        <NumberTextFieldCustom
          className={classes.mediumTextField}
          label={max.label || ''}
          value={maxValue}
          min={minValue + 0.01}
          max={10000}
          variant="outlined"
          disabled={disabled}
          onChange={(e, v) => onChange('max', v)}
        />
      )}
      {axisLabel && axisLabel.enabled && (
        <InputContainer label={axisLabel.label || ''} className={classes.mediumTextField}>
          <EditableHTML
            className={classes.axisLabel}
            onChange={value => onChange('axisLabel', value)}
            markup={label || ''}
            charactersLimit={5}
            activePlugins={activePlugins}
          />
        </InputContainer>
      )}
    </div>
  );
};

const GridSetup = props => {
  const {
    classes,
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
    standardGrid
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
    step = {}
  } = displayedFields || {};
  const displayAxisType =
    min.enabled || max.enabled || axisLabel.enabled || step.enabled || labelStep.enabled;
  const gridConfigFields = { step, labelStep };
  const axisConfigFields = { min, max, axisLabel };

  const onIncludeAxes = includeAxes => {
    const noAxesConfig = type => {
      const axis = type === 'domain' ? domain : range;

      return {
        min: 1,
        max: axis.max < gridProps.min || axis.max > gridProps.max ? 16 : axis.max,
        step: 1,
        labelStep: 0
      };
    };

    const updatedRange = {
      ...range,
      ...(includeAxes ? { labelStep: 1 } : noAxesConfig('range'))
    };
    const updatedDomain = {
      ...domain,
      ...(includeAxes ? { labelStep: 1 } : noAxesConfig('domain'))
    };

    onChange({ includeAxes, range: updatedRange, domain: updatedDomain });
  };

  const onStandardGridChanged = value => {
    onChange({
      standardGrid: value,
      range: {
        ...domain,
        axisLabel: range.axisLabel
      },
      graph: {
        ...size,
        height: size.width
      }
    });
  };

  const onSizeChanged = (key, value) => {
    const graph = { ...size, [key]: value };

    if (standardGrid) {
      graph.height = value;
    }

    onChange({ graph });
  };

  const onDomainChanged = (key, value) => {
    domain[key] = value;

    if (standardGrid && key !== 'axisLabel') {
      range[key] = value;
    }

    onChange({ domain, range });
  };

  const onRangeChanged = (key, value) => {
    range[key] = value;

    onChange({ range });
  };

  const axesConfig = (
    <React.Fragment>
      <div className={classes.rowView}>
        <AxisConfig
          classes={classes}
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
          classes={classes}
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
      </div>
      {(min.enabled || max.enabled) && (
        <Typography className={classes.text}>
          If you want the axis to be visible, use a zero or negative Min Value, and a positive Max
          Value
        </Typography>
      )}
      {(step.enabled || labelStep.enabled) && (
        <div className={classes.rowView}>
          <GridConfig
            classes={classes}
            displayedFields={gridConfigFields}
            gridValue={domain.step}
            labelValue={domain.labelStep}
            gridValues={gridValues.domain || []}
            labelValues={labelValues.domain || []}
            onChange={onDomainChanged}
          />
          <GridConfig
            classes={classes}
            disabled={standardGrid}
            displayedFields={gridConfigFields}
            gridValue={range.step}
            labelValue={range.labelStep}
            gridValues={gridValues.range || []}
            labelValues={labelValues.range || []}
            onChange={onRangeChanged}
          />
        </div>
      )}
      {labelStep.enabled && (
        <Typography className={classes.text}>
          For unnumbered gridlines, enter a label interval of 0
        </Typography>
      )}
    </React.Fragment>
  );

  const gridlinesConfig = max.enabled ? (
    <div className={classes.columnView}>
      <NumberTextFieldCustom
        className={classes.largeTextField}
        label="Number of Horizontal Gridlines"
        value={domain.max}
        min={!includeAxes && gridProps.min}
        max={!includeAxes && gridProps.max}
        variant="outlined"
        onChange={(e, v) => onDomainChanged('max', v)}
      />
      <NumberTextFieldCustom
        className={classes.largeTextField}
        label="Number of Vertical Gridlines"
        value={range.max}
        min={!includeAxes && gridProps.min}
        max={!includeAxes && gridProps.max}
        variant="outlined"
        disabled={standardGrid}
        onChange={(e, v) => onRangeChanged('max', v)}
      />
    </div>
  ) : null;

  return (
    <div className={classes.wrapper}>
      <ExpansionPanel onChange={onChangeView}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Customize Grid Setup</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.content}>
            {includeAxesEnabled && (
              <Toggle
                label="Include axes and labels?"
                toggle={onIncludeAxes}
                checked={includeAxes}
              />
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
              <div className={classes.dimensions}>
                <div>
                  <Typography>Dimensions(px)</Typography>
                  <Typography className={classes.disabled}>
                    Min {sizeConstraints.min}, Max {sizeConstraints.max}
                  </Typography>
                </div>
                <NumberTextFieldCustom
                  className={classes.textField}
                  label="Width"
                  value={size.width}
                  min={sizeConstraints.min}
                  max={sizeConstraints.max}
                  step={sizeConstraints.step}
                  variant="outlined"
                  onChange={(e, v) => onSizeChanged('width', v)}
                />
                <NumberTextFieldCustom
                  className={classes.textField}
                  label="Height"
                  value={size.height}
                  min={sizeConstraints.min}
                  max={sizeConstraints.max}
                  step={sizeConstraints.step}
                  variant="outlined"
                  disabled={standardGrid}
                  onChange={(e, v) => onSizeChanged('height', v)}
                />
              </div>
            )}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

GridSetup.propTypes = {
  classes: PropTypes.object,
  domain: PropTypes.object,
  displayedFields: PropTypes.object,
  gridValues: PropTypes.object,
  includeAxes: PropTypes.bool,
  labelValues: PropTypes.object,
  onChange: PropTypes.function,
  onChangeView: PropTypes.function,
  range: PropTypes.object,
  size: PropTypes.object,
  sizeConstraints: PropTypes.object,
  standardGrid: PropTypes.bool
};

const styles = theme => ({
  wrapper: {
    width: '450px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  columnView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  rowView: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  textField: {
    width: '130px',
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`
  },
  mediumTextField: {
    width: '160px',
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`
  },
  largeTextField: {
    width: '230px',
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`
  },
  text: {
    fontStyle: 'italic',
    margin: `${theme.spacing.unit}px 0`
  },
  dimensions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  disabled: {
    color: color.disabled()
  },
  axisLabel: {
    paddingTop: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(GridSetup);
