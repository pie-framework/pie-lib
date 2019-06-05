import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '../toolbar/toolbar-buttons';
import { DoneButton } from '../toolbar/done-button';
import BorderAll from '@material-ui/icons/BorderAll';
import { ToolbarButton } from '../toolbar/default-toolbar';

import { AddRow, AddColumn, RemoveColumn, RemoveRow, RemoveTable } from './icons';
import PropTypes from 'prop-types';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:plugins:table-toolbar');

export class TableToolbar extends React.Component {
  static propTypes = {
    plugins: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onAddRow: PropTypes.func.isRequired,
    onRemoveRow: PropTypes.func.isRequired,
    onAddColumn: PropTypes.func.isRequired,
    onRemoveColumn: PropTypes.func.isRequired,
    onRemoveTable: PropTypes.func.isRequired,
    onToggleBorder: PropTypes.func.isRequired,
    hasBorder: PropTypes.bool,
    onDone: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  static defaultProps = {
    plugins: [],
    value: {},
    onChange: () => {}
  };

  onDone = e => {
    const { onDone } = this.props;
    e.preventDefault();
    onDone();
  };

  render() {
    const {
      plugins,
      value,
      onChange,
      onAddRow,
      onRemoveRow,
      onAddColumn,
      onRemoveColumn,
      onRemoveTable,
      onToggleBorder,
      hasBorder,
      classes
    } = this.props;
    log('[render] hasBorder:', hasBorder);

    return (
      <div className={classes.tableToolbar}>
        <div className={classes.toolbarButtons}>
          <Button onClick={onAddRow}>
            <AddRow />
          </Button>
          <Button onClick={onRemoveRow}>
            <RemoveRow />
          </Button>
          <Button onClick={onAddColumn}>
            <AddColumn />
          </Button>
          <Button onClick={onRemoveColumn}>
            <RemoveColumn />
          </Button>
          <Button onClick={onRemoveTable}>
            <RemoveTable />
          </Button>
          {plugins.map((p, index) => (
            <ToolbarButton
              key={`plugin-${index}`}
              {...p.toolbar}
              value={value}
              onChange={onChange}
            />
          ))}
          <Button onClick={onToggleBorder} active={hasBorder}>
            <BorderAll />
          </Button>
        </div>
        <DoneButton onClick={this.onDone} />
      </div>
    );
  }
}

const styles = () => ({
  tableToolbar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  toolbarButtons: {
    display: 'flex'
  }
});
export default withStyles(styles)(TableToolbar);
