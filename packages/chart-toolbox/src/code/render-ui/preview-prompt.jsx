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
    defaultClassName: PropTypes.string,
  };

  static defaultProps = {
    onClick: () => {},
  };

  parsedText = (text) => {
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

  componentDidUpdate() {
    // set image parent style so it can be horizontally aligned
    const previewPrompt = document.querySelector('#preview-prompt');
    const images = previewPrompt && previewPrompt.getElementsByTagName('img');

    if (images && images.length) {
      for (let image of images) {
        // check if alignment property was set
        if (image.attributes && image.attributes.alignment && image.attributes.alignment.value) {
          const parentNode = image.parentElement;

          // check if div is not already added to dom and replace current image with wrapped image
          if (
            !(parentNode.tagName === 'DIV' && parentNode.style.display === 'flex' && parentNode.style.width === '100%')
          ) {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.width = '100%';

            const copyImage = image.cloneNode(true);
            div.appendChild(copyImage);
            parentNode.replaceChild(div, image);
          }
        }
      }
    }
  }

  render() {
    const { prompt, classes, tagName, className, onClick, defaultClassName } = this.props;
    const CustomTag = tagName || 'div';
    // legend tag was added once with accessibility tasks, wee need extra style to make it work with images alignment
    const legendClass = tagName === 'legend' ? 'legend' : '';
    const customClasses = `${classes.promptTable} ${classes[className] || ''} ${defaultClassName || ''} ${classes[
      legendClass
    ] || ''}`;

    return (
      <CustomTag
        id={'preview-prompt'}
        onClick={onClick}
        className={customClasses}
        dangerouslySetInnerHTML={{
          __html: this.parsedText(prompt || '').replace(NEWLINE_BLOCK_REGEX, NEWLINE_LATEX),
        }}
      />
    );
  }
}

const styles = (theme) => ({
  prompt: {
    verticalAlign: 'middle',
    color: color.text(),
  },
  legend: {
    width: '100%',
    fontSize: 'inherit  !important',
  },
  rationale: {
    paddingLeft: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit,
  },
  label: {
    color: `${color.text()} !important`, //'var(--choice-input-color, black)',
    display: 'inline-block',
    verticalAlign: 'middle',
    cursor: 'pointer',
    '& > p': {
      margin: '0 0 0 0 !important',
    },
  },
  promptTable: {
    '&:not(.MathJax) > table': {
      borderCollapse: 'collapse',
    },
    '&:not(.MathJax) > table tr': {
      '&:nth-child(2n)': {
        backgroundColor: '#f6f8fa',
      },
    },
    '&:not(.MathJax) > table td, &:not(.MathJax) > table th': {
      padding: '.6em 1em',
      textAlign: 'center',
    },
  },
});
export default withStyles(styles)(PreviewPrompt);
