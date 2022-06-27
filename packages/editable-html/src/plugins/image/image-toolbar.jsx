import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';

const log = debug('@pie-lib:editable-html:plugins:image:image-toolbar');

export class ImageToolbar extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  render() {
    // Don't remove toolbar since we will have other new buttons
    const { classes } = this.props;
    return (
      <div className={classes.holder}>
      </div>
    );
  }
}

const styles = theme => ({
  holder: {
    paddingLeft: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center'
  }
});

export default withStyles(styles)(ImageToolbar);
