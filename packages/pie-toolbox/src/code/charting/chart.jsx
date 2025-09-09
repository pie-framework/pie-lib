import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import debug from 'debug';
import cloneDeep from 'lodash/cloneDeep';

import { Root, createGraphProps } from '../plot';
import { AlertDialog } from '../config-ui';
import Translator from '../translator';
import ChartGrid from './grid';
import ChartAxes from './axes';
import { dataToXBand, getDomainAndRangeByChartType, getGridLinesAndAxisByChartType, getTopPadding } from './utils';
import chartTypes from './chart-types';
import ActionsButton from './actions-button';

const { translator } = Translator;

const log = debug('pie-lib:charts:chart');

export class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: {
        open: false,
      },
      actionsAnchorEl: null,
    };
    this.maskUid = this.generateMaskId();
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    chartType: PropTypes.string.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    domain: PropTypes.shape({
      label: PropTypes.string,
      min: PropTypes.number,
      max: PropTypes.number,
      axisLabel: PropTypes.string,
    }),
    data: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })),
    range: PropTypes.shape({
      label: PropTypes.string,
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number,
      labelStep: PropTypes.number,
      axisLabel: PropTypes.string,
    }),
    charts: PropTypes.array,
    labelsPlaceholders: PropTypes.object,
    title: PropTypes.string,
    titlePlaceholder: PropTypes.string,
    onDataChange: PropTypes.func,
    onChangeLabels: PropTypes.func,
    onChangeTitle: PropTypes.func,
    error: PropTypes.any,
    addCategoryEnabled: PropTypes.bool,
    showPixelGuides: PropTypes.bool,
    categoryDefaultLabel: PropTypes.string,
    categoryDefaults: PropTypes.object,
    defineChart: PropTypes.bool,
    theme: PropTypes.object,
    chartingOptions: PropTypes.object,
    changeInteractiveEnabled: PropTypes.bool,
    changeEditableEnabled: PropTypes.bool,
    language: PropTypes.string,
    mathMlOptions: PropTypes.object,
    labelsCharactersLimit: PropTypes.number,
    correctData: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.number,
      }),
    ),
  };

  static defaultProps = {
    size: {
      width: 480,
      height: 480,
    },
  };

  state = {
    charts: [
      chartTypes.Bar(),
      chartTypes.Histogram(),
      chartTypes.LineDot(),
      chartTypes.LineCross(),
      chartTypes.DotPlot(),
      chartTypes.LinePlot(),
    ],
    autoFocus: false,
  };

  generateMaskId() {
    return 'chart-' + (Math.random() * 10000).toFixed();
  }

  handleAlertDialog = (open, callback) =>
    this.setState(
      {
        dialog: { open },
      },
      callback,
    );

  getChart = () => {
    const charts = this.props.charts || this.state.charts;
    let { chartType } = this.props;
    let ChartComponent = null;
    let chart = null;

    if (chartType) {
      chart = charts && charts.find((chart) => chart.type === chartType);
      ChartComponent = chart && chart.Component;
    } else {
      chart = charts && charts[0];
      ChartComponent = chart && chart.Component;
      chartType = chart && chart.type;
    }

    return {
      type: chartType,
      ChartComponent,
    };
  };

  changeData = (data) => {
    const { onDataChange } = this.props;

    onDataChange(data);
  };

  changeCategory = (index, newCategory) => {
    const integerIndex = parseInt(index, 10);

    if (integerIndex >= 0) {
      const { data, onDataChange } = this.props;
      data[integerIndex] = {
        ...data[integerIndex],
        ...newCategory,
      };

      onDataChange(data);
    }
  };

  addCategory = () => {
    const { onDataChange, data, categoryDefaultLabel, defineChart, categoryDefaults, language } = this.props;

    if ((data || []).length > 19) {
      this.setState({
        dialog: {
          open: true,
          title: translator.t('common:warning', { lng: language }),
          text: translator.t('charting.reachedLimit_other', { count: 20, lng: language }),
          onConfirm: () => this.handleAlertDialog(false),
        },
      });
    } else {
      this.setState({ autoFocus: true });
      onDataChange([
        ...data,
        {
          inDefineChart: defineChart,
          label: categoryDefaultLabel || translator.t('charting.newLabel', { lng: language }),
          value: 0,
          deletable: true,
          editable: categoryDefaults ? categoryDefaults?.editable : true,
          interactive: categoryDefaults ? categoryDefaults?.interactive : true,
        },
      ]);
    }
  };

  deleteCategory = (index) => {
    const { data, onDataChange } = this.props;

    if (typeof index !== 'number' || index < 0) {
      return;
    }

    if (data && data.length > 0) {
      onDataChange(data.filter((_, i) => i !== index));
    }
  };

  getFilteredCategories = () => {
    const { data, defineChart } = this.props;

    return data
      ? data.map((d) => ({
          ...d,
          deletable: defineChart || d.deletable,
        }))
      : [];
  };

  resetAutoFocus = () => {
    this.setState({ autoFocus: false });
  };

  render() {
    const {
      classes,
      className,
      domain = {},
      range = {},
      chartingOptions,
      size,
      title,
      onChangeTitle,
      onChangeLabels,
      labelsPlaceholders,
      titlePlaceholder,
      addCategoryEnabled,
      changeInteractiveEnabled,
      changeEditableEnabled,
      showPixelGuides,
      error,
      mathMlOptions = {},
      language,
      labelsCharactersLimit,
      correctData,
    } = this.props;
    let { chartType } = this.props;

    const { dialog } = this.state;
    const defineChart = this.props.defineChart || false;

    const { width, height } = size || {};
    const labels = { left: range?.label || '', bottom: domain?.label || '' };

    const { ChartComponent } = this.getChart();
    const categories = this.getFilteredCategories();

    const correctValues = getDomainAndRangeByChartType(domain, range, chartType);

    const { verticalLines, horizontalLines, leftAxis } = getGridLinesAndAxisByChartType(correctValues.range, chartType);
    const common = {
      graphProps: createGraphProps(correctValues.domain, correctValues.range, size, () => this.rootNode),
    };

    log('[render] common:', common);

    const maskSize = { x: -10, y: -75, width: width + 20, height: height + 130 };
    const { scale } = common.graphProps;
    const xBand = dataToXBand(scale.x, categories, width, chartType);

    if (!ChartComponent) {
      return null;
    }

    const bandWidth = xBand.bandwidth();
    // for chartType "line", bandWidth will be 0, so we have to calculate it
    const barWidth = bandWidth || scale.x(correctValues.domain.max) / categories.length;
    const increaseHeight = defineChart ? 160 : 60;

    // if there are many categories, we have to rotate their names in order to fit
    // and we have to add extra value on top of some items
    const top = getTopPadding(barWidth);
    const rootCommon = cloneDeep(common);
    rootCommon.graphProps.size.height += top + increaseHeight;

    return (
      <div className={classNames(classes.chart, classes.chartBox, className)}>
        <Root
          title={title}
          onChangeTitle={onChangeTitle}
          disabledTitle={!defineChart}
          showTitle={true}
          showLabels={true}
          labels={labels}
          onChangeLabels={onChangeLabels}
          labelsPlaceholders={labelsPlaceholders}
          titlePlaceholder={titlePlaceholder}
          defineChart={defineChart}
          disabledLabels={!defineChart}
          isChart={true}
          showPixelGuides={showPixelGuides}
          rootRef={(r) => (this.rootNode = r)}
          mathMlOptions={mathMlOptions}
          labelsCharactersLimit={labelsCharactersLimit}
          {...rootCommon}
        >
          <ChartGrid {...common} xBand={xBand} rowTickValues={horizontalLines} columnTickValues={verticalLines} />
          <ChartAxes
            autoFocus={this.state.autoFocus}
            onAutoFocusUsed={this.resetAutoFocus}
            {...common}
            defineChart={defineChart}
            categories={categories}
            xBand={xBand}
            leftAxis={leftAxis}
            onChange={this.changeData}
            onChangeCategory={this.changeCategory}
            chartingOptions={chartingOptions}
            changeInteractiveEnabled={changeInteractiveEnabled}
            changeEditableEnabled={changeEditableEnabled}
            top={top}
            error={error}
            showCorrectness={chartType === 'linePlot' || chartType === 'dotPlot'}
          />
          {addCategoryEnabled ? (
            <foreignObject x={width} y={height - 16} width={width} height={height}>
              <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <ActionsButton
                  categories={categories}
                  addCategory={this.addCategory}
                  deleteCategory={this.deleteCategory}
                  language={language}
                />
              </div>
            </foreignObject>
          ) : null}
          <mask id={`${this.maskUid}`}>
            <rect {...maskSize} fill="white" />
          </mask>
          <g id="marks" mask={`url('#${this.maskUid}')`}>
            <ChartComponent
              {...common}
              data={categories}
              height={rootCommon.graphProps.size.height}
              defineChart={defineChart}
              onChange={this.changeData}
              onChangeCategory={this.changeCategory}
              correctData={correctData}
            />
          </g>
        </Root>
        <AlertDialog
          open={dialog.open}
          title={dialog.title}
          text={dialog.text}
          onClose={dialog.onClose}
          onConfirm={dialog.onConfirm}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  graphBox: {
    transform: 'translate(60px, 35px)',
  },
  svg: {
    overflow: 'visible',
  },

  chartBox: {
    width: 'min-content',
  },
});

export default withStyles(styles, { withTheme: true })(Chart);
