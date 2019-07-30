import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Root, createGraphProps } from '@pie-lib/plot';
import ChartGrid from './grid';
import ChartAxes from './axes';
import debug from 'debug';
import { dataToXBand, getDomainAndRangeByChartType, getGridLinesAndAxisByChartType } from './utils';
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
    editCategoryEnabled: PropTypes.bool
  };

  static defaultProps = {};

  state = {
    charts: [
      chartTypes.Bar(),
      chartTypes.Histogram(),
      chartTypes.Line(),
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
    const { onDataChange, data } = this.props;

    onDataChange([
      ...data,
      {
        label: chartType === 'line' ? 'New point' : 'New bar',
        value: range.step,
        deletable: true,
        editable: true,
        interactive: true
      }
    ]);
  };

  getFilteredCategories = () => {
    const { data, editCategoryEnabled } = this.props;

    return data
      ? data.map(d => ({ ...d, editable: editCategoryEnabled, deletable: !d.initial }))
      : [];
  };

  render() {
    const { classes, className, domain, range, size, title, addCategoryEnabled } = this.props;
    let { chartType } = this.props;
    const { width, height } = size;

    const { ChartComponent } = this.getChart();
    const categories = this.getFilteredCategories();
    const correctValues = getDomainAndRangeByChartType(domain, range, chartType);
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

    const maskSize = { x: -10, y: -10, width: width + 20, height: height + 20 };
    const { scale } = common.graphProps;
    const xBand = dataToXBand(scale.x, categories, size.width, chartType);

    if (!ChartComponent) {
      return null;
    }

    return (
      <div className={classNames(classes.class, className)}>
        <div className={classes.controls}>
          <ToolMenu
            disabled={!addCategoryEnabled}
            addCategory={() => this.addCategory(chartType, correctValues.range)}
          />
        </div>
        <Root title={title} classes={classes} rootRef={r => (this.rootNode = r)} {...common}>
          <ChartGrid
            {...common}
            xBand={xBand}
            rowTickValues={horizontalLines}
            columnTickValues={verticalLines}
          />
          <ChartAxes
            {...common}
            categories={categories}
            xBand={xBand}
            leftAxis={leftAxis}
            onChange={this.changeData}
            onChangeCategory={this.changeCategory}
          />
          <mask id="myMask">
            <rect {...maskSize} fill="white" />
          </mask>
          <g id="marks" mask="url('#myMask')">
            <ChartComponent
              {...common}
              data={categories}
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
    backgroundColor: theme.palette.primary.light,
    borderTop: `solid 1px ${theme.palette.primary.dark}`,
    borderBottom: `solid 0px ${theme.palette.primary.dark}`,
    borderLeft: `solid 1px ${theme.palette.primary.dark}`,
    borderRight: `solid 1px ${theme.palette.primary.dark}`
  }
});

export default withStyles(styles)(Chart);
