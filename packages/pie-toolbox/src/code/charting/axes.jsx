import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types } from '../plot';
import { color } from '../../render-ui';
import { AlertDialog } from '../config-ui';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { bandKey, getTickValues, getRotateAngle } from './utils';
import MarkLabel from './mark-label';
import Checkbox from '@material-ui/core/Checkbox';

export class TickComponent extends React.Component {
  static propTypes = {
    defineChart: PropTypes.bool,
    error: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        open: false,
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.autoFocus && !prevProps.autoFocus) {
      this.props.onAutoFocusUsed();
    }
  }

  handleAlertDialog = (open, callback) =>
    this.setState(
      {
        dialog: { open },
      },
      callback,
    );

  changeCategory = (index, newLabel) => {
    const { categories, onChangeCategory } = this.props;
    const category = categories[index];

    onChangeCategory(index, { ...category, label: newLabel });
  };

  deleteCategory = (index) => {
    const { categories, onChange } = this.props;

    if (index >= 0 && categories[index]) {
      onChange([...categories.slice(0, index), ...categories.slice(index + 1)]);
    }
  };

  changeInteractive = (index, value) => {
    const { categories, onChangeCategory } = this.props;
    const category = categories[index];

    if (!value) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: 'This will remove the correct answer value that has been defined for this category.',
          onConfirm: () =>
            this.handleAlertDialog(false, onChangeCategory(index, { ...category, interactive: !category.interactive })),
          onClose: () => this.handleAlertDialog(false),
        },
      });
    } else {
      onChangeCategory(index, { ...category, interactive: !category.interactive });
    }
  };

  changeEditable = (index, value) => {
    const { categories, onChangeCategory } = this.props;
    const category = categories[index];

    if (!value) {
      this.setState({
        dialog: {
          open: true,
          title: 'Warning',
          text: 'This will remove the correct answer category name that has been defined for this category.',
          onConfirm: () =>
            this.handleAlertDialog(
              false,
              onChangeCategory(index, { ...category, editable: !category.editable || false }),
            ),
          onClose: () => this.handleAlertDialog(false),
        },
      });
    } else {
      onChangeCategory(index, { ...category, editable: !category.editable || false });
    }
  };

  splitText = (text, maxChar) => {
    let chunks = [];
    while ((text || '').length > 0) {
      let indexToSplit;
      if (text.length > maxChar) {
        indexToSplit = text.lastIndexOf(' ', maxChar);
        if (indexToSplit === -1) {
          indexToSplit = maxChar;
        }
      } else {
        indexToSplit = text.length;
      }
      chunks.push(text.substring(0, indexToSplit));
      text = text.substring(indexToSplit).trim();
    }
    return chunks;
  };

  render() {
    const {
      classes,
      categories,
      xBand,
      bandWidth,
      barWidth,
      rotate,
      top,
      graphProps,
      defineChart,
      chartingOptions,
      x,
      y,
      formattedValue,
      changeInteractiveEnabled,
      changeEditableEnabled,
      error,
      autoFocus,
    } = this.props;

    if (!formattedValue) {
      return null;
    }

    const { dialog } = this.state;
    const { changeEditable, changeInteractive } = chartingOptions || {};
    const index = parseInt(formattedValue.split('-')[0], 10);
    const category = categories[index];
    const { deletable, editable, interactive, label, correctness } = category || {};
    const barX = xBand(bandKey({ label }, index));
    const longestCategory = (categories || []).reduce((a, b) => {
      const lengthA = a && a.label ? a.label.length : 0;
      const lengthB = b && b.label ? b.label.length : 0;

      return lengthA > lengthB ? a : b;
    });

    const longestLabel = (longestCategory && longestCategory.label) || '';
    const distinctMessages = error ? [...new Set(Object.values(error))].join(' ') : '';

    return (
      <g>
        <foreignObject
          x={bandWidth ? barX : x - barWidth / 2}
          y={6}
          width={barWidth}
          height={4}
          style={{ pointerEvents: 'none', overflow: 'visible' }}
        >
          {index === 0 && (
            <div
              id="hiddenLabel"
              style={{
                position: 'absolute',
                visibility: 'hidden',
                wordBreak: 'break-word',
                overflow: 'visible',
                maxWidth: barWidth,
                display: 'block',
              }}
            >
              {longestLabel}
            </div>
          )}

          <MarkLabel
            autoFocus={defineChart && autoFocus}
            inputRef={(r) => (this.input = r)}
            disabled={!defineChart && !editable}
            mark={category}
            graphProps={graphProps}
            onChange={(newLabel) => this.changeCategory(index, newLabel)}
            barWidth={barWidth}
            rotate={rotate}
            correctness={correctness}
            error={error && error[index]}
          />
        </foreignObject>

        {error && index === 0 && (
          <text className={classes.error} y={y + 23} height={6} textAnchor="start">
            {distinctMessages}
          </text>
        )}

        {deletable && !correctness && (
          <line x1={x} y1={0} x2={x} y2={y + 4 + top} className={classes.dottedLine} strokeDasharray="4 2" />
        )}

        {deletable && !correctness && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x={x - 8}
            y={y + 60 + top}
            width={16}
            height={16}
            viewBox="0 0 512 512"
            onClick={() => this.deleteCategory(index)}
          >
            <path d="M128 405.429C128 428.846 147.198 448 170.667 448h170.667C364.802 448 384 428.846 384 405.429V160H128v245.429zM416 96h-80l-26.785-32H202.786L176 96H96v32h320V96z" />
          </svg>
        )}

        {defineChart && index === 0 && (
          <svg
            x={-55}
            style={{
              overflow: 'visible',
            }}
          >
            {changeInteractiveEnabled && (
              <text
                y={y + 90 + top}
                width={barWidth}
                height={4}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  wordBreak: 'break-word',
                  maxWidth: barWidth,
                  display: 'inline-block',
                }}
              >
                {this.splitText(changeInteractive?.authoringLabel, 20).map((word, index) => (
                  <tspan key={index} x="0" dy={`${index > 0 ? '1.2em' : '.6em'}`}>
                    {word}
                  </tspan>
                ))}
              </text>
            )}

            {changeEditableEnabled && (
              <text
                y={y + 145 + top}
                width={barWidth}
                height={4}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  wordBreak: 'break-word',
                  maxWidth: barWidth,
                  display: 'inline-block',
                }}
              >
                {this.splitText(changeEditable?.authoringLabel, 20).map((word, index) => (
                  <tspan key={index} x="0" dy={`${index > 0 ? '1.2em' : '.6em'}`}>
                    {word}
                  </tspan>
                ))}
              </text>
            )}
          </svg>
        )}

        {defineChart && changeInteractiveEnabled && (
          <foreignObject
            x={x - 24}
            y={y + 80 + top}
            width={barWidth}
            height={4}
            style={{ pointerEvents: 'visible', overflow: 'visible' }}
          >
            <Checkbox
              style={{ position: 'fixed' }}
              checked={interactive}
              onChange={(e) => this.changeInteractive(index, e.target.checked)}
            />
          </foreignObject>
        )}

        {defineChart && changeEditableEnabled && (
          <foreignObject
            x={x - 24}
            y={y + 130 + top}
            width={barWidth}
            height={4}
            style={{ pointerEvents: 'visible', overflow: 'visible' }}
          >
            <Checkbox
              style={{ position: 'fixed' }}
              checked={editable}
              onChange={(e) => this.changeEditable(index, e.target.checked)}
            />
          </foreignObject>
        )}

        <foreignObject
          x={x - 24}
          y={y + 100 + top}
          width={barWidth}
          height={4}
          style={{ pointerEvents: 'visible', overflow: 'visible' }}
        >
          <AlertDialog
            open={dialog.open}
            title={dialog.title}
            text={dialog.text}
            onClose={dialog.onClose}
            onConfirm={dialog.onConfirm}
          />
        </foreignObject>
      </g>
    );
  }
}

