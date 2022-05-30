import React from 'react';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ChartType from './chart-type';

const ConfigureChartPanel = props => {
  const { classes, model, onChange } = props;

  const { chartType, range } = model;
  const size = model.graph;

  const rangeProps = { min: 1, max: 10000 };

  const onRangeChanged = (key, e) => {
    const { value } = e.target;
    const parsedValue = parseFloat(value);
    const minRangeAccepted = 0.05;
    const rangePropsPlot = { min: 3, max: 10 };

    if (key === 'max' && (parsedValue < minRangeAccepted || parsedValue > rangeProps.max)) {
      return;
    }

    if (
      model.chartType.includes('Plot') &&
      (parsedValue < rangePropsPlot.min || parsedValue > rangePropsPlot.max)
    ) {
      return;
    }

    range[key] = parsedValue;
    onChange({ ...model, range });
  };

  const stepConfig = (
    <div className={classes.rowView}>
      <TextField
        label={'Grid Interval'}
        type={'number'}
        value={range.step}
        inputProps={rangeProps}
        variant={'outlined'}
        className={classes.textField}
        onChange={v => onRangeChanged('step', v)}
      />
      <TextField
        label={'Label Interval'}
        type={'number'}
        value={range.labelStep}
        inputProps={rangeProps}
        variant={'outlined'}
        className={classes.textField}
        onChange={v => onRangeChanged('labelStep', v)}
      />
    </div>
  );

  const onSizeChanged = (key, e) => {
    const step = 1;
    const min = 50;
    const max = 700;
    const value = parseInt(e.target.value);
    const nextValue = value <= size[key] ? size[key] - step : size[key] + step;

    if (nextValue < min || nextValue > max) {
      return;
    }

    const graph = { ...size, [key]: nextValue };

    onChange({ ...model, graph });
  };

  const onChartTypeChange = chartType => {
    if (chartType.includes('Plot')) {
      rangeProps.min = 3;
      rangeProps.max = 10;

      if (range.max > 10 || range.max < 3) {
        range.max = 10;
      }
      // how to keep inital value of step and label step
      range.step = 1;
      range.labelStep = 1;
      onChange({ ...model, range, chartType });

      return;
    }

    onChange({ ...model, chartType });
  };

  return (
    <div className={classes.wrapper}>
      <Typography variant={'subtitle1'}>Configure Chart</Typography>

      <div className={classes.content}>
        <div className={classes.rowView}>
          <ChartType
            className={classes.textField}
            value={chartType}
            onChange={e => onChartTypeChange(e.target.value)}
          />
          <TextField
            label={'Max Value'}
            type={'number'}
            value={range.max}
            variant={'outlined'}
            inputProps={rangeProps}
            className={classes.textField}
            onChange={v => onRangeChanged('max', v)}
          />
        </div>
        {chartType.includes('Plot') ? null : stepConfig}
        <div className={classes.dimensions}>
          <Typography>Dimensions(px)</Typography>

          <div className={classes.columnView}>
            <TextField
              label={'Width'}
              type={'number'}
              value={size.width}
              //inputProps={sizeProps}
              variant={'outlined'}
              className={classes.smallTextField}
              onChange={v => onSizeChanged('width', v)}
            />
            <Typography className={classes.disabled}>Min 50, Max 700</Typography>
          </div>
          <div className={classes.columnView}>
            <TextField
              label={'Height'}
              type={'number'}
              value={size.height}
              // inputProps={sizeProps}
              variant={'outlined'}
              className={classes.smallTextField}
              onChange={v => onSizeChanged('height', v)}
            />
            <Typography className={classes.disabled}>Min 400, Max 700</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfigureChartPanel.propTypes = {
  classes: PropTypes.object,
  sizeConstraints: PropTypes.object,
  domain: PropTypes.object,
  gridIntervalValues: PropTypes.object,
  includeAxes: PropTypes.bool,
  labelIntervalValues: PropTypes.object,
  onChange: PropTypes.function,
  range: PropTypes.object,
  size: PropTypes.object
};

const styles = theme => ({
  wrapper: {
    width: '400px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '24px',
    marginBottom: '24px'
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
    alignItems: 'center',
    marginTop: '16px'
  },
  disabled: {
    color: color.disabled()
  }
});

export default withStyles(styles)(ConfigureChartPanel);
