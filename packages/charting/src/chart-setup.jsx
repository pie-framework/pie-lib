import React from 'react';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChartType from './chart-type';
import { NumberTextFieldCustom } from '@pie-lib/config-ui';

const ConfigureChartPanel = props => {
  const { classes, model, onChange } = props;
  const { range } = model;
  const size = model.graph;

  const onSizeChanged = (key, value) => {
    const graph = { ...size, [key]: value };

    onChange({ ...model, graph });
  };

  const onRangeChanged = (key, value) => {
    const parsedValue = parseInt(value);

    range[key] = parsedValue;

    onChange({ ...model, range });
  };

  const onChartTypeChange = chartType => onChange({ ...model, chartType });

  return (
    <div className={classes.wrapper}>
      <Typography variant={'subtitle1'}>Configure Chart</Typography>
      <div className={classes.content}>
        <div className={classes.rowView}>
          <ChartType value={model.chartType} onChange={e => onChartTypeChange(e.target.value)} />
          <NumberTextFieldCustom
            className={classes.mediumTextField}
            label="Max Value"
            value={range.max}
            min={0}
            max={10000}
            variant="outlined"
            onChange={(e, v) => onRangeChanged('max', v)}
          />
        </div>
        <div className={classes.rowView}>
          <NumberTextFieldCustom
            className={classes.mediumTextField}
            label="Grid Interval"
            value={range.step}
            min={0}
            max={10000}
            variant="outlined"
            onChange={(e, v) => onRangeChanged('step', v)}
          />
          <NumberTextFieldCustom
            className={classes.mediumTextField}
            label={'Label Interval'}
            value={range.labelStep}
            min={0}
            max={10000}
            variant={'outlined'}
            onChange={(e, v) => onRangeChanged('labelStep', v)}
          />
        </div>
        <div className={classes.dimensions}>
          <div>
            <Typography>Dimensions(px)</Typography>
          </div>
          <div className={classes.columnView}>
            <NumberTextFieldCustom
              className={classes.textField}
              label={'Width'}
              value={size.width}
              min={50}
              max={700}
              variant={'outlined'}
              onChange={(e, v) => onSizeChanged('width', v)}
            />
            <Typography className={classes.disabled}>Min 50, Max 700</Typography>
          </div>
          <div className={classes.columnView}>
            <NumberTextFieldCustom
              className={classes.textField}
              label={'Height'}
              value={size.height}
              min={400}
              max={700}
              variant={'outlined'}
              onChange={(e, v) => onSizeChanged('height', v)}
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
    width: '450px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '24px'
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
    alignItems: 'center',
    margin: '24px 0px'
  },
  disabled: {
    color: color.disabled()
  }
});

export default withStyles(styles)(ConfigureChartPanel);
