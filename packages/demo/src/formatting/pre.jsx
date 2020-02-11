import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
export class Pre extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    value: PropTypes.any
  };
  static defaultProps = {};
  render() {
    const { classes, className, value } = this.props;
    return (
      <pre className={classNames(classes.class, className)}>
        {JSON.stringify(value, null, '  ')}
      </pre>
    );
  }
}
const styles = () => ({
  class: {}
});
export default withStyles(styles)(Pre);
