import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Root, createGraphProps } from '@pie-lib/plot';
import ChartGrid from './grid';
import ChartAxes from './axes';
import debug from 'debug';
import { dataToXBand, getDomainAndRangeByChartType, getGridLinesAndAxisByChartType } from './utils';

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
    onDataChange: PropTypes.func
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

  render() {
    const { classes, className, domain, range, size, title, data, charts } = this.props;
    let ChartComponent = null;
    let { chartType } = this.props;
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

    const { scale } = common.graphProps;
    const xBand = dataToXBand(scale.x, data || [], size.width, chartType);

    return (
      <div className={classNames(classes.class, className)}>
        <Root title={title} classes={classes} rootRef={r => (this.rootNode = r)} {...common}>
          <ChartGrid
            {...common}
            data={data || []}
            xBand={xBand}
            rowTickValues={horizontalLines}
            columnTickValues={verticalLines}
          />
          <ChartAxes {...common} data={data || []} xBand={xBand} leftAxis={leftAxis} />
          <mask id="myMask">
            <rect {...maskSize} fill="white" />
          </mask>
          <g id="marks" mask="url('#myMask')">
            <ChartComponent {...common} data={data || []} onChange={this.changeData} />
          </g>
        </Root>
      </div>
    );
  }
}

const styles = () => ({
  graphBox: {
    transform: 'translate(70px, 35px)'
  }
});

export default withStyles(styles)(Chart);
