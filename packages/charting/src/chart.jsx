import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Root, createGraphProps } from '@pie-lib/plot';
import ChartGrid from './grid';
import ChartAxes from './axes';
import { Bars } from './bars';
import debug from 'debug';

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
    data: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })
    ),
    range: PropTypes.shape({}),
    charts: PropTypes.array,
    title: PropTypes.string,
    onDataChange: PropTypes.func
  };
  static defaultProps = {};

  getChartComponent = () => {
    const { chartType, charts } = this.props;
    log('chartType: ', chartType, charts);
    //TODO: chart components should be pluggable - for now just use Bars;
    return Bars;
  };

  changeData = data => {
    const { onDataChange } = this.props;
    onDataChange(data);
  };

  render() {
    const { classes, className, size, domain, range, title, data } = this.props;

    const ChartComponent = this.getChartComponent();

    const common = { graphProps: createGraphProps(domain, range, size) };
    log('[render] common:', common);
    return (
      <div className={classNames(classes.class, className)}>
        <Root title={title} {...common}>
          <ChartGrid data={data} {...common} />
          <ChartAxes data={data} {...common} />
          <ChartComponent data={data} onChange={this.changeData} {...common} />
        </Root>
      </div>
    );
  }
}

const styles = theme => ({
  class: {}
});

export default withStyles(styles)(Chart);
