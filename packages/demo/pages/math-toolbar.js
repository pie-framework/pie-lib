import { withStyles } from '@material-ui/core';
import React from 'react';

import { MathToolbar } from '@pie-lib/math-toolbar';
import withRoot from '../src/withRoot';

export class Demo extends React.Component {
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
    const { mounted } = this.state;
    return mounted ? (
      <MathToolbar latex={'\\frac{1}{2}'} />
    ) : (
      <div>loading</div>
    );
  }
}

const styles = theme => ({});
const Styled = withStyles(styles)(Demo);
export default withRoot(Styled);
