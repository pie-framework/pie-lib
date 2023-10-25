import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { color } from '../render-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChartType from './chart-type';
import { NumberTextFieldCustom } from '../config-ui';
import { AlertDialog } from '../config-ui';

export const resetValues = (data, updateModel, range, onChange, model) => {
  (data || []).forEach((d) => {
    const d_value_scaled = Math.round(d.value * 10);
    const range_step_scaled = Math.round(range.step * 10);
    const remainder_scaled = d_value_scaled % range_step_scaled;
    const remainder = remainder_scaled / 10;

    if (d.value > range.max || remainder !== 0) {
      d.value = 0;
    }
  });

  if (updateModel) {
    onChange({ ...model, data });
  }
};

const ConfigureChartPanel = (props) => {
  const {
    classes,
    model,
    onChange,
    chartDimensions,
    gridValues = {},
    labelValues = {},
    studentNewCategoryDefaultLabel = {},
    availableChartTypes = {},
    chartTypeLabel,
  } = props;
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    title: '',
    text: '',
    onClose: null,
    onConfirm: null,
  });
  const [open, setOpen] = useState(false);
  const [rangeKey, setRangeKey] = useState('');
  const [resetValue, setResetValue] = useState(0);

  const { range = {}, correctAnswer, changeInteractiveEnabled, changeEditableEnabled } = model;

  const size = model.graph;
  const { showInConfigPanel, width, height } = chartDimensions || {};

  const widthConstraints = {
    min: width?.min ? Math.max(50, width.min) : 50,
    max: width?.max ? Math.min(700, width.max) : 700,
    step: width?.step >= 1 ? Math.min(200, width.step) : 20,
  };
  const heightConstraints = {
    min: height?.min ? Math.max(400, height.min) : 400,
    max: height?.max ? Math.min(700, height.max) : 700,
    step: height?.step >= 1 ? Math.min(200, height.step) : 20,
  };

  const gridOptions = gridValues && gridValues.range ? { customValues: gridValues.range } : { min: 0, max: 10000 };
  const labelOptions = labelValues && labelValues.range ? { customValues: labelValues.range } : { min: 0, max: 10000 };

  const stepConfig = (
    <div className={classes.rowView}>
      <NumberTextFieldCustom
        className={classes.mediumTextField}
        label="Grid Interval"
        value={range.step}
        variant="outlined"
        onChange={(e, v) => onRangeChanged('step', v, e)}
        {...gridOptions}
      />
      <NumberTextFieldCustom
        className={classes.mediumTextField}
        label={'Label Interval'}
        value={range.labelStep}
        variant={'outlined'}
        onChange={(e, v) => onRangeChanged('labelStep', v, e)}
        {...labelOptions}
      />
    </div>
  );

  const handleAlertDialog = (openStatus, callback) => {
    setAlertDialog(
      (prevState) => ({
        ...prevState,
        open: openStatus,
      }),
      () => {
        if (callback) {
          callback();
        }
      },
    );

    setOpen(openStatus);
  };

  const setPropertiesToFalse = (data, property) => {
    return data.map((obj) => {
      if (obj.hasOwnProperty(property)) {
        obj[property] = property == 'interactive' ? true : false;
      }
      return obj;
    });
  };

  const removeOutOfRangeValues = (updateModel) => {
    const { correctAnswer, data } = model;

    if (changeInteractiveEnabled === false) {
      setPropertiesToFalse(data, 'interactive');
    }

    if (changeEditableEnabled === false) {
      setPropertiesToFalse(data, 'editable');
    }

    resetValues(data, updateModel, range, onChange, model);
    resetValues(correctAnswer.data, false, range, onChange, model);
  };

  const setCategoryDefaultLabel = () => {
    const studentCategoryDefaultLabel = studentNewCategoryDefaultLabel?.label;

    onChange({ ...model, studentCategoryDefaultLabel });
  };

  const rangeProps = (chartType) => {
    return chartType.includes('Plot') ? { min: 3, max: 10 } : { min: 0.05, max: 10000 };
  };

  const onSizeChanged = (key, value) => {
    const graph = { ...size, [key]: value };

    onChange({ ...model, graph });
  };

  const isOutOfRange = (data, range) =>
    (data || []).find((d) => d.value > range.max || d.value - range.step * Math.floor(d.value / range.step) !== 0);

  const onRangeChanged = (key, value, e) => {
    // use reset values to restore range to initial values
    setResetValue(range[key]);
    setRangeKey(key);

    range[key] = value;

    if (key === 'max' || key === 'step') {
      // check if current chart values are invalid for given range step/max
      const outOfRange = isOutOfRange(model.data, range) || isOutOfRange(model.correctAnswer.data, range);

      if (outOfRange && JSON.stringify(e) !== '{}') {
        setOpen(true);
      } else {
        onChange({ ...model, range });
      }
    } else {
      onChange({ ...model, range });
    }
  };

  useEffect(() => {
    removeOutOfRangeValues(true);
    setCategoryDefaultLabel();
  }, []);

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
        },
      });
    }
  }, [open]);

  const isValidPlot = range.step === 1 && range.labelStep === 1 && 3 <= range.max && range.max <= 10;

  const getPlotConfiguration = () => {
    rangeProps.min = 3;
    rangeProps.max = 10;

    range.max = 10;
    range.step = 1;
    range.labelStep = 1;

    onChange({ ...model, range });
  };

  const onChartTypeChange = (chartType) => {
    if (chartType.includes('Plot')) {
      // The selected chart type does not support the current chart configuration
      if (!isValidPlot) {
        setAlertDialog({
          open: true,
          title: 'Warning',
          text: 'The selected chart type does not support the current chart configuration. Reset chart configuration?',
          onConfirm: () => {
            getPlotConfiguration();
            removeOutOfRangeValues();
            handleAlertDialog(false, onChange({ ...model, range, chartType }));
          },
          onClose: () => {
            handleAlertDialog(false);
          },
        });

        return;
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
          <ChartType
            value={model.chartType}
            onChange={(e) => onChartTypeChange(e.target.value)}
            availableChartTypes={availableChartTypes}
            chartTypeLabel={chartTypeLabel}
          />
          <NumberTextFieldCustom
            className={classes.mediumTextField}
            label="Max Value"
            value={range.max}
            min={rangeProps(model.chartType).min}
            max={rangeProps(model.chartType).max}
            variant="outlined"
            onChange={(e, v) => onRangeChanged('max', v, e)}
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
  chartDimensions: PropTypes.object,
  domain: PropTypes.object,
  gridValues: PropTypes.object,
  labelValues: PropTypes.object,
  model: PropTypes.object,
  onChange: PropTypes.func,
  range: PropTypes.object,
  chartDimension: PropTypes.object,
  size: PropTypes.object,
  studentNewCategoryDefaultLabel: PropTypes.object,
  availableChartTypes: PropTypes.object,
  chartTypeLabel: PropTypes.string,
};

const styles = (theme) => ({
  wrapper: {
    width: '450px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  columnView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  rowView: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textField: {
    width: '130px',
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`,
  },
  mediumTextField: {
    width: '160px',
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`,
  },
  largeTextField: {
    width: '230px',
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`,
  },
  text: {
    fontStyle: 'italic',
    margin: `${theme.spacing.unit}px 0`,
  },
  dimensions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: `${theme.spacing.unit * 3}px 0`,
  },
  disabled: {
    color: color.disabled(),
  },
});

export default withStyles(styles)(ConfigureChartPanel);
