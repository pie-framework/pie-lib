import React from 'react';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChartType from './chart-type';
import { NumberTextFieldCustom } from '@pie-lib/config-ui';

const ConfigureChartPanel = props => {
  const { classes, model, onChange, chartDimensions, gridValues = {}, labelValues = {} } = props;
  const { range } = model;
  const size = model.graph;
  const { showInConfigPanel, width, height } = chartDimensions || {};

  const widthConstraints = {
    min: width?.min ? Math.max(50, width.min) : 50,
    max: width?.max ? Math.min(700, width.max) : 700,
    step: width?.step >= 1 ? Math.min(200, width.step) : 20
  };
  const heightConstraints = {
    min: height?.min ? Math.max(400, height.min) : 400,
    max: height?.max ? Math.min(700, height.max) : 700,
    step: height?.step >= 1 ? Math.min(200, height.step) : 20
  };

  const gridOptions =
    gridValues && gridValues.range ? { customValues: gridValues.range } : { min: 0, max: 10000 };
  const labelOptions =
    labelValues && labelValues.range ? { customValues: labelValues.range } : { min: 0, max: 10000 };

  const stepConfig = (
    <div className={classes.rowView}>
      <NumberTextFieldCustom
        className={classes.mediumTextField}
        label="Grid Interval"
        value={range.step}
        variant="outlined"
        onChange={(e, v) => onRangeChanged('step', v)}
        {...gridOptions}
      />
      <NumberTextFieldCustom
        className={classes.mediumTextField}
        label={'Label Interval'}
        value={range.labelStep}
        variant={'outlined'}
        onChange={(e, v) => onRangeChanged('labelStep', v)}
        {...labelOptions}
      />
    </div>
  );

  const rangeProps = chartType => {
    return chartType.includes('Plot') ? { min: 3, max: 10 } : { min: 0.05, max: 10000 };
  };

  const onSizeChanged = (key, value) => {
    const graph = { ...size, [key]: value };

    onChange({ ...model, graph });
  };

  const onRangeChanged = (key, value) => {
    range[key] = value;

    onChange({ ...model, range });
  };

  const onChartTypeChange = chartType => {
    if (chartType.includes('Plot')) {
      rangeProps.min = 3;
      rangeProps.max = 10;

      if (range.max > 10 || range.max < 3) {
        range.max = 10;
      }

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
          <ChartType value={model.chartType} onChange={e => onChartTypeChange(e.target.value)} />
          <NumberTextFieldCustom
            className={classes.mediumTextField}
            label="Max Value"
            value={range.max}
            min={rangeProps(model.chartType).min}
            max={rangeProps(model.chartType).max}
            variant="outlined"
            onChange={(e, v) => onRangeChanged('max', v)}
          />
        </div>
        {!model.chartType.includes('Plot') && stepConfig}
        {showInConfigPanel && (
          <div className={classes.dimensions}>
            <div>
              <Typography>Dimensions(px)</Typography>
            </div>
            <div className={classes.columnView}>
              <NumberTextFieldCustom
                className={classes.textField}
                label={'Width'}
                value={size.width}
                min={widthConstraints.min}
                max={widthConstraints.max}
                step={widthConstraints.step}
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
                min={heightConstraints.min}
                max={heightConstraints.max}
                step={heightConstraints.step}
                variant={'outlined'}
                onChange={(e, v) => onSizeChanged('height', v)}
              />
              <Typography className={classes.disabled}>Min 400, Max 700</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ConfigureChartPanel.propTypes = {
  classes: PropTypes.object,
  domain: PropTypes.object,
  onChange: PropTypes.function,
  range: PropTypes.object,
  chartDimension: PropTypes.object,
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
