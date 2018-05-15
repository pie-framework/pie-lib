import * as React from 'react';
import PropTypes from 'prop-types';
import DisplayConfig from './display-config';
import GraphAttributeConfig from './graph-attribute-config';

export default class ChartingConfig extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    onGridParameterChange: PropTypes.func.isRequired,
    onModelConfigAttributeChange: PropTypes.func.isRequired,
    resetToDefaults: PropTypes.func.isRequired
  }

  render() {
    const { config, onGridParameterChange, onModelConfigAttributeChange, resetToDefaults } = this.props;

    return [
      <GraphAttributeConfig
        key="graph-attribute-config"
        config={config}
        onGridParameterChange={onGridParameterChange}
        onModelConfigAttributeChange={onModelConfigAttributeChange}
      />,
      <DisplayConfig
        key="graph-display-config"
        config={config}
        onModelConfigAttributeChange={onModelConfigAttributeChange}
        resetToDefaults={resetToDefaults}
    />
    ];
  }
}
