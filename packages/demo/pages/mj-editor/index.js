import React from 'react';
import withRoot from '../../src/withRoot';
import { withStyles } from '@material-ui/core';
import Section from '../../src/formatting/section';
import { withDragContext } from '@pie-lib/drag';
import { Editor as MjEditor } from '@pie-lib/mj-editor';
const math = `<math>
<mrow>
   <msup>
      <mi>a</mi>
      <mn>2</mn>
   </msup>
   <mo>+</mo>
   <msup>
      <mi>b</mi>
      <mn>2</mn>
   </msup>
   <mo>=</mo>
   <msup>
      <mi>c</mi>
      <mn>2</mn>
   </msup>
</mrow>
</math>`;

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { math };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted } = this.state;

    // TODO: check similar comps to see what they support...
    return mounted ? (
      <div>
        <Section name="MathML Example">
          <div dangerouslySetInnerHTML={{ __html: this.state.math }} />

          <MjEditor math={this.state.math} onChange={math => this.setState({ math })} />
        </Section>
      </div>
    ) : (
      <div />
    );
  }
}

const Styled = withStyles(theme => ({}))(Demo);
export default withDragContext(withRoot(Styled));
