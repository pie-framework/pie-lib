import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChartType from './chart-type';
import { NumberTextFieldCustom } from '@pie-lib/config-ui';
import { AlertDialog } from '@pie-lib/config-ui';

const ConfigureChartPanel = props => {
  const { classes, model, onChange, gridValues = {}, labelValues = {} } = props;
  const [alertDialog, setAlertDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState('');
  const [resetValue, setResetValues] = useState(0);

  const { range, correctAnswer } = model;
  const size = model.graph;

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
    setOpen(false);
  };

  const removeOutOfRangeValues = () => {
    const { correctAnswer, data } = model;
    data.forEach(d => {
      if (d.value > range.max) {
        console.log(d.value, 'd.value > range.max');
        console.log(range.max, 'ramge max');
        d.value = 0;
      }
    });

    correctAnswer.data.forEach(d => {
      if (d.value > range.max) {
        console.log(d.value, 'd.value > range.max');
        console.log(range.max, 'ramge max');
        d.value = 0;

        console.log(model, 'model');
      }
    });

    console.log(model, 'model');
  };

  const rangeProps = chartType => {
    return chartType.includes('Plot') ? { min: 3, max: 10 } : { min: 0.05, max: 10000 };
  };

  const onSizeChanged = (key, value) => {
    const graph = { ...size, [key]: value };

    onChange({ ...model, graph });
  };

  const onRangeChanged = (key, value) => {
    // use this values to reset range to default values
    setResetValues(range[key]);
    setKey(key);

    range[key] = value;

    if (key === 'max') {
      // check all the values are smaller than step
      const outOfRange =
        model.data.find(d => d.value > value) ||
        model.correctAnswer.data.find(d => d.value > value);

      if (outOfRange) {
        setOpen(true);
      } else {
        onChange({ ...model, range });
      }
      console.log(outOfRange, 'out of range');
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
          // removeOutOfRangeValues(model.correctAnswer.data);
          handleAlertDialog(false, onChange({ ...model, range, correctAnswer }));
        },
        onClose: () => {
          range[key] = resetValue;
          handleAlertDialog(false);
        }
      });
    }
  }, [open]);

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
