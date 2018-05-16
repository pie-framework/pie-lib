import * as React from 'react';
import PropTypes from 'prop-types';
import DisplayConfig from './display-config';
import GraphAttributeConfig from './graph-attribute-config';

export default class ChartingConfig extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    resetToDefaults: PropTypes.func.isRequired
  };

  onChange = (name, shouldNotBeNumber, isCheckbox) => event => {
    const { config } = this.props;
    const newValue = parseInt(event.target.value, 10);
    const newConfig = { ...config };

    if (!isNaN(newValue) || shouldNotBeNumber || isCheckbox) {
      newConfig[name] = shouldNotBeNumber
        ? isCheckbox
          ? event.target.checked
          : event.target.value
        : newValue;

      this.props.onChange(newConfig, name);
    }
  };

  render() {
    const { config, resetToDefaults } = this.props;

    return [
      <GraphAttributeConfig
        key="graph-attribute-config"
        config={config}
        onChange={this.onChange}
      />,
      <DisplayConfig
        key="graph-display-config"
        config={config}
        onChange={this.onChange}
        resetToDefaults={resetToDefaults}
      />
    ];
  }
}
