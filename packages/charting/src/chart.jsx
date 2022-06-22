import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Root, createGraphProps } from '@pie-lib/plot';
import cloneDeep from 'lodash/cloneDeep';
import ChartGrid from './grid';
import ChartAxes from './axes';
import debug from 'debug';
import { color } from '@pie-lib/render-ui';
import {
  dataToXBand,
  getDomainAndRangeByChartType,
  getGridLinesAndAxisByChartType,
  getTopPadding
} from './utils';
import ToolMenu from './tool-menu';
import chartTypes from './chart-types';

const log = debug('pie-lib:charts:chart');

export class Chart extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    chartType: PropTypes.string.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    }),
    domain: PropTypes.shape({
      label: PropTypes.string,
      min: PropTypes.number,
      max: PropTypes.number,
      axisLabel: PropTypes.string
    }),
    data: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })),
    range: PropTypes.shape({
      label: PropTypes.string,
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number,
      labelStep: PropTypes.number,
      axisLabel: PropTypes.string
    }),
    charts: PropTypes.array,
    title: PropTypes.string,
    onDataChange: PropTypes.func,
    addCategoryEnabled: PropTypes.bool,
    categoryDefaultLabel: PropTypes.string,
    theme: PropTypes.object
  };

  static defaultProps = {
    size: {
      width: 480,
      height: 480
    }
  };

  state = {
    charts: [
      chartTypes.Bar(),
      chartTypes.Histogram(),
      chartTypes.LineDot(),
      chartTypes.LineCross(),
      chartTypes.DotPlot(),
      chartTypes.LinePlot()
    ]
  };

  getChart = () => {
    const charts = this.props.charts || this.state.charts;
    let { chartType } = this.props;
    let ChartComponent = null;
    let chart = null;

    if (chartType) {
      chart = charts && charts.find(chart => chart.type === chartType);
      ChartComponent = chart && chart.Component;
    } else {
      chart = charts && charts[0];
      ChartComponent = chart && chart.Component;
      chartType = chart && chart.type;
    }

    return {
      type: chartType,
      ChartComponent
    };
  };

  changeData = data => {
    const { onDataChange } = this.props;

    onDataChange(data);
  };

  changeCategory = (index, newCategory) => {
    const integerIndex = parseInt(index, 10);

    if (integerIndex >= 0) {
      const { data, onDataChange } = this.props;
      data[integerIndex] = {
        ...data[integerIndex],
        ...newCategory
      };

      onDataChange(data);
    }
  };

  addCategory = (chartType, range) => {
    const { onDataChange, data, categoryDefaultLabel } = this.props;

    onDataChange([
      ...data,
      {
        label: categoryDefaultLabel || 'New Bar',
        value: range.step,
        deletable: true,
        editable: true,
        interactive: true
      }
    ]);
  };

  getFilteredCategories = () => {
    const { data, defineChart } = this.props;

    return data
      ? data.map(d => ({
          ...d,
          deletable: defineChart || d.deletable
        }))
      : [];
  };

  render() {
    const {
      classes,
      className,
      domain,
      range,
      size,
      title,
      addCategoryEnabled,
      theme
    } = this.props;
    let { chartType } = this.props;

    const defineChart = this.props.defineChart || false;
    const { width, height } = size || {};

    const { ChartComponent } = this.getChart();
    const categories = this.getFilteredCategories();

    const labelFontSize = (theme && theme.typography && theme.typography.fontSize) || 14;
    const correctValues = getDomainAndRangeByChartType(
      domain,
      range,
      size,
      chartType,
      labelFontSize
    );

    const { verticalLines, horizontalLines, leftAxis } = getGridLinesAndAxisByChartType(
      correctValues.range,
      chartType
    );
    const common = {
      graphProps: createGraphProps(
        correctValues.domain,
        correctValues.range,
        size,
        () => this.rootNode
      )
    };

    log('[render] common:', common);

    const maskSize = { x: -10, y: -10, width: width + 20, height: height + 80 };
    const { scale } = common.graphProps;
    const xBand = dataToXBand(scale.x, categories, width, chartType);

    if (!ChartComponent) {
      return null;
    }

    const bandWidth = xBand.bandwidth();
    // for chartType "line", bandWidth will be 0, so we have to calculate it
    const barWidth = bandWidth || scale.x(correctValues.domain.max) / categories.length;
    const increaseHeight = defineChart ? 80 : 0;

    // if there are many categories, we have to rotate their names in order to fit
    // and we have to add extra value on top of some items
    const top = getTopPadding(barWidth);
    const rootCommon = cloneDeep(common);
    rootCommon.graphProps.size.height += top + increaseHeight;

    return (
      <div className={classNames(classes.class, className)}>
        <div className={classes.controls}>
          <ToolMenu
            className={classes.toolMenu}
            disabled={!addCategoryEnabled}
            addCategory={() => this.addCategory(chartType, correctValues.range)}
          />
        </div>
        <Root title={title} classes={classes} rootRef={r => (this.rootNode = r)} {...rootCommon}>
          <ChartGrid
            {...common}
            xBand={xBand}
            rowTickValues={horizontalLines}
            columnTickValues={verticalLines}
          />
          <ChartAxes
            {...common}
            defineChart={defineChart}
            categories={categories}
            xBand={xBand}
            leftAxis={leftAxis}
            onChange={this.changeData}
            onChangeCategory={this.changeCategory}
            top={top}
          />
          <mask id="myMask">
            <rect {...maskSize} fill="white" />
          </mask>
          <g id="marks" mask="url('#myMask')">
            <ChartComponent
              {...common}
              data={categories}
              defineChart={defineChart}
              onChange={this.changeData}
              onChangeCategory={this.changeCategory}
            />
          </g>
        </Root>
      </div>
    );
  }
}

const styles = theme => ({
  graphBox: {
    transform: 'translate(60px, 35px)'
  },
  controls: {
    width: 'inherit',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit,
    backgroundColor: color.primaryLight(),
    borderTop: `solid 1px ${color.primaryDark()}`,
    borderBottom: `solid 0px ${color.primaryDark()}`,
    borderLeft: `solid 1px ${color.primaryDark()}`,
    borderRight: `solid 1px ${color.primaryDark()}`
  },
  root: {
    overflow: 'hidden'
  },
  svg: {
    overflow: 'visible'
  },
  toolMenu: {
    minHeight: '36px'
  }
});

export default withStyles(styles, { withTheme: true })(Chart);
