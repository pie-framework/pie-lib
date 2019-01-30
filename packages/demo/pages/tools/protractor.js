import withRoot from '../../src/withRoot';
import React from 'react';
import { Protractor } from '@pie-lib/tools';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

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
        <Typography variant="h6">Protractor</Typography>
        <Protractor />

        <div style={{ width: '400px' }}>
          <svg viewBox="0 0 100 100">
            <path d="M 0,0 l 50,50 l 50,-50  l 0,0 z" fill="lightgreen" />
          </svg>
        </div>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(withStyles(() => ({}))(Demo));
