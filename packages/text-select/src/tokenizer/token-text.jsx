import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { normalize, intersection } from './builder';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';
import debug from 'debug';
import classNames from 'classnames';

import { clearSelection, getCaretCharacterOffsetWithin } from './selection-utils';

const log = debug('@pie-lib:text-select:token-text');

export const Text = withStyles(() => ({
  predefined: {
    cursor: 'pointer',
    backgroundColor: yellow[100],
    border: `dashed 0px ${yellow[700]}`
  },
  correct: {
    backgroundColor: green[500]
  }
}))(({ text, predefined, classes, onClick, correct }) => {
  const formattedText = (text || '').replace(/\n/g, '<br>');

  if (predefined) {
    const className = classNames(classes.predefined, correct && classes.correct);

    return (
      <span
        onClick={onClick}
        className={className}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  } else {
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  }
});

export default class TokenText extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    tokens: PropTypes.array.isRequired,
    onTokenClick: PropTypes.func.isRequired,
    onSelectToken: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  mouseUp = event => {
    event.preventDefault();
    const { onSelectToken, text, tokens } = this.props;

    if (typeof window === 'undefined') {
      return;
    }

    const selection = window.getSelection();
    const textSelected = selection.toString();

    if (textSelected.length > 0) {
      if (this.root) {
        const offset = getCaretCharacterOffsetWithin(this.root);
        if (offset !== undefined) {
          const endIndex = offset + textSelected.length;

          if (endIndex <= text.length) {
            const i = intersection({ start: offset, end: endIndex }, tokens);
            if (i.hasOverlap) {
              log('hasOverlap  - do nothing');
              clearSelection();
            } else {
              const tokensToRemove = i.surroundedTokens;
              const token = {
                text: textSelected,
                start: offset,
                end: endIndex
              };

              onSelectToken(token, tokensToRemove);
              clearSelection();
            }
          }
        }
      }
    }
  };

  render() {
    const { text, tokens, className, onTokenClick } = this.props;

    const normalized = normalize(text, tokens);

    return (
      <div className={className} ref={r => (this.root = r)} onMouseUp={this.mouseUp}>
        {normalized.map((t, index) => {
          return <Text key={index} {...t} onClick={() => onTokenClick(t)} />;
        })}
      </div>
    );
  }
}
