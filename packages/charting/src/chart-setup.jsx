import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChartType from './chart-type';
import { NumberTextFieldCustom } from '@pie-lib/config-ui';
import { AlertDialog } from '@pie-lib/config-ui';

const ConfigureChartPanel = props => {
  const { classes, model, onChange, chartDimensions, gridValues = {}, labelValues = {} } = props;
  const [alertDialog, setAlertDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [rangeKey, setRangeKey] = useState('');
  const [resetValue, setResetValue] = useState(0);

  const { range, correctAnswer } = model;

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

  const handleAlertDialog = (open, callback) => {
    setAlertDialog(
      {
        alertDialog: open
      },
      callback
    );
    setOpen(open);
  };

  const resetValues = data =>
    data.forEach(d => {
      const remainder = d.value - range.step * Math.floor(d.value / range.step);

      if (d.value > range.max || remainder !== 0) {
        d.value = 0;
      }
    });

  const removeOutOfRangeValues = () => {
    const { correctAnswer, data } = model;

    resetValues(data);
    resetValues(correctAnswer.data);
  };

  const rangeProps = chartType => {
    return chartType.includes('Plot') ? { min: 3, max: 10 } : { min: 0.05, max: 10000 };
  };

  const onSizeChanged = (key, value) => {
    const graph = { ...size, [key]: value };

    onChange({ ...model, graph });
  };

  const onRangeChanged = (key, value) => {
    // use reset values to restore range to initial values
    setResetValue(range[key]);
    setRangeKey(key);

    range[key] = value;

    if (key === 'max' || key === 'step') {
      // check if current chart values are invalid for given range step/max
      const outOfRange =
        model.data.find(
          d => d.value > range.max || d.value - range.step * Math.floor(d.value / range.step) !== 0
        ) ||
        model.correctAnswer.data.find(
          d => d.value > range.max || d.value - range.step * Math.floor(d.value / range.step) !== 0
        );

      if (outOfRange) {
        setOpen(true);
      } else {
        onChange({ ...model, range });
      }
    } else {
      onChange({ ...model, range });
    }
  };

  useEffect(() => {
    if (open) {
      setAlertDialog({
        open: true,
        title: 'Warning',
        text: 'This change will remove values defined for one or more categories',
        onConfirm: () => {
          removeOutOfRangeValues();
          handleAlertDialog(false, onChange({ ...model, range, correctAnswer }));
        },
        onClose: () => {
          range[rangeKey] = resetValue;
          handleAlertDialog(false);
        }
      });
    }
  }, [open]);

  const isValidPlot = () =>
    range.step === 1 && range.labelStep === 1 && 3 <= range.max && range.max <= 10;

  const getPlotConfiguration = () => {
    rangeProps.min = 3;
    rangeProps.max = 10;

    range.max = 10;
    range.step = 1;
    range.labelStep = 1;

    onChange({ ...model, range });
  };

  const onChartTypeChange = chartType => {
    if (chartType.includes('Plot')) {
      // The selected chart type does not support the current chart configuration
      if (!isValidPlot) {
        // ask for user validation
      }

      rangeProps.min = 3;
      rangeProps.max = 10;

      onChange({ ...model, chartType });

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
      <AlertDialog
        open={alertDialog.open}
        title={alertDialog.title}
        text={alertDialog.text}
        onClose={alertDialog.onClose}
        onConfirm={alertDialog.onConfirm}
      />
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
