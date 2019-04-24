import React from 'react';
import PropTypes from 'prop-types';
import Mask from './tree/mask';
import componentize from './componentize';
import { deserialize } from './serialization';
import Dropdown from './components/dropdown';

export const buildLayoutFromMarkup = markup => {
  const { ids, markup: processed } = componentize(markup, 'dropdown');
  const value = deserialize(processed);
  return value.document;
};

export default class InlineDropdown extends React.Component {
  static propTypes = {
    markup: PropTypes.string,
    layout: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    choices: PropTypes.object
  };

  renderChildren = (node, data, onChange) => {
    const dataset = node.data ? node.data.dataset || {} : {};
    if (dataset.component === 'dropdown') {
      const { feedback } = this.props;
      return (
        <Dropdown
          key={`${node.type}-dropdown-${dataset.id}`}
          correct={feedback && feedback[dataset.id] && feedback[dataset.id].correct}
          disabled={this.props.disabled}
          value={data[dataset.id]}
          id={dataset.id}
          onChange={onChange}
          choices={this.props.choices[dataset.id]}
        />
      );
    }
  };

  render() {
    const { markup, layout, value, onChange } = this.props;

    const maskLayout = layout ? layout : buildLayoutFromMarkup(markup);

    return (
      <div>
        <Mask
          layout={maskLayout}
          data={value}
          onChange={onChange}
          renderChildren={this.renderChildren}
        />
      </div>
    );
  }
}
