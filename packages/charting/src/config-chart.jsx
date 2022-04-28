import React from 'react';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ChartType from './chart-type';

const ConfigChart = props => {
  const { classes, model, onChange } = props;

  const { range } = model;
  const size = model.graph;

  const gridProps = { min: 2, max: 41 };

  const onSizeChanged = (key, e) => {
    const step = 1;
    const min = 50;
    const max = 700;
    const value = parseInt(e.target.value);
    const nextValue = value <= size[key] ? size[key] - step : size[key] + step;

    console.log(nextValue, 'nextValue');

    if (nextValue < min || nextValue > max) {
      return;
      s;
    }

    const graph = { ...size, [key]: nextValue };
    console.log(graph, 'chart');

    onChange({ ...model, graph });
  };

  const onRangeChanged = (key, e) => {};

  const onChartTypeChange = chartType => onChange({ ...model, chartType });

  return (
    <div className={classes.wrapper}>
      <Typography variant={'subtitle1'}>Configure Chart</Typography>

      <div className={classes.content}>
        <div className={classes.rowView}>
          <ChartType value={model.chartType} onChange={e => onChartTypeChange(e.target.value)} />
          <TextField
            label={'Max Value'}
            type={'number'}
            value={range.max}
            variant={'outlined'}
            //disabled={disabled}
            className={classes.textField}
            onChange={v => onChange('max', v)}
          />
        </div>
        <div className={classes.rowView}>
          <TextField
            label={'Grid Interval'}
            type={'number'}
            //  value={}
            variant={'outlined'}
            //  disabled={disabled}
            className={classes.textField}
            onChange={v => onChange('step', v)}
          />
          <TextField
            label={'Label Interval'}
            type={'number'}
            //   value={}
            variant={'outlined'}
            //disabled={disabled}
            className={classes.textField}
            onChange={v => onChange('labelStep', v)}
          />
        </div>
        <div className={classes.dimensions}>
          <div>
            <Typography>Dimensions(px)</Typography>
          </div>
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

ConfigChart.propTypes = {
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

export default withStyles(styles)(ConfigChart);
