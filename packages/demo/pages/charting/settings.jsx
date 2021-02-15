import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { DisplaySize } from '@pie-lib/config-ui';
import grey from '@material-ui/core/colors/grey';

export class Settings extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    model: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };
  static defaultProps = {};

  updateSize = size => {
    const { model, onChange } = this.props;
    onChange({ ...model, size });
  };

  render() {
    const { model, classes, className } = this.props;
    return (
      <div className={classNames(classes.settings, className)}>
        {/* <DisplaySize label={'Chart Display Size'} size={model.size} onChange={this.updateSize} />*/}
      </div>
    );
  }
}

const styles = theme => ({
  settings: {
    padding: theme.spacing.unit,
    background: grey[100],
    border: `solid 1px ${grey[300]}`
  }
});

export default withStyles(styles)(Settings);
