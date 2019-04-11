import { MaskMarkup, MaskSlate } from '@pie-lib/mask-markup';
import React from 'react';
import withRoot from '../../src/withRoot';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import Section from '../../src/formatting/section';
import { Value } from 'slate';
import inputPlugin from './input-plugin';

// const MyComp = () => <div>WOOF</div>;

const valueJson = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [{ object: 'leaf', text: 'hi' }, { object: 'leaf', text: ' there' }]
          }
        ]
      },
      {
        object: 'block',
        type: 'text-input',
        isVoid: true,
        data: {
          value: 'this is the text',
          id: '1'
        }
      }
      // {
      //   object: 'block',
      //   type: 'paragraph',
      //   nodes: [
      //     {
      //       object: 'text',
      //       leaves: [
      //         {
      //           object: 'leaf',
      //           text: 'A line of text in a paragraph.'
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
  }
};

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      value: Value.fromJSON(valueJson, { normalize: false })
    };

    // this.updateInput = (text, nodeKey) => {
    //   const updatedValue = this.state.value.change().setNodByKey(nodeKey, { type: 'paragraph' })
    //     .value;
    //   this.setState({ value: updatedValue });
    // };

    // this.plugins = [
    //   {
    //     name: 'text-input',
    //     renderNode: node => {
    //       if (node.type === 'text-input') {
    //         return (
    //           <Input
    //             style={{ display: 'inline' }}
    //             value={'hi'}
    //             onChange={event => this.updateInput(event.target.value, node.key)}
    //           />
    //         );
    //       }
    //       return undefined;
    //     }
    //   }
    // ];

    this.msPlugins = [inputPlugin({ onChange: this.inputChange })];
  }

  inputChange = value => {
    console.log('input change:', value);
    // this.setState({ value });
    // const { value } = this.state;
    // value.change().setNode;
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted, markup, value } = this.state;

    console.log('value:', value.toJS());
    return mounted ? (
      <div>
        {/* <Section name="Mask Markup">
          This package contains componenents that allow you to render custom components within
          markup/text. This is my first attempt. the idea was to use the Slate model, but to provide
          a simplified renderer:
          <MaskMarkup plugins={this.plugins} value={this.state.value} />
        </Section> */}
        <Section name="Mask Slate">
          As above but this time just use a readOnly instance of slate. Slate has more than we need,
          but already handles the whole render tree etc so may be quicker to get started with:
          <MaskSlate value={value} plugins={this.msPlugins} />
        </Section>
      </div>
    ) : (
      <div />
    );
  }
}

const Styled = withStyles(theme => ({}))(Demo);

export default withRoot(Styled);
