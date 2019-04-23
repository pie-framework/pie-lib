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
    const component = node.data ? node.data.component : undefined;
    if (component === 'dropdown') {
      return (
        <Dropdown
          disabled={this.props.disabled}
          value={data[node.data.id]}
          id={node.data.id}
          onChange={onChange}
          choices={this.props.choices[node.data.id]}
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
