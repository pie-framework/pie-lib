import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import debug from 'debug';
import {
  loadMathLive,
  getMacros,
  latexToMarkup,
  MATH_MODE_SPACE,
  applyShadowStyles,
  trackPlaceholderCaret,
} from '../mathlive-instance';
import { toMathLive, fromMathLive, fieldIds } from '../latex-bridge';
import { placeholderStyles, rootIndexStyles } from './common-styles';

const log = debug('pie-lib:math-input-mathlive:static');

const Holder = styled('span')({
  display: 'inline-block',
  // Shared static-math rules: muted empty-slot glyphs and svg containment.
  ...placeholderStyles,
  // Readable radical index - display mode renders in the light DOM, so the
  // shadow-root copy of this rule does not reach it.
  ...rootIndexStyles,
  '& math-field': {
    display: 'inline-block',
    border: 'none',
    background: 'transparent',
  },
  '& math-field::part(virtual-keyboard-toggle)': {
    display: 'none',
  },
  '& math-field::part(menu-toggle)': {
    display: 'none',
  },
});

/**
 * Static math. Drop-in replacement for @pie-lib/math-input's `mq.Static`.
 *
 * Two modes, chosen automatically:
 *
 *  - **display** (no answer blocks in the latex): rendered with
 *    `convertLatexToMarkup`. No mathfield instance, so it is cheap enough for
 *    keypad labels - the old implementation created a full MathQuill
 *    StaticMath per button.
 *
 *  - **interactive** (latex contains `\MathQuillMathField[..]{}` /
 *    `\placeholder[..]{}`): a read-only `<math-field>` whose placeholders stay
 *    editable. Sub-field values are surfaced through the prompts API, replacing
 *    MathQuill's `innerFields`.
 */
export default class Static extends React.Component {
  static propTypes = {
    latex: PropTypes.string.isRequired,
    className: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    getFieldName: PropTypes.func,
    onSubFieldChange: PropTypes.func,
    onSubFieldFocus: PropTypes.func,
    setInput: PropTypes.func,
  };

  static defaultProps = {
    getFieldName: () => {},
  };

  constructor(props) {
    super(props);
    this.holderRef = React.createRef();
    this.state = { markup: '' };
    this.promptValues = {};
  }

  async componentDidMount() {
    // See the note in mf/input.jsx: a generation counter, not a boolean, so a
    // StrictMode mount -> unmount -> mount on the same instance still ends up
    // with exactly one field.
    const generation = (this.mountGeneration = (this.mountGeneration || 0) + 1);

    if (!this.isInteractive()) {
      await loadMathLive();

      if (generation === this.mountGeneration) {
        this.renderMarkup();
      }

      return;
    }

    const ml = await loadMathLive();

    if (generation !== this.mountGeneration || !ml || !this.holderRef.current || this.mathField) {
      return;
    }

    this.mathField = new ml.MathfieldElement({ macros: getMacros() });
    this.mathField.readOnly = true;
    this.mathField.mathVirtualKeyboardPolicy = 'manual';
    // Without this the spacebar does nothing: MathLive's mathModeSpace
    // defaults to an empty string.
    this.mathField.mathModeSpace = MATH_MODE_SPACE;
    this.mathField.value = toMathLive(this.props.latex);

    // The mathfield renders in shadow DOM, so page CSS cannot reach it - the
    // stretchy-accent fix has to be injected there directly.
    applyShadowStyles(this.mathField);

    // A selected `\placeholder{}` gets no MathLive caret; draw one. Answer
    // blocks are typed into with the same keypad, so they grow placeholders too.
    this.untrackCaret = trackPlaceholderCaret(this.mathField);

    this.mathField.addEventListener('input', this.onPromptInput);
    this.mathField.addEventListener('focusin', this.onPromptFocus);
    this.mathField.addEventListener('keydown', this.onKeyDown);

    // Belt and braces: drop anything a previous mount may have left behind.
    this.holderRef.current.replaceChildren(this.mathField);

    this.createLiveRegion();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.latex === this.props.latex) {
      return;
    }