TickComponent.propTypes = {
  categories: PropTypes.array,
  xBand: PropTypes.func,
  bandWidth: PropTypes.number,
  barWidth: PropTypes.number,
  rotate: PropTypes.number,
  top: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  graphProps: PropTypes.object,
  formattedValue: PropTypes.string,
  onChangeCategory: PropTypes.func,
  onChange: PropTypes.func,
  classes: PropTypes.object,
  error: PropTypes.object,
  defineChart: PropTypes.bool,
  chartingOptions: PropTypes.object,
  changeInteractiveEnabled: PropTypes.bool,
  changeEditableEnabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onAutoFocusUsed: PropTypes.func,
};

export class RawChartAxes extends React.Component {
  static propTypes = {
    bottomScale: PropTypes.func,
    classes: PropTypes.object.isRequired,
    categories: PropTypes.array,
    defineChart: PropTypes.bool,
    error: PropTypes.any,
    graphProps: types.GraphPropsType.isRequired,
    xBand: PropTypes.func,
    leftAxis: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeCategory: PropTypes.func,
    top: PropTypes.number,
    theme: PropTypes.object,
    chartingOptions: PropTypes.object,
    changeInteractiveEnabled: PropTypes.bool,
    changeEditableEnabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onAutoFocusUsed: PropTypes.func,
  };

