import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import withRoot from '../../src/withRoot';
import Settings from './settings';
import { Chart, chartTypes } from '@pie-lib/charting';
import Options from './options';

const log = debug('pie-lib:charting:graph-lines-demo');

const createCategory = (label, value) => ({
  label,
  value,
  initial: true,
  interactive: true,
  editable: true,
  deletable: true
});

export class ChartDemo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      settings: {
        size: {
          width: 600,
          height: 600
        }
      },
      model: {
        chartType: 'linePlot',
        title: 'This is a chart!',
        domain: {
          label: 'Fruits',
          axisLabel: 'X'
        },
        range: {
          label: 'Amount',
          max: 5.5,
          min: 0,
          labelStep: 1,
          axisLabel: 'Y'
        },
        data: [
          { ...createCategory('Apples', 5), interactive: false },
          createCategory('Grapes', 3),
          createCategory('Lemons', 0),
          createCategory('Plums', 2),
          createCategory('Peaches', 1),
          createCategory('Melons', 4)
        ],
        charts: [
          chartTypes.Bar(),
          chartTypes.Histogram(),
          chartTypes.LineDot(),
          chartTypes.LineCross(),
          chartTypes.DotPlot(),
          chartTypes.LinePlot()
        ],
        editCategoryEnabled: true,
        addCategoryEnabled: true,
        categoryDefaultLabel: 'Category'
      }
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  change = model => {
    log('[change] model:', model);
    this.setState({ model });
  };

  changeTab = (event, tabIndex) => {
    this.setState({ indexTab: tabIndex });
  };

  changeData = data => {
    const model = { ...this.state.model, data };
    this.setState({ model });
  };

  render() {
    const { classes } = this.props;
    const { model, settings, mounted } = this.state;

    log('settings:', settings);

    return mounted ? (
      <div>
        <div className={classes.demo}>
          <div>
            <Settings model={settings} onChange={settings => this.setState({ settings })} />
            <Options model={model} onChange={this.change} />
          </div>
          <div>
            <Chart
              chartType={model.chartType}
              size={settings.size}
              domain={model.domain}
              range={model.range}
              charts={model.charts}
              data={model.data}
              title={model.title}
              onDataChange={this.changeData}
              editCategoryEnabled={model.editCategoryEnabled}
              addCategoryEnabled={model.addCategoryEnabled}
              categoryDefaultLabel={model.categoryDefaultLabel}
            />
          </div>
        </div>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const styles = {
  demo: {
    width: '100%',
    display: 'flex'
  }
};

export const Styled = withStyles(styles)(ChartDemo);
const Demo = () => <Styled />;
export default withRoot(Demo);
