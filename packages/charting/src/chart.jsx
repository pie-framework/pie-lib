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
      max: PropTypes.number
    }),
    data: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })),
    range: PropTypes.shape({
      label: PropTypes.string,
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number
    }),
    charts: PropTypes.array,
    title: PropTypes.string,
    onDataChange: PropTypes.func,
    addCategoryDisabled: PropTypes.bool
  };

  static defaultProps = {};

  getChart = () => {
    const { chartType, charts } = this.props;
    log('chartType: ', chartType);

    return charts && charts.find(chart => chart.type === chartType);
  };

  changeData = data => {
    const { onDataChange } = this.props;

    onDataChange(data);
  };

  changeCategory = (index, newCategory) => {
    const integerIndex = parseInt(index, 10);

    if (integerIndex >= 0) {
      const { data, onDataChange } = this.props;
      const newData = [
        ...data.slice(0, integerIndex),
        {
          ...data[integerIndex],
          ...newCategory
        },
        ...data.slice(integerIndex + 1)
      ];

      onDataChange(newData);
    }
  };

  addCategory = (chartType, range) => {
    const { onDataChange, data } = this.props;

    onDataChange([
      ...data,
      {
        label: chartType === 'line' ? 'New point name' : 'New bar',
        value: range.step,
        deletable: true,
        editable: true,
        interactive: true
      }
    ]);
  };

  render() {
    const {
      classes,
      className,
      domain,
      range,
      size,
      title,
      data,
      charts,
      addCategoryDisabled
    } = this.props;
    let { chartType } = this.props;
    let ChartComponent = null;
    let chart = null;

    if (chartType) {
      chart = this.getChart();
      ChartComponent = chart && chart.Component;
    } else {
      chart = charts && charts[0];
      ChartComponent = chart && chart.Component;
      chartType = chart && chart.type;
    }

    const { verticalLines, horizontalLines, leftAxis } = getGridLinesAndAxisByChartType(
      range,
      chartType
    );
    const correctValues = getDomainAndRangeByChartType(domain, range, chartType);
    const common = {
      graphProps: createGraphProps(
        correctValues.domain,
        correctValues.range,
        size,
        () => this.rootNode
      )
    };
    log('[render] common:', common);

    const maskSize = {
      x: -10,
      y: -10,
      width: size.width + 20,
      height: size.height + 20
    };
    const categories = data || [];

    const { scale } = common.graphProps;
    const xBand = dataToXBand(scale.x, categories, size.width, chartType);

    return (
      <div className={classNames(classes.class, className)}>
        <div className={classes.controls}>
          <ToolMenu
            disabled={addCategoryDisabled}
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
    transform: 'translate(70px, 35px)'
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
