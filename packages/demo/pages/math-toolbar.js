import { withStyles } from '@material-ui/core';
import React from 'react';

import { MathToolbar } from '@pie-lib/math-toolbar';
import withRoot from '../src/withRoot';

export class Demo extends React.Component {
  render() {
    return <MathToolbar latex={'\\frac{1}{2}'} />;
  }
}

const styles = theme => ({});
const Styled = withStyles(styles)(Demo);
export default withRoot(Styled);