  state = { height: 0 };

  componentDidMount() {
    const height = document.getElementById('hiddenLabel') ? document.getElementById('hiddenLabel').offsetHeight : 0;

    this.setState({ height });
  }

  render() {
    const {
      classes,
      graphProps,
      xBand,
      leftAxis,
      onChange,
      onChangeCategory,
      categories = [],
      top,
      defineChart,
      chartingOptions,
      changeInteractiveEnabled,
      changeEditableEnabled,
      theme,
      autoFocus,
      onAutoFocusUsed,
      error,
    } = this.props;

    const { axis, axisLine, tick } = classes;
    const { scale = {}, range = {}, domain = {}, size = {} } = graphProps || {};
    const { height } = this.state;

    const bottomScale = xBand && typeof xBand.rangeRound === 'function' && xBand.rangeRound([0, size.width]);

    const bandWidth = xBand && typeof xBand.bandwidth === 'function' && xBand.bandwidth();
    // for chartType "line", bandWidth will be 0, so we have to calculate it
    const barWidth = bandWidth || (scale.x && scale.x(domain.max) / categories.length);

    const rowTickValues = getTickValues({ ...range, step: range.labelStep });
    const fontSize = theme && theme.typography ? theme.typography.fontSize : 14;
    const rotate = getRotateAngle(fontSize, height);

    const getTickLabelProps = (value) => ({
      dy: 4,
      dx: -10 - (value.toLocaleString().length || 1) * 5,
    });

    const getTickComponent = (props) => {
      const properties = {
        classes,
        categories,
        xBand,
        bandWidth,
        barWidth,
        rotate,
        top,
        defineChart,
        chartingOptions,
        autoFocus,
        onAutoFocusUsed,
        error,
        onChangeCategory,
        changeInteractiveEnabled,
        changeEditableEnabled,
        onChange,
        graphProps,
        x: props.x,
        y: props.y,
        formattedValue: props.formattedValue,
      };

      return <TickComponent {...properties} />;
    };

    return (
      <React.Fragment>
        {leftAxis && (
          <AxisLeft
            scale={scale.y}
            className={axis}
            axisLineClassName={axisLine}
            tickLength={10}
            tickClassName={tick}
            tickFormat={(value) => value}
            tickValues={rowTickValues}
            tickLabelProps={getTickLabelProps}
          />
        )}
        <AxisBottom
          axisLineClassName={axisLine}
          tickClassName={tick}
          scale={bottomScale}
          labelProps={{ y: 60 + top }}
          top={scale.y && scale.y(range.min)}
          textLabelProps={() => ({ textAnchor: 'middle' })}
          tickFormat={(count) => count}
          tickComponent={getTickComponent}
          autoFocus={autoFocus}
          onAutoFocusUsed={onAutoFocusUsed}
        />
      </React.Fragment>
    );
  }
}

const ChartAxes = withStyles(
  (theme) => ({
    axis: {
      stroke: color.primaryDark(),
      strokeWidth: 2,
    },
    axisLine: {
      stroke: color.primaryDark(),
      strokeWidth: 2,
    },
    tick: {
      '& > line': {
        stroke: color.primaryDark(),
        strokeWidth: 2,
      },
      fill: color.primaryDark(),
      fontFamily: theme.typography.body1.fontFamily,
      fontSize: theme.typography.fontSize,
      textAnchor: 'middle',
    },
    dottedLine: {
      stroke: color.primaryLight(),
      opacity: 0.2,
    },
    error: {
      fontSize: theme.typography.fontSize - 2,
      fill: theme.palette.error.main,
    },
  }),
  { withTheme: true },
)(RawChartAxes);

export default ChartAxes;
