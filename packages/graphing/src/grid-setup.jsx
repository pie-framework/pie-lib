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
import { NumberTextFieldCustom, Toggle } from '@pie-lib/config-ui';

const GridConfig = ({ classes, disabled, labelInterval, gridInterval, onChange }) => {
  return (
    <div className={classes.columnView}>
      <NumberTextFieldCustom
        className={classes.textField}
        label={'Grid Interval'}
        value={gridInterval}
        variant={'outlined'}
        disabled={disabled}
        onChange={(e, v) => onChange('step', v)}
      />
      <NumberTextFieldCustom
        className={classes.textField}
        label={'Label Interval'}
        value={labelInterval}
        variant={'outlined'}
        disabled={disabled}
        onChange={(e, v) => onChange('labelStep', v)}
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
      <NumberTextFieldCustom
        className={classes.textField}
        label={'Min Value'}
        value={minValue}
        variant={'outlined'}
        disabled={disabled}
        onChange={(e, v) => onChange('min', v)}
      />
      <NumberTextFieldCustom
        className={classes.textField}
        label={'Max Value'}
        value={maxValue}
        variant={'outlined'}
        disabled={disabled}
        onChange={(e, v) => onChange('max', v)}
      />
      <TextField
        label="Label"
        value={label}
        inputProps={{
          maxLength: 5,
          style: { textAlign: 'center' }
        }}
        variant={'outlined'}
        className={classes.textField}
        onChange={e => onChange('axisLabel', e.target.value)}
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
  const gridProps = { min: 2, max: 41 };

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
      <NumberTextFieldCustom
        className={classes.largeTextField}
        label={'Number of Horizontal Gridlines'}
        value={domain.max}
        min={!includeAxes && gridProps.min}
        max={!includeAxes && gridProps.max}
        variant={'outlined'}
        onChange={(e, v) => onDomainChanged('max', v)}
      />
      <NumberTextFieldCustom
        className={classes.largeTextField}
        label={'Number of Vertical Gridlines'}
        value={range.max}
        min={!includeAxes && gridProps.min}
        max={!includeAxes && gridProps.max}
        variant={'outlined'}
        disabled={standardGrid}
        onChange={(e, v) => onRangeChanged('max', v)}
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
              <NumberTextFieldCustom
                className={classes.textField}
                label={'Width'}
                value={size.width}
                min={sizeConstraints.min}
                max={sizeConstraints.max}
                step={sizeConstraints.step}
                variant={'outlined'}
                onChange={(e, v) => onSizeChanged('width', v)}
              />
              <NumberTextFieldCustom
                className={classes.textField}
                label={'Height'}
                value={size.height}
                min={sizeConstraints.min}
                max={sizeConstraints.max}
                step={sizeConstraints.step}
                variant={'outlined'}
                disabled={standardGrid}
                onChange={(e, v) => onSizeChanged('height', v)}
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
