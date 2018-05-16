import React from 'react';
import debug from 'debug';
import ChartingConfig from '@pie-lib/charting-config';
import withRoot from '../../src/withRoot';

const log = debug('demo:charting-config');

const defaultConfig = {
  graphTitle: '',
  graphWidth: 500,
  graphHeight: 500,
  maxPoints: '',
  labelsType: 'present',
  pointLabels: ['A', 'B', 'C', 'D'],
  domainLabel: '',
  domainMin: -10,
  domainMax: 10,
  domainStepValue: 1,
  domainSnapValue: 1,
  domainLabelFrequency: 1,
  domainGraphPadding: 50,
  rangeLabel: '',
  rangeMin: -10,
  rangeMax: 10,
  rangeStepValue: 1,
  rangeSnapValue: 1,
  rangeLabelFrequency: 1,
  rangeGraphPadding: 50,
  sigfigs: -1,
  allowPartialScoring: false,
  pointsMustMatchLabels: false,
  showCoordinates: false,
  showPointLabels: true,
  showInputs: true,
  showAxisLabels: true,
  showFeedback: true
};

class ChartingConfigDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: { ...defaultConfig }
    };

    log('state: ', this.state);
  }

  onChange = newConfig => {
    this.setState({
      config: newConfig
    });
  };

  resetToDefaults = () => {
    this.setState({
      config: { ...defaultConfig }
    });
  }

  render() {
    const { config } = this.state;

    console.log('this.state: ', this.state);

    return <ChartingConfig config={config} onChange={this.onChange} resetToDefaults={this.resetToDefaults} />;
  }
}

export default withRoot(ChartingConfigDemo);
