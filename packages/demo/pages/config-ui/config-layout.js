import {
  ConfigLayout,
  ChoiceConfiguration,
  FeedbackConfig,
  FeedbackSelector,
  InputContainer,
  InputSwitch,
  InputCheckbox,
  InputRadio,
  Langs,
  LanguageControls,
  NChoice,
  NumberTextField,
  TagsInput,
  TwoChoice,
  feedbackConfigDefaults,
  MuiBox
} from '@pie-lib/config-ui';

import React from 'react';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../src/withRoot';

const log = debug('demo:config-ui');

const Section = withStyles({
  section: {
    padding: '20px',
    paddingTop: '40px',
    paddingBottom: '40px',
    position: 'relative',
    '&::after': {
      display: 'block',
      position: 'absolute',
      left: '0',
      top: '0',
      bottom: '0',
      right: '0',
      height: '2px',
      content: '""',
      backgroundColor: 'rgba(0,0,0,0.2)'
    }
  }
})(({ name, children, classes }) => (
  <div className={classes.section}>
    <Typography>{name}</Typography>
    <br />
    {children}
  </div>
));

class RawContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      twoChoice: 'one',
      nChoice: 'left'
    };
    log('state: ', this.state);
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { classes } = this.props;
    const { mounted } = this.state;
    console.log('this.state: ', this.state);
    return mounted ? (
      <div className={classes.root}>
        <div className={classes.left}>
          <Section name="Choice Configuration">
            <Typography>
              This is a wrapper for the configure element for a pie-element package
            </Typography>
            <br />
            <br />
            <ConfigLayout
              settings={
                <React.Fragment>
                  <TwoChoice
                    header="two-choice"
                    value={this.state.twoChoice}
                    onChange={twoChoice => this.setState({ twoChoice })}
                    one={{ label: 'one', value: 'one' }}
                    two={{ label: 'two', value: 'two' }}
                  />
                  <NChoice
                    header="n-choice"
                    value={this.state.nChoice}
                    onChange={nChoice => this.setState({ nChoice })}
                    opts={[
                      { label: 'left', value: 'left' },
                      { label: 'center', value: 'center' },
                      { label: 'right', value: 'right' }
                    ]}
                  />
                  <NChoice
                    header="n-choice vertical"
                    direction={'vertical'}
                    value={this.state.nChoice}
                    onChange={nChoice => this.setState({ nChoice })}
                    opts={[
                      { label: 'left', value: 'left' },
                      { label: 'center', value: 'center' },
                      { label: 'right', value: 'right' }
                    ]}
                  />
                </React.Fragment>
              }
              sidePanelMinWidth={500}
            >
              <div>Something</div>
            </ConfigLayout>
          </Section>
        </div>
        <div className={classes.right}>
          <pre className={classes.code}>{JSON.stringify(this.state, null, '  ')}</pre>
        </div>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const Container = withStyles(theme => ({
  root: {
    display: 'flex'
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
  numberField: {
    width: '270px'
  }
}))(RawContainer);

export default withRoot(Container);
