import { layout, TwoChoice } from '@pie-lib/config-ui';

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
      nChoice: 'left',
      layoutMode: 'inline'
    };
    log('state: ', this.state);
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { classes } = this.props;
    const { mounted, layoutMode } = this.state;
    const text = `A component that loads content in 2 slots: it's children and 'settings', depending on
              the width, the settings will either be rendered in a tab or to the right of the
              children.`;

    return mounted ? (
      <div className={classes.root}>
        <div className={classes.left}>
          <Section name="ConfigLayout">
            <Typography>{text}</Typography>

            <layout.ConfigLayout
              sidePanelMinWidth={500}
              settings={
                <React.Fragment>
                  <div>settings here</div>
                  <br />
                  <TwoChoice
                    header="two-choice"
                    value={this.state.twoChoice}
                    onChange={twoChoice => this.setState({ twoChoice })}
                    one={{ label: 'one', value: 'one' }}
                    two={{ label: 'two', value: 'two' }}
                  />
                </React.Fragment>
              }
            >
              Here is the main content.
            </layout.ConfigLayout>
          </Section>

          <Section name="LayoutContents">
            <Typography>
              This is the underlying component of ConfigLayout. It renders secondary content in a
              tab or to the right of children
            </Typography>
            <br />
            <TwoChoice
              header="layout mode"
              value={layoutMode}
              one={'inline'}
              two={'tabbed'}
              onChange={layoutMode => this.setState({ layoutMode })}
            />
            <br />
            <layout.LayoutContents mode={layoutMode} secondary={<div>secondary</div>}>
              This is the main content
            </layout.LayoutContents>
          </Section>
          <Section name="old config layout">
            <layout.ConfigLayout
              sidePanelMinWidth={500}
              settings={
                <React.Fragment>
                  <TwoChoice
                    header="two-choice"
                    value={this.state.twoChoice}
                    onChange={twoChoice => this.setState({ twoChoice })}
                    one={{ label: 'one', value: 'one' }}
                    two={{ label: 'two', value: 'two' }}
                  />
                </React.Fragment>
              }
            >
              content
            </layout.ConfigLayout>
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
