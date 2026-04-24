import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { AxisBottom, AxisLeft } from '@visx/axis';
import Checkbox from '@mui/material/Checkbox';

import { types } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import { AlertDialog } from '@pie-lib/config-ui';
import { renderMath } from '@pie-lib/math-rendering';

import { TickCorrectnessIndicator } from './common/correctness-indicators';
import { bandKey, getRotateAngle, getTickValues } from './utils';
import MarkLabel from './mark-label';

// one document-level MutationObserver shared across all
// RawChartAxes instances so that no chart misses a MathJax render batch
const _mathCallbacks = new Set();
let _docObserver = null;

function registerMathCallback(cb) {
  _mathCallbacks.add(cb);

  if (!_docObserver && typeof document !== 'undefined') {
    _docObserver = new MutationObserver(() => {
      _mathCallbacks.forEach((fn) => fn());
    });
    _docObserver.observe(document.body, { childList: true, subtree: true });
  }
}

function unregisterMathCallback(cb) {
  _mathCallbacks.delete(cb);

  if (_mathCallbacks.size === 0 && _docObserver) {
    _docObserver.disconnect();
    _docObserver = null;
  }
}

const StyledErrorText = styled('text')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  fill: theme.palette.error.main,
}));

const StyledCheckbox = styled(Checkbox)(() => ({
  color: `${color.tertiary()} !important`,
}));

const StyledAxesGroup = styled('g')(({ theme }) => ({
  '& .vx-axis-line': {
    stroke: color.visualElementsColors.AXIS_LINE_COLOR,
    strokeWidth: 2,
  },
  '& .vx-axis-tick': {
    fill: color.visualElementsColors.AXIS_TICK_COLOR,
    '& line': {
      stroke: color.visualElementsColors.AXIS_TICK_COLOR,
      strokeWidth: 2,
    },
    fontFamily: theme.typography.body1?.fontFamily,
    fontSize: theme.typography.fontSize,
    textAnchor: 'middle',
  },
}));

const correctnessIconStyles = (theme) => ({
  borderRadius: theme.spacing(2),
  color: color.defaults.WHITE,
  fontSize: '16px',
  width: '16px',
  height: '16px',
  padding: '2px',
  border: `1px solid ${color.defaults.WHITE}`,
  boxSizing: 'unset', // to override the default border-box in IBX
});

const incorrectIconStyles = {
  backgroundColor: color.incorrectWithIcon(),
};

