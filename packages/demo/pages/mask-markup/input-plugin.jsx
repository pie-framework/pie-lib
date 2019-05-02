import Input from '@material-ui/core/Input';
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import { Data } from 'slate';

import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import debug from 'debug';

const log = debug('pie-lib:demo:masked-markup');

/**
 * Plugins for masked-markup dont need to trigger any changes the editor's value.
 * Instead the just work with their inital value?
 */
const CompWithState = withStyles(theme => ({
  comp: {
    display: 'inline-block',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
}))(props => {
  const { classes, onChange } = props;

  const [value, setValue] = useState(props.value);

  return (
    <Input
      className={classes.comp}
      variant="outlined"
      value={value}
      onChange={e => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
    />
  );
});

const CompNoState = withStyles(theme => ({
  comp: {
    border: `solid 1px ${theme.palette.primary.main}`
  }
}))(props => {
  const { classes, onChange, value } = props;

  return (
    <Input
      className={classes.comp}
      variant="outlined"
      style={{ display: 'block' }}
      value={value}
      onChange={e => {
        onChange(e.target.value);
      }}
    />
  );
});
export default opts => ({
  name: 'text-input',
  /**
   * renderNode({ key, editor, isFocused, isSelected, node, parent, readOnly, children, attributes }) => ReactNode || Void
   */
  renderNode: props => {
    const { node, key, editor } = props;
    const { data } = node;

    log('[renderNode]: ', node.type, editor);

    if (node.type === 'text-input') {
      log('>>>>>>>>>>>>>>> [renderNode]: ', node.type, editor);
      ///onChange={event => opts.onChange(key, event.target.value, node)}
      return (
        <CompWithState
          value={data.get('value')}
          onChange={v => {
            const n = {
              ...node.toJS(),
              data: { value: event.target.value, id: node.data.get('id') }
            };
            editor.value.change().setNodeByKey(key, n);
            opts.onChange(node.data.get('id'), v);
          }}
        />
      );
    }
  }
});
