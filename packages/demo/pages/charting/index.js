import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import withRoot from '../../src/withRoot';
import Settings from './settings';
import { Chart } from '@pie-lib/charting';
import Options from './options';

const log = debug('pie-lib:charting:graph-lines-demo');

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
        chartType: 'bars',
        title: 'This is a chart',
        domain: {
          label: 'Fruit',
          max: 10,
          min: 1
        },
        range: {
          label: 'Amount',
          max: 5,
          min: 0
        },
        data: [{ label: 'Apples', value: 4 }, { label: 'Grapes', value: 1 }]
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
    log('render..');
    const { classes } = this.props;
    const { model, settings, mounted, tabIndex = 0 } = this.state;
    const charts = [];
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
              charts={charts}
              data={model.data}
              title={model.title}
              onDataChange={this.changeData}
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
