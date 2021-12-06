import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as color from './color';

//Used these below to replace \\embed{newLine} with \\newline from prompt which will get parsed in MathJax
const NEWLINE_BLOCK_REGEX = /\\embed\{newLine\}\[\]/g;
const NEWLINE_LATEX = '\\newline ';

export class PreviewPrompt extends Component {
  static propTypes = {
    classes: PropTypes.object,
    prompt: PropTypes.string,
    tagName: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    defaultClassName: PropTypes.string
  };

  static defaultProps = {
    onClick: () => {}
  };

  parsedText = text => {
    // fix imported audio content for Safari PD-1419
    const div = document.createElement('div');
    div.innerHTML = text;

    const audio = div.querySelector('audio');
    if (audio) {
      const source = document.createElement('source');

      source.setAttribute('type', 'audio/mp3');
      source.setAttribute('src', audio.getAttribute('src'));

      audio.removeAttribute('src');
      audio.appendChild(source);
    }

    return div.innerHTML;
  };

  render() {
    const { prompt, classes, tagName, className, onClick, defaultClassName } = this.props;
    const CustomTag = tagName || 'div';
    const customClasses = `${classes.promptTable} ${classes[className] || ''} ${defaultClassName ||
      ''}`;

    return (
      <CustomTag
        onClick={onClick}
        className={customClasses}
        dangerouslySetInnerHTML={{
          __html: this.parsedText(prompt || '').replace(NEWLINE_BLOCK_REGEX, NEWLINE_LATEX)
        }}
      />
    );
  }
}

const styles = theme => ({
  prompt: {
    verticalAlign: 'middle',
    color: color.text()
  },
  rationale: {
    paddingLeft: theme.spacing.unit * 16
  },
  label: {
    color: `${color.text()} !important`, //'var(--choice-input-color, black)',
    display: 'inline-block',
    verticalAlign: 'middle',
    cursor: 'pointer'
  },
  promptTable: {
    '&:not(.MathJax) > table': {
      borderCollapse: 'collapse'
    },
    '&:not(.MathJax) > table tr': {
      borderTop: '1px solid #dfe2e5',
      '&:nth-child(2n)': {
        backgroundColor: '#f6f8fa'
      }
    },
    '&:not(.MathJax) > table td, &:not(.MathJax) > table th': {
      border: '1px solid #dfe2e5',
      padding: '.6em 1em',
      textAlign: 'center'
    }
  }
});
export default withStyles(styles)(PreviewPrompt);
