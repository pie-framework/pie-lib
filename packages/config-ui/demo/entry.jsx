import {
  ChoiceConfiguration,
  FeedbackConfig,
  FeedbackSelector,
  InputContainer,
  InputSwitch,
  InputCheckbox,
  InputRadio,
  Langs,
  LanguageControls,
  MultiLangInput,
  NChoice,
  NumberTextField,
  TagsInput,
  TwoChoice,
  feedbackConfigDefaults,
  MuiBox
} from '../src/index';

import Radio from 'material-ui/Radio';
import React from 'react';
import ReactDOM from 'react-dom';
import Typography from 'material-ui/Typography';
import debug from 'debug';
import { withStyles } from 'material-ui/styles';

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
})(({ name, children, classes }) => <div className={classes.section}>
  <Typography>{name}</Typography>
  <br />
  {children}
</div>);

class RawContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choiceConfig: {
        label: 'Apple',
        value: 'apple',
        feedback: {
          type: 'none'
        }
      },
      tags: ['apple', 'banana', 'carrot', 'donut', 'eggs', 'fries', 'hops', 'ice cream'],
      twoChoice: 'one',
      nChoice: 'left',
      selector: {
        type: 'default',
        customFeedback: undefined,
        default: 'This is the default feedback'
      },
      numberTextField: {
        one: 1,
        two: 2
      },
      feedback: feedbackConfigDefaults({
        correctFeedbackType: 'custom',
        correctFeedback: 'custom message'
      }),
      lang: 'en-US',
      activeLang: 'en-US',
      defaultLang: 'en-US'
    }
    log('state: ', this.state);
    this.updateOne = this.updateOne.bind(this);
  }

  updateOne(event, number) {
    console.log('number: ', number);
    this.setState(
      {
        numberTextField: Object.assign({}, this.state.numberTextField, { one: number })
      });
  }

  onChoiceConfigChange = (update) => {
    console.log('update: ', update);
    this.setState({ choiceConfig: update });
  }

  render() {
    const { classes } = this.props;

    console.log('this.state: ', this.state);
    return <div className={classes.root}>
      <div className={classes.left}>
        <Section name="Choice Configuration">
          <Typography>This is a single choice configuration that can be used where the user can build up a list of choices</Typography>
          <br />
          <br />
          <ChoiceConfiguration
            index={1}
            mode={'checkbox'}
            data={this.state.choiceConfig}
            defaultFeedback={{
              correct: 'Correct',
              incorrect: 'Incorrect'
            }}
            onChange={this.onChoiceConfigChange} />
        </Section>
        <Section name="MuiBox">
          <MuiBox focused={false}>contents</MuiBox>
          <MuiBox focused={true}>contents</MuiBox>
        </Section>
        <Section name="Tag Input">
          <div style={{ maxWidth: '300px' }}>
            <TagsInput
              tags={this.state.tags}
              onChange={tags => this.setState({ tags })}
            />
          </div>
        </Section>
        <Section name="Input Container">
          <div style={{ display: 'flex' }}>
            <InputContainer label="raw">
              <div>raw</div>
            </InputContainer>
            <InputSwitch
              label="InputSwitch"
              checked={true}
            />
            <InputCheckbox
              label="InputCheckbox"
              checked={true}
            />
            <InputRadio
              label="InputRadio"
              checked={true}
            />
          </div>
        </Section>
        <Section name="Two and N Choice">
          <div style={{ display: 'flex' }}>
            <TwoChoice
              header="two-choice"
              value={this.state.twoChoice}
              onChange={twoChoice => this.setState({ twoChoice })}
              one={{ label: 'one', value: 'one' }}
              two={{ label: 'two', value: 'two' }} />
            <NChoice
              header="n-choice"
              value={this.state.nChoice}
              onChange={nChoice => this.setState({ nChoice })}
              opts={[
                { label: 'left', value: 'left' },
                { label: 'center', value: 'center' },
                { label: 'right', value: 'right' }
              ]} />
          </div>
        </Section>
        <Section name="MultiLangInput">
          <MultiLangInput
            label={'label'}
            lang={'en-US'}
            value={[{ lang: 'en-US', value: '<div><strong>hi</strong></div>' }]}>
          </MultiLangInput>
        </Section>
        <Section name="NumberTextField">
          <NumberTextField
            value={this.state.numberTextField.one}
            max={10}
            min={1}
            onChange={this.updateOne} />
        </Section>
        <Section name="FeedbackSelector">
          <FeedbackSelector
            label={'Some Feedback:'}
            feedback={this.state.selector}
            onFeedbackChange={(feedback) => this.setState({ selector: feedback })} />
        </Section>
        <Section name="FeedbackConfig">
          <FeedbackConfig
            feedback={this.state.feedback}
            onChange={(feedback) => this.setState({ feedback })} />
        </Section>

        <Section name="Language Controls">
          <LanguageControls
            langs={['en-US', 'es-ES']}
            activeLang={this.state.activeLang}
            defaultLang={this.state.defaultLang}
            onActiveLangChange={activeLang => this.setState({ activeLang })}
            onDefaultLangChange={defaultLang => this.setState({ defaultLang })} />
        </Section>
        <Section name="Langs">
          <Langs
            label="label"
            langs={['en-US', 'es-ES']}
            selected={this.state.lang}
            onChange={l => this.setState({ lang: l })} />
        </Section>
      </div>
      <div className={classes.right}>
        <pre className={classes.code}>{JSON.stringify(this.state, null, '  ')}</pre>
      </div>
    </div>
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
    flex: 0.3,
  }
}))(RawContainer);
document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(Container, {});
  ReactDOM.render(el, document.querySelector('#app'));
});