    if (this.mathField) {
      this.mathField.value = toMathLive(this.props.latex);
    } else {
      this.renderMarkup();
    }
  }

  componentWillUnmount() {
    // Invalidate any mount still awaiting the MathLive load.
    this.mountGeneration = (this.mountGeneration || 0) + 1;

    if (this.untrackCaret) {
      this.untrackCaret();
      this.untrackCaret = undefined;
    }

    if (this.mathField) {
      this.mathField.removeEventListener('input', this.onPromptInput);
      this.mathField.removeEventListener('focusin', this.onPromptFocus);
      this.mathField.removeEventListener('keydown', this.onKeyDown);
      this.mathField.remove();
      this.mathField = undefined;
    }

    this.removeLiveRegion();
  }

  /**
   * Off-screen aria-live region, ported from @pie-lib/math-input's Static.
   *
   * MathLive has its own accessibility layer, but it does not announce that
   * typed input was converted into a math symbol, which screen-reader users
   * relied on in the MathQuill implementation.
   */
  createLiveRegion = () => {
    if (typeof document === 'undefined' || this.liveRegion) {
      return;
    }

    this.liveRegion = document.createElement('div');
    Object.assign(this.liveRegion.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      marginTop: '-1px',
      clip: 'rect(1px, 1px, 1px, 1px)',
      overflow: 'hidden',
    });
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');

    document.body.appendChild(this.liveRegion);
  };

  removeLiveRegion = () => {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }

    this.liveRegion = undefined;
  };

  announce = (message) => {
    if (!this.liveRegion) {
      return;
    }

    this.liveRegion.textContent = message;

    // Clear once announced, so the same message can be announced again.
    clearTimeout(this.announceTimeout);
    this.announceTimeout = setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 500);
  };

  onKeyDown = (event) => {
    // Deletions should not be announced as conversions.
    this.isDeleting = event?.key === 'Backspace' || event?.key === 'Delete';
  };

  /**
   * Announce when typed input became a math symbol. The MathQuill version
   * inferred this by counting braces; here a prompt whose latex grew by more
   * than the single character typed means a command was expanded.
   */
  announceConversion = (next) => {
    if (this.isDeleting) {
      this.isDeleting = false;
      return;
    }

    const converted = Object.keys(next).some((id) => {
      const before = this.promptValues[id] || '';
      const after = next[id] || '';

      return after.length > before.length + 1 && /\\/.test(after.slice(before.length));
    });

    if (converted) {
      this.announce('Converted to math symbol');
    }
  };

  /** Does this latex contain answer blocks? */
  isInteractive() {
    const latex = this.props.latex || '';

    return fieldIds(latex).length > 0 || latex.indexOf('\\placeholder') !== -1;
  }

  renderMarkup() {
    const markup = latexToMarkup(this.props.latex);

    if (markup !== this.state.markup) {
      this.setState({ markup });
    }
  }

  /** MathQuill's `innerFields` equivalent, keyed by prompt id. */
  values() {
    if (!this.mathField) {
      return {};
    }

    const out = {};

    (this.mathField.getPrompts() || []).forEach((id) => {
      out[id] = fromMathLive(this.mathField.getPromptValue(id));
    });

    return out;
  }

  /**
   * A MathQuill-inner-field-like handle for a prompt.
   *
   * The old API handed callers a MathQuill field object, and consumers commonly
   * called `field.latex()` on it. There is no equivalent object in MathLive -
   * prompts are addressed by id - so this adapter exposes the parts that were
   * actually used: `id` and a get/set `latex()`.
   */
  promptHandle(id) {
    return {
      id,
      // MathQuill's inner fields could be focused directly; keep that.
      focus: () => {
        if (this.mathField) {
          this.mathField.focus();
          this.focusPrompt(id);
        }
      },
      latex: (value) => {
        if (!this.mathField) {
          return '';
        }

        if (value === undefined) {
          return fromMathLive(this.mathField.getPromptValue(id));
        }

        this.mathField.setPromptValue(id, toMathLive(value), {});

        return value;
      },
    };
  }

  /** All prompt handles, the analogue of `mathField.innerFields`. */
  get innerFields() {
    if (!this.mathField) {
      return [];
    }

    return (this.mathField.getPrompts() || []).map((id) => this.promptHandle(id));
  }

  onPromptInput = () => {
    const { onSubFieldChange, getFieldName } = this.props;

    if (!this.mathField) {
      return;
    }

    const next = this.values();

    this.announceConversion(next);

    if (!onSubFieldChange) {
      this.promptValues = next;
      return;
    }

    const fields = this.innerFields;

    // Emit only the prompts whose value actually changed, mirroring the
    // per-field granularity of the old onSubFieldChange(name, latex).
    Object.keys(next).forEach((id) => {
      if (next[id] === this.promptValues[id]) {
        return;
      }

      const name = getFieldName(this.promptHandle(id), fields) || id;

      onSubFieldChange(name, next[id]);
    });

    this.promptValues = next;
  };

  onPromptFocus = () => {
    const { onSubFieldFocus, getFieldName } = this.props;

    if (!this.mathField || !onSubFieldFocus) {
      return;
    }

    try {
      const ids = this.mathField.getPrompts() || [];
      // The focused prompt is the one containing the current selection.
      const focused = ids.find((id) => {
        const range = this.mathField.getPromptRange(id);
        const selection = this.mathField.selection;

        if (!range || !selection || !selection.ranges || !selection.ranges.length) {
          return false;
        }

        const [start, end] = range;
        const [selStart] = selection.ranges[0];

        return selStart >= start && selStart <= end;
      });

      if (focused) {
        const handle = this.promptHandle(focused);
        const name = getFieldName(handle, this.innerFields) || focused;

        if (this.props.setInput) {
          this.props.setInput(handle);
        }

        onSubFieldFocus(name, handle);
      }
    } catch (e) {
      log('error resolving focused prompt: %s', e.message);
    }
  };

  /** The id of the prompt whose range contains `position`, if any. */
  promptContaining(position) {
    if (!this.mathField || typeof position !== 'number') {
      return undefined;
    }

    return (this.mathField.getPrompts() || []).find((id) => {
      const range = this.mathField.getPromptRange(id);

      return range && position >= range[0] && position <= range[1];
    });
  }

  /**
   * Put a blinking caret inside an answer block.
   *
   * MathLive only makes the caret visible while the field element carries the
   * `ML__focused` class, and it adds that class during a *render*, gated on
   * `isSelectionEditable && hasFocus()`. In a read-only field only prompt
   * interiors are editable, so the two things both have to be true:
   *
   *  - the selection must sit inside a prompt, and
   *  - a render must run afterwards.
   *
   * Assigning `selection` satisfies the first but not the second - it updates
   * the model without re-rendering, so the class stays off and the caret span
   * remains `visibility: hidden`. Executing any command does trigger the
   * render, and `scrollIntoView` is the one with no other effect: it keeps the
   * caret on screen, which the preceding `focus()` already does anyway.
   *
   * @param {string} [id] prompt to focus; defaults to the first one
   */
  focusPrompt(id) {
    if (!this.mathField) {
      return;
    }

    const ids = this.mathField.getPrompts() || [];
    const target = id && ids.indexOf(id) !== -1 ? id : ids[0];

    if (!target) {
      return;
    }

    const range = this.mathField.getPromptRange(target);

    if (!range) {
      return;
    }

    this.mathField.selection = { ranges: [[range[0], range[0]]] };

    if (typeof this.mathField.executeCommand === 'function') {
      this.mathField.executeCommand('scrollIntoView');
    }
  }

  focus() {
    if (!this.mathField) {
      return;
    }

    this.mathField.focus();

    // A bare focus() leaves the selection outside every prompt, which in a
    // read-only field is not editable - the block looked focused but had no
    // cursor. Clicking a prompt already works, because MathLive's own pointer
    // handling moves the selection and re-renders.
    if (!this.promptContaining(this.mathField.position)) {
      this.focusPrompt();
    }
  }

  blur() {
    this.mathField && this.mathField.blur();
  }

  render() {
    const { className, onFocus, onBlur } = this.props;
    const { markup } = this.state;

    if (this.mathField || this.isInteractive()) {
      return <Holder className={className} onFocus={onFocus} onBlur={onBlur} ref={this.holderRef} />;
    }

    return (
      <Holder
        className={className}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={this.holderRef}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }
}
