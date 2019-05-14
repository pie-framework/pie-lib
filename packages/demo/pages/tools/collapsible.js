import withRoot from '../../src/withRoot';
import React from 'react';
import { Collapsible } from '@pie-lib/tools';
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
        <Typography variant="h6">Collapsible</Typography>
        <Collapsible
          content="This is the collapsed content."
          extendTitle="Show Content"
          collapseTitle="Hide Content"
        />
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(withStyles(() => ({}))(Demo));
