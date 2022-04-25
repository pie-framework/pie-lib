import React from 'react';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import { NumberTextField, Toggle } from '@pie-lib/config-ui';

const GridConfig = ({ classes, disabled, labelInterval, gridInterval, onChange }) => {
  return (
    <div className={classes.columnView}>
      <TextField
        label={'Grid Interval'}
        type={'number'}
        value={gridInterval}
        variant={'outlined'}
        disabled={disabled}
        className={classes.textField}
        onChange={v => onChange('step', v)}
      />
      <TextField
        label={'Label Interval'}
        type={'number'}
        value={labelInterval}
        variant={'outlined'}
        disabled={disabled}
        className={classes.textField}
        onChange={v => onChange('labelStep', v)}
      />
    </div>
  );
};

const AxisConfig = ({ classes, disabled, label, maxValue, minValue, onChange, type }) => {
  return (
    <div className={classes.columnView}>
      <Typography variant={'subtitle2'}>
        <i>{type === 'domain' ? 'x' : 'y'}</i>
        -axis
      </Typography>
      <TextField
        label={'Min Value'}
        type={'number'}
        value={minValue}
        variant={'outlined'}
        disabled={disabled}
        className={classes.textField}
        onChange={v => onChange('min', v)}
      />
      <TextField
        label={'Max Value'}
        type={'number'}
        value={maxValue}
        variant={'outlined'}
        disabled={disabled}
        className={classes.textField}
        onChange={v => onChange('max', v)}
      />
      <TextField
        label="Label"
        value={label}
        inputProps={{ maxLength: 5 }}
        variant={'outlined'}
        className={classes.textField}
        onChange={v => onChange('axisLabel', v)}
      />
    </div>
  );
};

const GridSetup = props => {
  const {
    classes,
    sizeConstraints,
    domain,
    gridIntervalValues,
    includeAxes,
    labelIntervalValues,
    onChange,
    range,
    size,
    standardGrid
  } = props;
  const sizeProps = {
    min: sizeConstraints.min,
    max: sizeConstraints.max
  };
  const gridProps = { min: 2, max: 41 };

  const onIncludeAxes = value => {
    if (!value) {
      range.min = 1;
      range.max = range.max < gridProps.min || range.max > gridProps.max ? 16 : range.max;
      range.step = 1;
      range.labelStep = 0;

      domain.min = 1;
      domain.max = domain.max < gridProps.min || domain.max > gridProps.max ? 16 : domain.max;
      domain.step = 1;
      domain.labelStep = 0;
    } else {
      range.labelStep = 1;
      domain.labelStep = 1;
    }

    onChange({ includeAxes: value, range, domain });
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

  const onSizeChanged = (key, e) => {
    const { step, min, max } = sizeConstraints;
    const value = parseInt(e.target.value);
    const nextValue = value < size[key] ? size[key] - step : size[key] + step;

    if (nextValue < min || nextValue > max) {
      return;
    }

    const graph = { ...size, [key]: nextValue };

    if (standardGrid) {
      graph.height = nextValue;
    }

    onChange({ graph });
  };

  const onDomainChanged = (key, e) => {
    const { value } = e.target;
    const parsedValue = key !== 'axisLabel' ? parseInt(value) : value;

    if (!includeAxes && key === 'max' && (value < gridProps.min || value > gridProps.max)) {
      return;
    }

    domain[key] = parsedValue;

    if (standardGrid && key !== 'axisLabel') {
      range[key] = parsedValue;
    }

    onChange({ domain, range });
  };

  const onRangeChanged = (key, e) => {
    const { value } = e.target;

    if (!includeAxes && key === 'max' && (value < gridProps.min || value > gridProps.max)) {
      return;
    }

    range[key] = key !== 'axisLabel' ? parseInt(value) : value;

    onChange({ range });
  };

  const axesConfig = (
    <React.Fragment>
      <div className={classes.rowView}>
        <AxisConfig
          classes={classes}
          type={'domain'}
          minValue={domain.min}
          maxValue={domain.max}
          label={domain.axisLabel}
          includeAxes={includeAxes}
          onChange={onDomainChanged}
        />
        <AxisConfig
          classes={classes}
          type={'range'}
          minValue={range.min}
          maxValue={range.max}
          label={range.axisLabel}
          disabled={standardGrid}
          includeAxes={includeAxes}
          onChange={onRangeChanged}
        />
      </div>
      <Typography className={classes.text}>
        If you want the axis to be visible, use a zero or negative Min Value, and a positive Max
        Value
      </Typography>
      <div className={classes.rowView}>
        <GridConfig
          classes={classes}
          gridInterval={domain.step}
          labelInterval={domain.labelStep}
          onChange={onDomainChanged}
        />
        <GridConfig
          classes={classes}
          disabled={standardGrid}
          gridInterval={range.step}
          labelInterval={range.labelStep}
          onChange={onRangeChanged}
        />
      </div>
      <Typography className={classes.text}>
        For unnumbered gridlines, enter a label interval of 0
      </Typography>
    </React.Fragment>
  );

  const gridlinesConfig = (
    <div className={classes.columnView}>
      <TextField
        className={classes.largeTextField}
        label={'Number of Horizontal Gridlines'}
        type={'number'}
        value={domain.max}
        inputProps={!includeAxes && gridProps}
        variant={'outlined'}
        onChange={v => onDomainChanged('max', v)}
      />
      <TextField
        className={classes.largeTextField}
        disabled={standardGrid}
        label={'Number of Vertical Gridlines'}
        type={'number'}
        value={range.max}
        inputProps={!includeAxes && gridProps}
        variant={'outlined'}
        onChange={v => onRangeChanged('max', v)}
      />
    </div>
  );

  return (
    <div className={classes.wrapper}>
      <ExpansionPanel expanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant={'subtitle1'}>Customize Grid Setup</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.content}>
            <Toggle
              label={'Include axes and labels?'}
              toggle={onIncludeAxes}
              checked={includeAxes}
            />
            <Toggle
              label={'Constrain to standard coordinate grid?'}
              toggle={onStandardGridChanged}
              checked={standardGrid}
            />
            {includeAxes ? axesConfig : gridlinesConfig}
            <div className={classes.dimensions}>
              <div>
                <Typography>Dimensions(px)</Typography>
                <Typography className={classes.disabled}>Min 150, Max 700</Typography>
              </div>
              <TextField
                label={'Width'}
                type={'number'}
                value={size.width}
                inputProps={sizeProps}
                variant={'outlined'}
                className={classes.smallTextField}
                onChange={v => onSizeChanged('width', v)}
              />
              <TextField
                label={'Height'}
                type={'number'}
                value={size.height}
                inputProps={sizeProps}
                variant={'outlined'}
                className={classes.smallTextField}
                disabled={standardGrid}
                onChange={v => onSizeChanged('height', v)}
              />
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

GridSetup.propTypes = {
  classes: PropTypes.object,
  sizeConstraints: PropTypes.object,
  domain: PropTypes.object,
  gridIntervalValues: PropTypes.object,
  includeAxes: PropTypes.bool,
  labelIntervalValues: PropTypes.object,
  onChange: PropTypes.function,
  range: PropTypes.object,
  size: PropTypes.object,
  standardGrid: PropTypes.bool
};

const styles = theme => ({
  wrapper: {
    width: '400px'
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
  smallTextField: {
    width: '90px',
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`
  },
  textField: {
    width: '120px',
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
  }
});

export default withStyles(styles)(GridSetup);
