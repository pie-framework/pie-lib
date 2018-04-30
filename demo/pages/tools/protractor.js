import withRoot from '../../src/withRoot';
import React from 'react';
import { Protractor } from '@pie-lib/tools';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { Typography } from 'material-ui';

class Demo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted } = this.state;
    return mounted ? (
      <div>
        <Typography variant="title">Protractor</Typography>
        <Protractor />
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(withStyles(() => ({}))(Demo));
