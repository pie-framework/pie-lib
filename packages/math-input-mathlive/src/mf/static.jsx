import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import debug from 'debug';
import { loadMathLive, getMacros, latexToMarkup } from '../mathlive-instance';
import { toMathLive, fromMathLive, fieldIds } from '../latex-bridge';
import { placeholderStyles } from './common-styles';

const log = debug('pie-lib:math-input-mathlive:static');

const Holder = styled('span')({
  display: 'inline-block',
  // Shared static-math rules: muted empty-slot glyphs and svg containment.
  ...placeholderStyles,
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
    if (!this.isInteractive()) {
      await loadMathLive();
      this.renderMarkup();
      return;
    }

    const ml = await loadMathLive();

    if (!ml || !this.holderRef.current) {
      return;
    }

    this.mathField = new ml.MathfieldElement({ macros: getMacros() });
    this.mathField.readOnly = true;
    this.mathField.mathVirtualKeyboardPolicy = 'manual';
    this.mathField.value = toMathLive(this.props.latex);

    this.mathField.addEventListener('input', this.onPromptInput);
    this.mathField.addEventListener('focusin', this.onPromptFocus);
    this.mathField.addEventListener('keydown', this.onKeyDown);

    this.holderRef.current.appendChild(this.mathField);

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

  focus() {
    this.mathField && this.mathField.focus();
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
