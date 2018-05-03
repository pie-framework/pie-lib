import { TokenSelect } from '@pie-lib/text-select';
import withRoot from '../src/withRoot';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

class Demo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  static defaultProps = {};

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.demo}>
        <TokenSelect />
      </div>
    );
  }
}

const StyledDemo = withStyles(theme => ({
  demo: {
    backgroundColor: 'red'
  }
}))(Demo);
export default withRoot(StyledDemo);
