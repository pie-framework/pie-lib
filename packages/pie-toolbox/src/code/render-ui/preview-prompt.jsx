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
    autoplayAudioEnabled: PropTypes.bool,
    customAudioButton: {
      playImage: PropTypes.string,
      pauseImage: PropTypes.string,
    },
  };

  static defaultProps = {
    onClick: () => {},
  };

  parsedText = (text) => {
    const { customAudioButton } = this.props;
    const div = document.createElement('div');
    div.innerHTML = text;

    const audio = div.querySelector('audio');
    if (audio) {
      const source = document.createElement('source');

      source.setAttribute('type', 'audio/mp3');
      source.setAttribute('src', audio.getAttribute('src'));

      audio.removeAttribute('src');
      audio.setAttribute('id', 'pie-prompt-audio-player');

      audio.appendChild(source);

      if (customAudioButton) {
        audio.style.display = 'none';

        const playButton = document.createElement('div');
        playButton.id = 'play-audio-button';

        Object.assign(playButton.style, {
          cursor: 'pointer',
          display: 'block',
          width: '128px',
          height: '128px',
          backgroundImage: `url(${customAudioButton.pauseImage})`,
          backgroundSize: 'cover',
          borderRadius: '50%',
          border: '1px solid #326295',
        });

        audio.parentNode.insertBefore(playButton, audio);
      }
    }

    return div.innerHTML;
  };

  addCustomAudioButtonControls() {
    const { autoplayAudioEnabled, customAudioButton } = this.props;
    const playButton = document.getElementById('play-audio-button');
    const audio = document.getElementById('pie-prompt-audio-player');

    if (autoplayAudioEnabled && audio) {
      audio
        .play()
        .then(() => {
          if (playButton && customAudioButton) {
            audio.addEventListener('ended', handleAudioEnded);
          }
        })
        .catch((error) => {
          console.error('Error playing audio', error);
        });
    }

    if (!playButton || !audio || !customAudioButton) return;

    const handlePlayClick = () => {
      // if already playing, don't play again
      if (!audio.paused) return;
      if (playButton.style.backgroundImage.includes(customAudioButton.pauseImage)) return;

      audio.play();
    };

    const handleAudioEnded = () => {
      playButton.style.backgroundImage = `url(${customAudioButton.playImage})`;
    };

    const handleAudioPlay = () => {
      Object.assign(playButton.style, {
        backgroundImage: `url(${customAudioButton.pauseImage})`,
        border: '1px solid #ccc',
      });
    };

    const handleAudioPause = () => {
      Object.assign(playButton.style, {
        backgroundImage: `url(${customAudioButton.playImage})`,
        border: '1px solid #326295',
      });
    };

    playButton.addEventListener('click', handlePlayClick);
    audio.addEventListener('play', handleAudioPlay);
    audio.addEventListener('pause', handleAudioPause);
    audio.addEventListener('ended', handleAudioEnded);

    // store event handler references so they can be removed later
    this._handlePlayClick = handlePlayClick;
    this._handleAudioPlay = handleAudioPlay;
    this._handleAudioPause = handleAudioPause;
    this._handleAudioEnded = handleAudioEnded;
  }

  removeCustomAudioButtonListeners() {
    const playButton = document.getElementById('play-audio-button');
    const audio = document.querySelector('audio');

    if (!playButton || !audio) return;

    // remove event listeners using stored references
    playButton.removeEventListener('click', this._handlePlayClick);
    audio.removeEventListener('play', this._handleAudioPlay);
    audio.removeEventListener('pause', this._handleAudioPause);
    audio.removeEventListener('ended', this._handleAudioEnded);
  }

  componentDidMount() {
    this.alignImages();
    this.addCustomAudioButtonControls();
  }

  componentDidUpdate() {
    this.alignImages();
  }

  componentWillUnmount() {
    this.removeCustomAudioButtonListeners();
  }

  alignImages() {
    const previewPrompts = document.querySelectorAll('#preview-prompt');

    previewPrompts.forEach((previewPrompt) => {
      const images = previewPrompt.getElementsByTagName('img');

      if (images && images.length) {
        for (let image of images) {
          // check if alignment property was set
          if (image.attributes && image.attributes.alignment && image.attributes.alignment.value) {
            const parentNode = image.parentElement;

            // check if div is not already added to dom and replace current image with wrapped image
            if (
              !(
                parentNode.tagName === 'DIV' &&
                parentNode.style.display === 'flex' &&
                parentNode.style.width === '100%'
              )
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
    });
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
    display: 'flex',
    flexDirection: 'column',
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
    '&:not(.MathJax) > table td': {
      '&:nth-child(2n)': {
        backgroundColor: '#f6f8fa',
        color: theme.palette.common.black,
      },
    },
    // align table content to left as per STAR requirement PD-3687
    '&:not(.MathJax) table td, &:not(.MathJax) table th': {
      padding: '.6em 1em',
      textAlign: 'left',
    },
    // added this to fix alignment of text in prompt imported from studio (PD-3423)
    '&:not(.MathJax) > table td > p.kds-indent': {
      textAlign: 'initial',
    },
  },
});
export default withStyles(styles)(PreviewPrompt);
