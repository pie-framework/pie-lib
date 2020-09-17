import withRoot from '../../src/withRoot';
import React from 'react';
import { Ruler } from '@pie-lib/tools';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';

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
    // const { classes } = this.props;
    const { mounted } = this.state;
    return mounted ? (
      <div>
        <Typography variant="h6">Ruler</Typography>
        <Typography variant="body2">Default ruler is 12in imperial @ 40px per inch</Typography>
        <Ruler />
        <br />
        <br />
        <Typography variant="body2">You can set it to Metric - 10cm @ 48px per cm</Typography>
        <Ruler width={480} measure={'metric'} units={6} />
        <br />
        <br />
        <Typography variant="body2">Or you can change the units for 6in @ 60px per inch</Typography>
        <Ruler measure={'imperial'} width={480} units={6} />
        <br />
        <br />
        <Link href="/tools/rotatable">
          <a>Ruler uses Rotatable</a>
        </Link>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(withStyles(() => ({}))(Demo));
