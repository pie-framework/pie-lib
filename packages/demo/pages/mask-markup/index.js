import { DragInTheBlank, ConstructedResponse, InlineDropdown } from '@pie-lib/mask-markup';
import React from 'react';
import withRoot from '../../src/withRoot';
import { withStyles } from '@material-ui/core';
import Section from '../../src/formatting/section';
import Pre from '../../src/formatting/pre';
import inputPlugin from './input-plugin';
import { withDragContext } from '@pie-lib/drag';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// const markup = `<table class=\"kds-fraction\"><tbody> <tr><td class=\"kds-numerator\"><strong><span style=\"font-family:'Times New Roman'; font-size:1.2em;\">π</span></strong></td></tr><tr> <td class=\"kds-denominator\"><strong>6</strong></td></tr></tbody></table><strong><em>t</em><b class=\"frac\">)</b>,</strong></div> <strong>where <em>t</em> represents the number of hours since midnight.<br><br>Based on this equation, after how many hours does the water level in the harbor first reach 10 feet?</strong><br><br> {{0}} <strong>hours</strong>`;
// const markup = `<table class="KdsTable01"><tbody><tr>  <td>5</td>  </tr></tbody></table>`;
const markup = `<div>
  <img src="https://image.shutterstock.com/image-vector/cow-jumped-over-moon-traditional-260nw-1152899330.jpg"></img>
   <h5>Hey Diddle Diddle <i>by ?</i></h5>
 <p>1: Hey, diddle, diddle,</p>
 <p>2: The cat and the fiddle,</p>
 <p>3: The cow {{0}} over the moon;</p>
 <p>4: The little dog {{1}},</p>
 <p>5: To see such sport,</p>
 <p>6: And the dish ran away with the {{2}}.</p>
</div>`;
const choice = v => ({ label: v, value: v });
class Demo extends React.Component {
  constructor(props) {
    super(props);

    // this.components = {
    //   input: components.Input,
    //   dropdown: components.Dropdown,
    //   blank: components.Blank
    // };

    this.state = {
      constructedResponse: {
        markup,
        choices: {
          0: 'blank'
        }
      },
      inlineDropdown: {
        markup,
        value: {
          0: 'Climbed',
          1: '',
          2: ''
        },
        choices: {
          0: [choice('Jumped'), choice('Climbed'), choice('Flew')],
          1: [choice('Laughed'), choice('Cried'), choice('Sang')],
          2: [choice('Spoon'), choice('Fork'), choice('Knife')]
        }
      },
      dragInTheBlank: {
        markup,
        choices: [
          choice('Jumped'),
          choice('Laughed'),
          choice('Spoon'),
          choice('Fork'),
          choice('Bumped'),
          choice('Smiled')
        ],

        value: {
          0: undefined
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

  getFeedback = obj => {
    const { evaluate } = this.state;

    if (!evaluate) {
      return {};
    }

    return {
      0: {
        value: obj.value['0'],
        correct: obj.value['0'] === 'Jumped'
      },
      1: {
        value: obj.value['1'],
        correct: obj.value['1'] === 'Laughed'
      },
      2: {
        value: obj.value['2'],
        correct: obj.value['2'] === 'Spoon'
      }
    };
  };

  render() {
    const {
      mounted,
      markup,
      value,
      disabled,
      evaluate,
      dragInTheBlank,
      constructedResponse,
      inlineDropdown
    } = this.state;

    const dragFeedback = this.getFeedback(dragInTheBlank);
    const crFeedback = this.getFeedback(constructedResponse);
    const idFeedback = this.getFeedback(inlineDropdown);

    // TODO: check similar comps to see what they support...
    return mounted ? (
      <div>
        <div>
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
        </div>
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
            feedback={dragFeedback}
            disabled={disabled}
            {...dragInTheBlank}
            onChange={value =>
              this.setState({ dragInTheBlank: { ...this.state.dragInTheBlank, value } })
            }
          />
          <Pre value={this.state.dragInTheBlank.value} />
        </Section>
        <Section name="Explicit Constructed Response">
          <ConstructedResponse
            disabled={disabled}
            {...constructedResponse}
            feedback={crFeedback}
            onChange={value => {
              this.setState({ constructedResponse: { ...this.state.constructedResponse, value } });
            }}
          />
          <Pre value={this.state.constructedResponse.value} />
        </Section>
        <Section name="Inline Dropdown">
          <InlineDropdown
            disabled={disabled}
            {...inlineDropdown}
            feedback={idFeedback}
            onChange={value => {
              this.setState({ inlineDropdown: { ...this.state.inlineDropdown, value } });
            }}
          />
          <Pre value={this.state.inlineDropdown.value} />
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
