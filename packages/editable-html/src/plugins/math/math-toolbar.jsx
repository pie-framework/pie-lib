import { HorizontalKeypad, MathQuillInput, addBrackets, removeBrackets } from '@pie-lib/math-input';

import { Data } from 'slate';
import React from 'react';
import debug from 'debug';

const log = debug('editable-html:plugins:math:math-toolbar');

const toNodeData = (data) => {

  if (!data) {
    return;
  }

  const { type, value } = data;

  if (type === 'command' || type === 'cursor') {
    return data;
  } else if (value === 'clear') {
    return { type: 'clear' }
  } else {
    return { type: 'write', value }
  }
}

export default class MathToolbar extends React.Component {

  onClick = (data) => {
    const { node, value, onChange } = this.props;

    const mathChange = toNodeData(data);

    if (mathChange) {
      const update = { ...node.data.toObject(), change: mathChange }

      log('[send change to node: ', node.key, update);
      const change = value.change().setNodeByKey(node.key,
        { data: update });
      onChange(change);
    }
  }

  render() {
    const { data } = this.props.node;
    return <HorizontalKeypad onClick={this.onClick} />;
  }
}

