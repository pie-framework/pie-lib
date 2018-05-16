import React from 'react';
import { PlaceHolder, Choice } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import withRoot from '../src/withRoot';

export class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
      show: true
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="title">Drag</Typography>
        <Divider />
        <PlaceHolder className={classes.grid} grid={{ columns: 3 }}>
          <Choice>foo bar</Choice>
          <Choice>
            <h1>Some Text</h1>
            <p>foo</p>
          </Choice>
          <Choice>
            <img
              width="200"
              src="http://cdn.skim.gs/images/c_fill,dpr_2.0,f_auto,fl_lossy,h_391,q_auto,w_695/fajkx3pdvvt9ax6btssg/20-of-the-cutest-small-dog-breeds-on-the-planet"
            />
          </Choice>
        </PlaceHolder>

        <PlaceHolder
          isOver={true}
          className={classes.grid}
          grid={{ columns: 3 }}
        >
          <Choice>foo bar</Choice>
          <Choice>
            <h1>Some Text</h1>
            <p>foo</p>
          </Choice>
          <Choice>
            <img
              width="200"
              src="http://cdn.skim.gs/images/c_fill,dpr_2.0,f_auto,fl_lossy,h_391,q_auto,w_695/fajkx3pdvvt9ax6btssg/20-of-the-cutest-small-dog-breeds-on-the-planet"
            />
          </Choice>
        </PlaceHolder>
        <PlaceHolder
          disabled={true}
          className={classes.grid}
          grid={{ columns: 3 }}
        >
          <Choice>foo bar</Choice>
          <Choice>
            <h1>Some Text</h1>
            <p>foo</p>
          </Choice>
          <Choice>
            <img
              width="200"
              src="http://cdn.skim.gs/images/c_fill,dpr_2.0,f_auto,fl_lossy,h_391,q_auto,w_695/fajkx3pdvvt9ax6btssg/20-of-the-cutest-small-dog-breeds-on-the-planet"
            />
          </Choice>
        </PlaceHolder>
      </div>
    );
  }
}

export default withRoot(
  withStyles(theme => ({
    root: {
      backgroundColor: 'blue'
    },
    grid: {
      marginTop: theme.spacing.unit
    },
    redLabel: {
      '--correct-answer-toggle-label-color': 'red'
    }
  }))(Wrapper)
);
