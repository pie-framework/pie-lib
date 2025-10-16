import { InputCheckbox, NumberTextField, NumberTextFieldCustom } from '@pie-lib/config-ui';
import React from 'react';
import Typography from '@mui/material/Typography';
import debug from 'debug';
import { styled } from '@mui/material/styles';
import withRoot from '../../source/withRoot';
import Section from '../../source/formatting/section';

// eslint-disable-next-line
const log = debug('demo:config-ui');

const RootContainer = styled('div')({
  display: 'flex',
});

const LeftSection = styled('div')({
  flex: 1,
});

const RightSection = styled('div')({
  flex: 0.3,
});

const CodeBlock = styled('pre')({
  position: 'fixed',
});

const SmallTextField = styled(NumberTextField)({
  width: '100px',
});

const TextFieldStyled = styled(NumberTextFieldCustom)({
  width: '150px',
  margin: '8px',
});

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberTextField: {
        one: 400,
        custom: 350,
        custom2: 21,
      },
    };
  }

  update = (key) => (event, number) => {
    const { numberTextField } = this.state;
    const update = { ...numberTextField, [key]: number };

    this.setState({ numberTextField: update });
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  onChoiceConfigChange = (update) => {
    this.setState({ choiceConfig: update });
  };

  render() {
    const { mounted, numberTextField } = this.state;
    const initalValueMessage = `
    If there is no initial value, it'll be set to either the min or max if present, or 0
              if there is no min/max.`;

    return mounted ? (
      <RootContainer>
        <LeftSection>
          <Section name="NumberTextField - no initial value">
            <Typography variant={'body1'}>{initalValueMessage}</Typography>
            <Typography variant={'body1'}>
              onChange will only call when a number within the min max has been set.
            </Typography>
            <SmallTextField label="1 - 10" value={numberTextField.one} max={10} min={0} onChange={this.update('one')} />
            <SmallTextField label={'no min/max'} value={numberTextField.two} onChange={this.update('two')} />
          </Section>
          <Section name="with suffix">
            <SmallTextField
              label="1 - 10"
              suffix={'%'}
              value={numberTextField.one}
              max={10}
              min={1}
              onChange={this.update('one')}
            />
          </Section>
          <Section name="layout - works with Input* components">
            <InputCheckbox label="Foo" />
            <SmallTextField label="1 - 10" value={numberTextField.one} max={10} min={1} onChange={this.update('one')} />
          </Section>
          <Section name="validation">
            <SmallTextField
              label="1 - 10"
              min={1}
              max={10}
              showErrorWhenOutsideRange={true}
              value={numberTextField.validation}
              onChange={this.update('validation')}
            />
          </Section>
          <Section name="custom">
            <TextFieldStyled
              label="Custom"
              value={numberTextField.custom}
              max={600}
              min={310}
              step={20}
              variant={'outlined'}
              onChange={this.update('custom')}
            />
            <TextFieldStyled
              label="Custom values"
              value={numberTextField.custom2}
              customValues={[1, 10, 20, 35, 64]}
              variant={'outlined'}
              onChange={this.update('custom2')}
            />
          </Section>
        </LeftSection>
        <RightSection>
          <CodeBlock>{JSON.stringify(this.state, null, '  ')}</CodeBlock>
        </RightSection>
      </RootContainer>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(Container);
