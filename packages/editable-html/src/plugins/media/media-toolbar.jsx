import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const useStyles = withStyles(theme => ({
  root: {
    position: 'relative',
    bottom: '5px',
    left: 0,
    width: '100%',
    background: 'white',
    display: 'inline-flex',
    padding: '5px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
  },
  editContainer: {
    cursor: 'pointer',
    flex: 3,
    border: 'solid black',
    textAlign: 'right',
    borderWidth: '0 2px 0 0',
    marginRight: '5px',
    paddingRight: '5px'
  },
  removeContainer: {
    cursor: 'pointer'
  }
}));

class MediaToolbar extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func
  };

  render() {
    const { classes, onEdit, onRemove } = this.props;

    return (
      <span className={classes.root}>
        <span className={classes.editContainer} onClick={onEdit}>
          Edit Settings
        </span>
        <span className={classes.removeContainer} onClick={onRemove}>
          Remove
        </span>
      </span>
    );
  }
}

export default useStyles(MediaToolbar);
