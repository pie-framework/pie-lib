import Input from '@mui/material/Input';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

import debug from 'debug';

const log = debug('pie-lib:demo:masked-markup');

/**
 * Plugins for masked-markup dont need to trigger any changes the editor's value.
 * Instead the just work with their inital value?
 */
const StyledInputWithState = styled(Input)(({ theme }) => ({
  display: 'inline-block',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const CompWithState = (props) => {
  const { onChange } = props;

  const [value, setValue] = useState(props.value);

  return (
    <StyledInputWithState
      variant="outlined"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
    />
  );
};

const StyledInputNoState = styled(Input)(({ theme }) => ({
  border: `solid 1px ${theme.palette.primary.main}`,
  display: 'block',
}));

const CompNoState = (props) => {
  const { onChange, value } = props;

  return (
    <StyledInputNoState
      variant="outlined"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
};
export default (opts) => ({
  name: 'text-input',
  /**
   * renderNode({ key, editor, isFocused, isSelected, node, parent, readOnly, children, attributes }) => ReactNode || Void
   */
  renderNode: (props) => {
    const { node, key, editor } = props;
    const { data } = node;

    log('[renderNode]: ', node.type, editor);

    if (node.type === 'text-input') {
      log('>>>>>>>>>>>>>>> [renderNode]: ', node.type, editor);
      ///onChange={event => opts.onChange(key, event.target.value, node)}
      return (
        <CompWithState
          value={data.get('value')}
          onChange={(v) => {
            const n = {
              ...node.toJS(),
              data: { value: event.target.value, id: node.data.get('id') },
            };
            editor.value.change().setNodeByKey(key, n);
            opts.onChange(node.data.get('id'), v);
          }}
        />
      );
    }
  },
});
