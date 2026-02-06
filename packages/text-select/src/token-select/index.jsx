import React from 'react';
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
    margin: 0,
  },
}));

// strip HTML tags for plain text rendering
const stripHtmlTags = (text) => {
  if (!text) {
    return text;
  }

  return text.replace(/<[^>]+>/g, '');
};

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

  /** Build a React tree instead of an HTML string so Emotion can inject CSS */
  generateTokensNodes = () => {
    const { tokens, disabled, highlightChoices, animationsDisabled } = this.props;
    const selectedCount = this.selectedCount();

    const isLineBreak = (text) => text === '\n';
    const isNewParagraph = (text) => text === '\n\n';

    const paragraphs = [];
    let currentChildren = [];

    const flushParagraph = () => {
      // Always push a <p>, even if empty, to mirror previous behavior
      paragraphs.push(<p key={`p-${paragraphs.length}`}>{currentChildren}</p>);
      currentChildren = [];
    };

    (tokens || []).forEach((t, index) => {
      const selectable = t.selected || (t.selectable && this.canSelectMore(selectedCount));
      const showCorrectAnswer = t.correct !== undefined && (t.selectable || t.selected);

      if (isNewParagraph(t.text)) {
        flushParagraph();
        return;
      }

      if (isLineBreak(t.text)) {
        currentChildren.push(<br key={`br-${index}`} />);
        return;
      }

      if (
        (selectable && !disabled) ||
        showCorrectAnswer ||
        t.selected ||
        t.isMissing ||
        (animationsDisabled && t.predefined) // print mode
      ) {
        currentChildren.push(
          <Token
            key={index}
            disabled={disabled}
            index={index}
            {...t}
            text={stripHtmlTags(t.text)}
            selectable={selectable}
            highlight={highlightChoices}
            animationsDisabled={animationsDisabled}
          />,
        );
      } else {
        // raw text node – React will escape as needed
        currentChildren.push(<React.Fragment key={index}>{stripHtmlTags(t.text)}</React.Fragment>);
      }
    });

    // flush last paragraph
    flushParagraph();

    return paragraphs;
  };

  render() {
    const { className: classNameProp } = this.props;
    const nodes = this.generateTokensNodes();

    return (
      <StyledTokenSelect className={classNameProp} onClick={this.toggleToken}>
        {nodes}
      </StyledTokenSelect>
    );
  }
}

export default TokenSelect;
