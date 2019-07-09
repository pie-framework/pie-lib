import React from 'react';
import { withStyles } from '@material-ui/core/styles';

export class Eh extends React.Component {
  render() {
    const { value } = this.props;
    return <div dangerouslySetInnerHTML={{ __html: JSON.stringify(value.toJSON()) }}></div>;
  }
}

const styles = theme => ({});
export default withStyles(styles)(Eh);
