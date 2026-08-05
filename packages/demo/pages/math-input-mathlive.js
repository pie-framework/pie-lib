import React from 'react';
// MathLive's own @font-face stylesheet. The relative url(fonts/*.woff2) paths
// are resolved and emitted by webpack, so the fonts ship with the bundle - no
// copies in public/ and no CDN. The stylesheet also sets --ML__static-fonts,
// which tells MathLive not to fetch fonts itself.
import 'mathlive/fonts.css';
import withRoot from '../source/withRoot';
import Section from '../source/formatting/section';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

/**
 * Demo for @pie-lib/math-input-mathlive - the MathLive-backed alternative to
 * @pie-lib/math-input.
 *
 * The package is required client-side only: MathLive registers custom elements
 * and must not run during SSR (same pattern as pages/math-input.js).
 */
let pkg;

if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  pkg = require('@pie-lib/math-input-mathlive');
}

const NEWLINE = '\\embed{newLine}[]';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      simple: '\\frac{3}{2}',
      withKeypad: 'x^2+1',
      // answer-block template, in the stored MathQuill form the package bridges
      answerTemplate: 'x=\\frac{\\MathQuillMathField[num]{}}{\\MathQuillMathField[den]{}}',
      subFields: {},
      legacyNewline: `a+b${NEWLINE}c-d${NEWLINE}e=f`,
      embedMacros: null,
    };
  }

  async componentDidMount() {
    // Register the embeds a consumer would register, through the compatibility
    // shim, and show the macros it produces.
    pkg.registerEmbed('newLine', () => ({
      htmlString: '<div class="newLine"></div>',
      latex: () => NEWLINE,
    }));
    pkg.registerEmbed('answerBlock', () => ({
      htmlString: '<div class="answerBlock"></div>',
      latex: () => '\\embed{answerBlock}[]',
    }));

    await pkg.loadMathLive();

    this.setState({ mounted: true, embedMacros: pkg.getMacros() });
  }

  onSubFieldChange = (name, latex) => {
    this.setState((s) => ({ subFields: { ...s.subFields, [name]: latex } }));
  };

  render() {
    if (!this.state.mounted) {
      return <div>Loading MathLive…</div>;
    }

    const { mf, keysForGrade, MathInput, HorizontalKeypad, toMathLive, fromMathLive } = pkg;
    const { simple, withKeypad, answerTemplate, subFields, legacyNewline, embedMacros } = this.state;

    return (
      <div>
        <Section name="mf.Input - editable field (replaces mq.Input)">
          <mf.Input latex={simple} onChange={(l) => this.setState({ simple: l })} />
          <pre className="pre">{simple}</pre>
        </Section>

        <Section name="MathInput - field + keypad">
          <MathInput
            latex={withKeypad}
            keyset={keysForGrade('geometry')}
            onChange={(l) => this.setState({ withKeypad: l })}
          />
          <pre className="pre">{withKeypad}</pre>
        </Section>

        <Section name="mf.Static - display mode (convertLatexToMarkup, no mathfield)">
          <mf.Static latex={'\\int_0^1 x^2\\,dx=\\frac{1}{3}'} />
        </Section>

        <Section name={'mf.Static - answer blocks (\\MathQuillMathField -> \\placeholder)'}>
          <p>Click a box and type. Values arrive through onSubFieldChange, backed by the prompts API.</p>
          <mf.Static latex={answerTemplate} onSubFieldChange={this.onSubFieldChange} />
          <pre className="pre">stored latex: {answerTemplate}</pre>
          <pre className="pre">as MathLive: {toMathLive(answerTemplate)}</pre>
          <pre className="pre">sub-fields: {JSON.stringify(subFields, null, 2)}</pre>
        </Section>

        <Section name={'Newline bridge (\\embed{newLine}[] <-> \\displaylines)'}>
          <mf.Static latex={legacyNewline} />
          <pre className="pre">stored: {legacyNewline}</pre>
          <pre className="pre">as MathLive: {toMathLive(legacyNewline)}</pre>
          <pre className="pre">round-trip back: {fromMathLive(toMathLive(legacyNewline))}</pre>
        </Section>

        <Section name="registerEmbed compatibility shim">
          <p>Embeds registered above, expressed as MathLive macros:</p>
          <pre className="pre">
            {JSON.stringify({ newLine: embedMacros.newLine, answerBlock: embedMacros.answerBlock }, null, 2)}
          </pre>
        </Section>

        <Section name="HorizontalKeypad (4.x compatible)">
          <HorizontalKeypad onClick={(d) => console.log('key:', d)} />
        </Section>
      </div>
    );
  }
}

const Wrapped = styled((props) => <Demo {...props} />)(({ theme }) => ({
  '& .pre': {
    padding: theme.spacing(1),
    backgroundColor: grey[100],
    whiteSpace: 'pre-wrap',
    fontSize: 12,
  },
}));

export default withRoot(Wrapped);
