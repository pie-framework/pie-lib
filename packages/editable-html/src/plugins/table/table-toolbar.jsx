import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '../toolbar/toolbar-buttons';
import { DoneButton } from '../toolbar/done-button';

import {
  AddRow,
  AddColumn,
  RemoveColumn,
  RemoveRow,
  RemoveTable
} from './icons';
import PropTypes from 'prop-types';

export class TableToolbar extends React.Component {
  static propTypes = {
    onAddRow: PropTypes.func.isRequired,
    onRemoveRow: PropTypes.func.isRequired,
    onAddColumn: PropTypes.func.isRequired,
    onRemoveColumn: PropTypes.func.isRequired,
    onRemoveTable: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  onDone = e => {
    const { onDone } = this.props;
    e.preventDefault();
    onDone();
  };

  render() {
    const {
      onAddRow,
      onRemoveRow,
      onAddColumn,
      onRemoveColumn,
      onRemoveTable,
      classes
    } = this.props;
    return (
      <div className={classes.tableToolbar}>
        <div>
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
  }
});
export default withStyles(styles)(TableToolbar);
