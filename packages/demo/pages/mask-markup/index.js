import { tree, Choices, MaskMarkup, DragInTheBlank, components } from '@pie-lib/mask-markup';
import React from 'react';
import withRoot from '../../src/withRoot';
import { withStyles } from '@material-ui/core';
import Section from '../../src/formatting/section';
import Pre from '../../src/formatting/pre';
import inputPlugin from './input-plugin';
import DragChoice from './drag-choice';
import { withDragContext } from '@pie-lib/drag';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const markup = `<div>
<p>1: Hey, diddle, diddle,</p>
<p>2: The cat and the fiddle,</p>
<p>3: The cow <span data-component="blank" data-id="1"></span> over the moon;</p>
<p>4: The little dog <span data-component="input" data-id="2"></span>,</p>
<p>5: To see such sport,</p>
<p>6: And the dish ran away with the <span data-component="dropdown" data-id="3"></span>.</p>
</div>`;
const choice = v => ({ label: v, value: v });
class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.components = {
      input: components.Input,
      dropdown: components.Dropdown,
      blank: components.Blank
    };

    this.state = {
      main: {
        markup: '<div>blank here: {{0}}</div>',
        choices: [
          choice('foo'),
          choice('bar'),
          choice('baz'),
          choice('beamish'),
          choice('murphys')
        ],

        value: {
          0: undefined
        },
        feedback: {
          0: {}
        }
      },
      data: {
        1: 'this is one',
        2: 'carrot'
      },
      choices: {
        2: [{ label: 'foo', value: 'foo' }, { label: 'bar', value: 'bar' }]
      },
      layout: {
        object: 'block',
        type: 'div',
        nodes: [
          {
            object: 'block',
            type: 'div',
            nodes: [
              {
                object: 'inline',
                type: 'input',
                data: {
                  id: '1'
                }
              },
              { object: 'text', content: 'foo' },
              { object: 'inline', type: 'blank', data: { id: '2' } }
            ]
          },
          { object: 'text', content: 'hi' },
          { object: 'inline', type: 'span', nodes: [{ object: 'text', content: ' in span' }] }
        ]
      },
      disabled: false,
      evaluate: false,
      mounted: false,
      markup,
      value: {
        1: {
          value: undefined
        },
        2: {
          value: ''
        },
        3: {
          value: ''
        }
      }
    };

    this.msPlugins = [inputPlugin({ onChange: this.inputChange })];
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted, markup, value, disabled, evaluate, main } = this.state;

    const feedback = evaluate
      ? {
          1: {
            value: value['1'].value,
            correct: value['1'].value === 'Jumped'
          },
          2: {
            value: value['2'].value,
            correct: value['2'].value === 'laughed'
          },
          3: {
            value: value['3'].value,
            correct: value['3'].value === 'spoon'
          }
        }
      : {};

    // TODO: check similar comps to see what they support...
    return mounted ? (
      <div>
        {/* <Section name="low level">
          <Choices value={this.state.choices[2]} data={this.state.data} />
          <tree.Mask
            layout={this.state.layout}
            data={this.state.data}
            onChange={data => this.setState({ data })}
          />
        </Section> */}
        <Section name="Drag in the Blank">
          <DragInTheBlank
            {...main}
            onChange={value => this.setState({ main: { ...this.state.main, value } })}
          />
          <Pre value={this.state.main.value} />
        </Section>
        {/* <Section name="MaskMarkup">
          <FormControlLabel
            control={
              <Switch
                checked={disabled}
                onChange={() => this.setState({ disabled: !this.state.disabled })}
              />
            }
            label="Disabled"
          />
          <FormControlLabel
            control={
              <Switch
                checked={evaluate}
                onChange={() => this.setState({ evaluate: !this.state.evaluate })}
              />
            }
            label="Evaluate"
          />
          <MaskMarkup
            markup={markup}
            disabled={disabled}
            components={this.components}
            value={value}
            feedback={feedback}
            config={{
              3: {
                choices: [
                  { label: 'carrot', value: 'carrot' },
                  { label: 'spoon', value: 'spoon' },
                  { label: 'monsoon', value: 'monsoon' },
                  { label: 'saucer', value: 'saucer' }
                ]
              }
            }}
            onChange={value => this.setState({ value })}
          />
          <hr />
          <div>
            Line 3 Options:
            <DragChoice targetId="4" value="Jumped" disabled={disabled} />
            <DragChoice targetId="4" value="Leaped" />
            <DragChoice targetId="4" value="Flew" />
            <DragChoice targetId="4" value="Crawled" />
          </div>
          <hr />
          <Pre value={this.state.value} />
        </Section> */}
      </div>
    ) : (
      <div />
    );
  }
}

const Styled = withStyles(theme => ({}))(Demo);

export default withDragContext(withRoot(Styled));
