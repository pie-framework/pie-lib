import { NumberTextField, InputCheckbox, InputRadio } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../src/withRoot';
import Section from '../../src/formatting/section';

// eslint-disable-next-line
const log = debug('demo:config-ui');

class RawContainer extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      numberTextField: {
        one: undefined
      }
    };
  }

  update = key => (event, number) => {
    const update = { ...this.state.numberTextField, [key]: number };
    this.setState({ numberTextField: update });
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  onChoiceConfigChange = update => {
    this.setState({ choiceConfig: update });
  };

  render() {
    const { classes } = this.props;
    const { mounted } = this.state;
    const initalValueMessage = `
    If there is no initial value, it'll be set to either the min or max if present, or 0
              if there is no min/max.`;

    return mounted ? (
      <div className={classes.root}>
        <div className={classes.left}>
          <Section name="NumberTextField - no initial value">
            <Typography variant={'body1'}>{initalValueMessage}</Typography>
            <Typography variant={'body1'}>
              onChange will only call when a number within the min max has been set.
            </Typography>
            <NumberTextField
              label="1 - 10"
              value={this.state.numberTextField.one}
              max={10}
              min={0}
              onChange={this.update('one')}
            />
            <NumberTextField
              label={'no min/max'}
              className={classes.smallTextField}
              value={this.state.numberTextField.two}
              onChange={this.update('two')}
            />
          </Section>
          <Section name="with suffix">
            <NumberTextField
              label="1 - 10"
              suffix={'%'}
              value={this.state.numberTextField.one}
              max={10}
              min={1}
              onChange={this.update('one')}
            />
          </Section>
          <Section name="layout - works with Input* components">
            <InputCheckbox label="Foo" />
            <NumberTextField
              label="1 - 10"
              value={this.state.numberTextField.one}
              max={10}
              min={1}
              onChange={this.update('one')}
            />
            <InputRadio label="Foo" />
          </Section>
          <Section name="validation">
            <NumberTextField
              label="1 - 10"
              min={1}
              max={10}
              showErrorWhenOutsideRange={true}
              value={this.state.numberTextField.validation}
              onChange={this.update('validation')}
            />
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

const Container = withStyles(() => ({
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
  smallTextField: {
    width: '100px'
  }
}))(RawContainer);

export default withRoot(Container);