const correctIconStyles = {
  backgroundColor: color.correct(),
};

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
      hiddenLabelRef,
      showCorrectness,
    } = this.props;

    if (!formattedValue) {
      return null;
    }

    // Create classes object for TickCorrectnessIndicator compatibility
    const classes = {
      correctnessIcon: correctnessIconStyles,
      incorrectIcon: incorrectIconStyles,
      correctIcon: correctIconStyles,
    };

    const { dialog } = this.state;
    const { changeEditable, changeInteractive } = chartingOptions || {};
    const index = parseInt(formattedValue.split('-')[0], 10);
    const category = categories[index];
    const { editable, interactive, label, correctness } = category || {};
    const barX = xBand(bandKey({ label }, index));
    const longestCategory = (categories || []).reduce(
      (a, b) => {
        const lengthA = a && a.label ? a.label.length : 0;
        const lengthB = b && b.label ? b.label.length : 0;

        return lengthA > lengthB ? a : b;
      },
      { label: '' },
    );
    const distinctMessages = error ? [...new Set(Object.values(error))].join(' ') : '';

    return (
      <g>
        <foreignObject
          x={bandWidth ? barX : x - barWidth / 2}
          y={18}
          width={barWidth}
          height={4}
          style={{ pointerEvents: 'none', overflow: 'visible' }}
        >
          {index === 0 && (
            <MarkLabel
              isHiddenLabel={true}
              inputRef={hiddenLabelRef}
              disabled={true}
              mark={longestCategory}
              graphProps={graphProps}
              barWidth={barWidth}
            />
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
            limitCharacters
            correctnessIndicator={
              showCorrectness &&
              correctness && (
                <TickCorrectnessIndicator correctness={correctness} interactive={interactive} classes={classes} />
              )
            }
          />
        </foreignObject>

        {error && index === 0 && (
          <StyledErrorText y={y + 23} height={6} textAnchor="start">
            {distinctMessages}
          </StyledErrorText>
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
            <StyledCheckbox
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
            <StyledCheckbox
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
  error: PropTypes.object,
  defineChart: PropTypes.bool,
  chartingOptions: PropTypes.object,
  changeInteractiveEnabled: PropTypes.bool,
  changeEditableEnabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onAutoFocusUsed: PropTypes.func,
  showCorrectness: PropTypes.bool,
  hiddenLabelRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]),
};

export class RawChartAxes extends React.Component {
  static propTypes = {
    bottomScale: PropTypes.func,
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
    showCorrectness: PropTypes.bool,
    hiddenLabelRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]),
  };

  state = { height: 0, width: 0 };

  measureHiddenLabel = () => {
    if (!this.hiddenLabelRef) return;

    const mjx = this.hiddenLabelRef.querySelector('mjx-container');
    const input = this.hiddenLabelRef.querySelector('input');
    const target = mjx || input || this.hiddenLabelRef;
    const rect = target.getBoundingClientRect();
    const height = Math.floor(rect.height);
    const width = Math.floor(rect.width);

    if (height !== this.state.height || width !== this.state.width) {
      this.setState({ height, width });
    }
  };

  // called by the document-level observer on every DOM mutation.
  // only re-measures once mjx-container is present in our hidden label.
  _onDocMutation = () => {
    if (!this.hiddenLabelRef) return;
    if (this.hiddenLabelRef.querySelector('mjx-container')) {
      this.measureHiddenLabel();
    }
  };

  observeHiddenLabel = (el) => {
    if (!el) return;

    const containsLatex = el.querySelector('[data-latex], [data-raw]');

    if (containsLatex) {
      renderMath(el);
    }

    if (el.querySelector('mjx-container') || !containsLatex) {
      this.measureHiddenLabel();
    }
    // always register: if mjx-container isn't there yet, the doc observer will
    // call _onDocMutation when MathJax finishes rendering any element on the page.
    registerMathCallback(this._onDocMutation);
  };

  setHiddenLabelRef = (ref) => {
    if (ref && ref !== this.hiddenLabelRef) {
      this.hiddenLabelRef = ref;
      this.observeHiddenLabel(ref);
    }
  };

  componentDidMount() {
    if (this.hiddenLabelRef) {
      this.observeHiddenLabel(this.hiddenLabelRef);
    }
  }

  componentWillUnmount() {
    unregisterMathCallback(this._onDocMutation);
    if (this._updateTimer) {
      clearTimeout(this._updateTimer);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.categories !== this.props.categories) {
      if (this._updateTimer) clearTimeout(this._updateTimer);
      this._updateTimer = setTimeout(() => this.measureHiddenLabel(), 50);
    }
  }

  render() {
    const {
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
      showCorrectness,
    } = this.props;

    const { scale = {}, range = {}, domain = {}, size = {} } = graphProps || {};
    const { height, width } = this.state;

    const bottomScale = xBand && typeof xBand.rangeRound === 'function' && xBand.rangeRound([0, size.width]);

    const bandWidth = xBand && typeof xBand.bandwidth === 'function' && xBand.bandwidth();
    // for chartType "line", bandWidth will be 0, so we have to calculate it
    const barWidth = bandWidth || (scale.x && scale.x(domain.max) / categories.length);

    const rowTickValues = getTickValues({ ...range, step: range.labelStep });
    const fontSize = theme && theme.typography ? theme.typography.fontSize : 14;
    // this mostly applies for labels that are not editable
    const rotateBecauseOfHeight = getRotateAngle(fontSize, height);
    // this applies for labels that are editable
    const rotateBecauseOfWidth = width > barWidth ? 25 : 0;

    const getTickLabelProps = (value) => ({
      dy: 4,
      dx: -10 - (value.toLocaleString().length || 1) * 5,
    });

    const getTickComponent = (props) => {
      const properties = {
        hiddenLabelRef: this.setHiddenLabelRef,
        categories,
        xBand,
        bandWidth,
        barWidth,
        rotate: rotateBecauseOfHeight || rotateBecauseOfWidth,
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
        showCorrectness,
      };

      return <TickComponent {...properties} />;
    };

    return (
      <StyledAxesGroup>
        {leftAxis && (
          <AxisLeft
            scale={scale.y}
            tickLength={10}
            tickFormat={(value) => value}
            tickValues={rowTickValues}
            tickLabelProps={getTickLabelProps}
          />
        )}
        <AxisBottom
          scale={bottomScale}
          labelProps={{ y: 60 + top }}
          top={scale.y && scale.y(range.min)}
          textLabelProps={() => ({ textAnchor: 'middle' })}
          tickFormat={(count) => count}
          tickComponent={getTickComponent}
          autoFocus={autoFocus}
          onAutoFocusUsed={onAutoFocusUsed}
        />
      </StyledAxesGroup>
    );
  }
}

export default RawChartAxes;
