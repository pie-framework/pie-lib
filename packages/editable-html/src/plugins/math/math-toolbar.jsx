import { HorizontalKeypad } from '@pie-lib/math-input';

import React from 'react';
import debug from 'debug';
import SlatePropTypes from 'slate-prop-types';
import PropTypes from 'prop-types';

const log = debug('editable-html:plugins:math:math-toolbar');

const toNodeData = data => {
  if (!data) {
    return;
  }

  const { type, value } = data;

  if (type === 'command' || type === 'cursor') {
    return data;
  } else if (value === 'clear') {
    return { type: 'clear' };
  } else {
    return { type: 'write', value };
  }
};

export default class MathToolbar extends React.Component {
  static propTypes = {
    node: SlatePropTypes.node.isRequired,
    value: SlatePropTypes.value.isRequired,
    onChange: PropTypes.func.isRequired
  };

  onClick = data => {
    const { node, value, onChange } = this.props;

    const mathChange = toNodeData(data);

    if (mathChange) {
      const update = { ...node.data.toObject(), change: mathChange };

      log('[send change to node: ', node.key, update);
      const change = value.change().setNodeByKey(node.key, { data: update });
      onChange(change);
    }
  };

  render() {
    return <HorizontalKeypad onClick={this.onClick} />;
  }
}
