import React from 'react';
import PropTypes from 'prop-types';
import Mask from './tree/mask';
import componentize from './componentize';
import { deserialize } from './serialization';
import Input from './components/input';

export const buildLayoutFromMarkup = markup => {
  const { ids, markup: processed } = componentize(markup, 'input');
  const value = deserialize(processed);
  return value.document;
};

export default class ConstructedResponse extends React.Component {
  static propTypes = {
    markup: PropTypes.string,
    layout: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
  };

  renderChildren = (node, data, onChange) => {
    const component = node.data ? node.data.component : undefined;
    if (component === 'input') {
      return (
        <Input
          disabled={this.props.disabled}
          value={data[node.data.id]}
          id={node.data.id}
          onChange={onChange}
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
