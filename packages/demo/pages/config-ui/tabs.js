import { Tabs } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../src/withRoot';

// eslint-disable-next-line
const log = debug('demo:config-ui');

class RawContainer extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { classes } = this.props;
    const { mounted } = this.state;
    return mounted ? (
      <div className={classes.root}>
        <Typography>Tabs - just add a title to the child node</Typography>
        <Tabs indicatorColor="primary">
          <div title="One" className={classes.tabContent}>
            foo
          </div>
          <div title="Two" className={classes.tabContent}>
            two
          </div>
        </Tabs>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const Container = withStyles(theme => ({
  root: {},
  tabContent: {
    padding: theme.spacing.unit
  },
  left: {
    flex: 1
  },
  code: {
    position: 'fixed'
  },
  right: {
    flex: 0.3
  },
  smallTextField: {
    width: '100px'
  }
}))(RawContainer);

export default withRoot(Container);
