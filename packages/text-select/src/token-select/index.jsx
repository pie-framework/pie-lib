import React from 'react';
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';
import Token, { TokenTypes } from './token';
import { styled } from '@mui/material/styles';
import { clone, isEqual } from 'lodash-es';
import debug from 'debug';
import { noSelect } from '@pie-lib/style-utils';

const log = debug('@pie-lib:text-select:token-select');

const StyledTokenSelect = styled('div')(() => ({
  backgroundColor: 'none',
  whiteSpace: 'pre',
  ...noSelect(),
  '& p': {
    whiteSpace: 'break-spaces',
  },
}));

// Invisible container whose only job is to make Emotion inject CSS for all Token variants.
// renderToString produces correct class names but never triggers Emotion's DOM-side injection,
// so without this the class names exist in the HTML but have no matching CSS rules.
const HiddenCssPrimer = styled('div')(() => ({
  display: 'none',
  position: 'absolute',
  visibility: 'hidden',
  pointerEvents: 'none',
}));

const normalizeCommonEntities = (text = '') => text.replace(/&nbsp;/gi, '\u00a0');

const normalizeSelectableText = (text = '') =>
  normalizeCommonEntities(text)
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(table|tbody|tr|td|p)[^>]*>/gi, '');

export class TokenSelect extends React.Component {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.shape(TokenTypes)).isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    highlightChoices: PropTypes.bool,
    animationsDisabled: PropTypes.bool,
    maxNoOfSelections: PropTypes.number,
  };

  static defaultProps = {
    highlightChoices: false,
    maxNoOfSelections: 0,
    tokens: [],
  };

  selectedCount = () => this.props.tokens.filter((t) => t.selected).length;

  canSelectMore = (selectedCount) => {
    const { maxNoOfSelections } = this.props;

    if (maxNoOfSelections === 1) return true;

    log('[canSelectMore] maxNoOfSelections: ', maxNoOfSelections, 'selectedCount: ', selectedCount);
    return maxNoOfSelections <= 0 || (isFinite(maxNoOfSelections) && selectedCount < maxNoOfSelections);
  };

  toggleToken = (event) => {
    const { target } = event;
    const { tokens, animationsDisabled } = this.props;
    const tokensCloned = clone(tokens);

    const targetSpanWrapper = target.closest?.(`.${Token.rootClassName}`);
    const targetedTokenIndex = targetSpanWrapper?.dataset?.indexkey;
    const t = targetedTokenIndex !== undefined ? tokensCloned[targetedTokenIndex] : undefined;

    // don't toggle if in print mode, correctness is defined, or is missing
    if (t && t.correct === undefined && !animationsDisabled && !t.isMissing) {
      const { onChange, maxNoOfSelections } = this.props;
      const selected = !t.selected;

      if (maxNoOfSelections === 1 && this.selectedCount() === 1) {
        const selectedToken = (tokens || []).filter((tk) => tk.selected);
        const updatedTokens = tokensCloned.map((token) => {
          if (isEqual(token, selectedToken[0])) {
            return { ...token, selected: false };
          }
          return { ...token, selectable: true };
        });

        const update = { ...t, selected };
        updatedTokens.splice(targetedTokenIndex, 1, update);
        onChange(updatedTokens);
      } else {
        if (selected && maxNoOfSelections > 0 && this.selectedCount() >= maxNoOfSelections) {
          log('skip toggle max reached');
          return;
        }
        const update = { ...t, selected };
        tokensCloned.splice(targetedTokenIndex, 1, update);
        onChange(tokensCloned);
      }
    }
  };

  /**
   * Build an HTML string so that non-selectable token text (which may contain arbitrary or even
   * *partial* HTML — e.g. just an opening <table><tbody><tr><td> in one token and the matching
   * closing tags in another) is preserved exactly as-is.  Selectable Token components are
   * serialised via renderToString; their Emotion class names are stable hashes so they match the
   * CSS that the HiddenCssPrimer forces Emotion to inject into the document.
   */
  generateTokensInHtml = () => {
    const { tokens, disabled, highlightChoices, animationsDisabled } = this.props;
    const selectedCount = this.selectedCount();

    const reducer = (accumulator, t, index) => {
      const selectable = t.selected || (t.selectable && this.canSelectMore(selectedCount));
      const showCorrectAnswer = t.correct !== undefined && (t.selectable || t.selected);

      if (t.text === '\n\n') return `${accumulator}</p><p>`;

      if (t.text === '\n') return `${accumulator}<br>`;

      if (
        (selectable && !disabled) ||
        showCorrectAnswer ||
        t.selected ||
        t.isMissing ||
        (animationsDisabled && t.predefined)
      ) {
        return (
          accumulator +
          renderToString(
            <Token
              key={index}
              disabled={disabled}
              index={index}
              {...t}
              text={normalizeSelectableText(t.text)}
              selectable={selectable}
              highlight={highlightChoices}
              animationsDisabled={animationsDisabled}
            />,
          )
        );
      }

      // Non-selectable: emit raw HTML unchanged (may contain partial tags, tables, lists, etc.)
      return accumulator + normalizeCommonEntities(t.text);
    };

    return (tokens || []).reduce(reducer, '<p>') + '</p>';
  };

  render() {
    const { className: classNameProp } = this.props;
    const html = this.generateTokensInHtml();

    // Render one invisible Token per visual variant so Emotion injects all CSS rules into the
    // document before the browser paints the dangerouslySetInnerHTML content.
    const primerText = ' ';
    return (
      <>
        <HiddenCssPrimer aria-hidden="true">
          {/* base / selectable */}
          <Token
            text={primerText}
            index={-1}
            selectable
            disabled={false}
            highlight={false}
            animationsDisabled={false}
          />
          {/* highlight */}
          <Token text={primerText} index={-1} selectable disabled={false} highlight animationsDisabled={false} />
          {/* selected */}
          <Token
            text={primerText}
            index={-1}
            selectable
            selected
            disabled={false}
            highlight={false}
            animationsDisabled={false}
          />
          {/* disabled + selected */}
          <Token
            text={primerText}
            index={-1}
            selectable
            selected
            disabled
            highlight={false}
            animationsDisabled={false}
          />
          {/* print / animationsDisabled */}
          <Token
            text={primerText}
            index={-1}
            selectable
            disabled={false}
            highlight={false}
            animationsDisabled
            predefined
          />
          {/* correct */}
          <Token
            text={primerText}
            index={-1}
            selectable
            selected
            correct
            disabled={false}
            highlight={false}
            animationsDisabled={false}
          />
          {/* incorrect */}
          <Token
            text={primerText}
            index={-1}
            selectable
            selected
            correct={false}
            disabled={false}
            highlight={false}
            animationsDisabled={false}
          />
          {/* missing */}
          <Token text={primerText} index={-1} isMissing disabled={false} highlight={false} animationsDisabled={false} />
        </HiddenCssPrimer>

        <StyledTokenSelect
          className={classNameProp}
          onClick={this.toggleToken}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </>
    );
  }
}

export default TokenSelect;
