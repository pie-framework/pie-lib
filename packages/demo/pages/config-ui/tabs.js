import { Tabs } from '@pie-lib/config-ui';
import React from 'react';
import Typography from '@mui/material/Typography';
import debug from 'debug';
import { styled } from '@mui/material/styles';
import withRoot from '../../source/withRoot';

// eslint-disable-next-line
const log = debug('demo:config-ui');

const RootContainer = styled('div')({});

const TabContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted } = this.state;
    return mounted ? (
      <RootContainer>
        <Typography>Tabs - just add a title to the child node</Typography>
        <Tabs indicatorColor="primary">
          <TabContent title="One">foo</TabContent>
          <TabContent title="Two">two</TabContent>
        </Tabs>
      </RootContainer>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(Container);
