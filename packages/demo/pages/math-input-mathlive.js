import React from 'react';
import withRoot from '../source/withRoot';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Section from '../source/formatting/section';
import { grey, blue } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Lazy-loaded to avoid SSR issues — MathLive requires window/customElements
let mlMq, mlKeysForGrade, mlKeys, mlHorizontalKeypad;
let mqMq, mqKeysForGrade;

if (typeof window !== 'undefined') {
  const mathInputMathlive = require('@pie-lib/math-input-mathlive');
  mlMq = mathInputMathlive.mq;
  mlKeysForGrade = mathInputMathlive.keysForGrade;
  mlKeys = mathInputMathlive.keys;
  mlHorizontalKeypad = mathInputMathlive.HorizontalKeypad;

  const mathInput = require('@pie-lib/math-input');
  mqMq = mathInput.mq;
  mqKeysForGrade = mathInput.keysForGrade;
}

const EDITOR_TYPES = [
  { value: 1, label: 'Grade 1 - 2' },
  { value: 3, label: 'Grade 3 - 5' },
  { value: 6, label: 'Grade 6 - 7' },
  { value: 8, label: 'Grade 8 - HS' },
  { value: 'geometry', label: 'Geometry' },
  { value: 'advanced-algebra', label: 'Advanced Algebra' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      editorType: 'geometry',
      mlBasic: '\\frac{3}{2}',
      mlPrompts: '\\MathQuillMathField[r1]{} + \\MathQuillMathField[r2]{}',
      mlCustom: '',
      mqBasic: '\\frac{3}{2}',
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted, editorType, mlBasic, mlPrompts, mlCustom, mqBasic } = this.state;

    if (!mounted || !mlMq) return <div>Loading…</div>;

    const mlKeyset = mlKeysForGrade(editorType);
    const mqKeyset = mqKeysForGrade ? mqKeysForGrade(editorType) : [];

    return (
      <div>
        {/* Keypad preset selector */}
        <Section name="Keypad Preset">
          <FormControl variant="outlined" sx={{ mb: 2 }}>
            <InputLabel htmlFor="preset-select">Preset</InputLabel>
            <Select
              value={editorType}
              label="Preset"
              onChange={(e) => this.setState({ editorType: e.target.value })}
              input={<OutlinedInput name="Editor Type" />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {EDITOR_TYPES.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Section>

        {/* MathLive editable input */}
        <Section name="MathLive editable input (mq.Input)">
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Wraps the native <code>&lt;math-field&gt;</code> web component. Mirrors the MathQuill{' '}
            <code>mq.Input</code> public API: <code>latex</code>, <code>onChange</code>,{' '}
            <code>write</code>, <code>command</code>, <code>keystroke</code>.
          </Typography>
          <mlMq.Input
            keyset={mlKeyset}
            latex={mlBasic}
            onChange={(latex) => this.setState({ mlBasic: latex })}
          />
          <pre className="pre">{mlBasic}</pre>
        </Section>

        {/* Side-by-side comparison */}
        {mqMq && (
          <Section name="Side-by-side: MathLive (left) vs MathQuill (right)">
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Same initial LaTeX, same keypad preset — compare the rendering and UX.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant="subtitle2" sx={{ color: blue[700], mb: 0.5 }}>
                  MathLive
                </Typography>
                <mlMq.Input
                  keyset={mlKeyset}
                  latex={mlBasic}
                  onChange={(latex) => this.setState({ mlBasic: latex })}
                />
                <pre className="pre">{mlBasic}</pre>
              </Box>
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant="subtitle2" sx={{ color: grey[700], mb: 0.5 }}>
                  MathQuill
                </Typography>
                <mqMq.Input
                  keyset={mqKeyset}
                  latex={mqBasic}
                  onChange={(latex) => this.setState({ mqBasic: latex })}
                />
                <pre className="pre">{mqBasic}</pre>
              </Box>
            </Box>
          </Section>
        )}

        {/* Static rendering with fill-in-the-blank prompts */}
        <Section name="MathLive Static with fill-in-the-blank prompts (mq.Static)">
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            <code>\MathQuillMathField[rN]{'{}'}</code> tokens are automatically converted to MathLive{' '}
            <code>\placeholder[rN]{'{}'}</code> prompts. Each blank is editable.
          </Typography>
          <mlMq.Static
            latex={mlPrompts}
            onSubFieldChange={(name, latex) => console.log('[onSubFieldChange]', name, latex)}
          />
          <pre className="pre">{mlPrompts}</pre>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Edit the LaTeX source:
          </Typography>
          <input
            style={{ width: '100%', fontFamily: 'monospace', padding: 4 }}
            value={mlPrompts}
            onChange={(e) => this.setState({ mlPrompts: e.target.value })}
          />
        </Section>

        {/* Custom keys */}
        <Section name="Custom key injection">
          <mlMq.Input
            displayMode="block-on-focus"
            latex={mlCustom}
            onChange={(latex) => this.setState({ mlCustom: latex })}
            keyset={[
              [
                { label: 'a', write: 'a' },
                { label: 'b', write: 'b' },
                { label: 'c', write: 'c' },
              ],
              [
                mlKeys.misc.parenthesis,
                mlKeys.fractions.xBlankBlank,
                mlKeys.exponent.xToPowerOfN,
                mlKeys.exponent.squareRoot,
              ],
            ]}
          />
          <pre className="pre">{mlCustom}</pre>
        </Section>

        {/* HorizontalKeypad */}
        <Section name="HorizontalKeypad (backward-compatible)">
          <mlHorizontalKeypad onClick={(d) => console.log('[HorizontalKeypad click]', d)} />
        </Section>
      </div>
    );
  }
}

const StyledDemo = styled(Demo)(({ theme }) => ({
  '& .pre': {
    padding: theme.spacing(1),
    backgroundColor: grey[200],
    fontFamily: 'monospace',
    fontSize: 12,
    borderRadius: 4,
    marginTop: theme.spacing(0.5),
    overflowX: 'auto',
  },
}));

export default withRoot(StyledDemo);
