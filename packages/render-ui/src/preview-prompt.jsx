import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as color from './color';
import { renderMath } from '@pie-lib/math-rendering';

const StyledPromptContainer = styled('div')(({ theme, tagName }) => ({
  // presentation tables should not have any custom style
  // Base promptTable styles
  '&:not(.MathJax) > table:not([role="presentation"])': {
    borderCollapse: 'collapse',
  },
  /*
   * The editor writes border="1", and the UA answers it with `border-style: outset`
   * on the table and `inset` on the cells -- which browsers paint as synthesized 3D
   * shades rather than the colour the border resolves to, so the grid comes out grey
   * on every scheme (1.19:1 on black-on-violet). `solid` is what removes the
   * shading; without it, setting the colour has no effect.
   */
  '&:not(.MathJax) table[border]:not([role="presentation"]), &:not(.MathJax) table[border]:not([role="presentation"]) td, &:not(.MathJax) table[border]:not([role="presentation"]) th':
    {
      borderStyle: 'solid',
      borderColor: color.tableGrid(),
    },
  // Apply vertical striping when first column is a header (th) and NOT mixed with td.
  // Ink stays at 5.44:1 or better on tableStripe in every scheme, so the cell inherits
  // its text colour rather than pinning the `color: black` this used to carry.
  '&:not(.MathJax) > table:not([role="presentation"]):has(tbody tr > th:first-child):not(:has(tbody tr > td:first-child)) tbody td:nth-child(even)':
    {
      backgroundColor: color.tableStripe(),
    },
  // Apply horizontal striping for tables where first element is a data cell (td)
  '&:not(.MathJax) > table:not([role="presentation"]):has(tbody tr > td:first-child) tbody tr:nth-child(even) td': {
    backgroundColor: color.tableStripe(),
  },
  // align table content to left as per STAR requirement PD-3687
  '&:not(.MathJax) table:not([role="presentation"]) td, &:not(.MathJax) table:not([role="presentation"]) th': {
    padding: '.6em 1em',
    textAlign: 'left',
  },
  // added this to fix alignment of text in prompt imported from studio (PD-3423)
  '&:not(.MathJax) > table td > p.kds-indent': {
    textAlign: 'initial',
  },

  // Conditional styles based on class names
  '&.prompt': {
    verticalAlign: 'middle',
    color: color.text(),
  },
  '&.legend': {
    width: '100%',
    fontSize: 'inherit !important',
  },
  '&.rationale': {
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
  '&.prompt-label': {
    color: `${color.text()} !important`,
    display: 'flex',
    flexDirection: 'column',
    verticalAlign: 'middle',
    cursor: 'pointer',
    '& > p': {
      margin: '0 0 0 0 !important',
    },
  },
}));

//Used these below to replace \\embed{newLine} with \\newline from prompt which will get parsed in MathJax
const NEWLINE_BLOCK_REGEX = /\\embed\{newLine\}\[\]/g;
const NEWLINE_LATEX = '\\newline ';

// stable hook for 'is this node inside a prompt' checks - a class rather than an id,
// so it stays valid when a page renders more than one prompt
const PROMPT_CLASS = 'preview-prompt';

export class PreviewPrompt extends Component {
  static propTypes = {
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

  promptRef = React.createRef();

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
    this.setupMathRendering();
  }

  componentDidUpdate(prevProps) {
    this.alignImages();

    if (prevProps.prompt !== this.props.prompt) {
      this.renderMathContent();
    }
  }

  componentWillUnmount() {
    this.removeCustomAudioButtonListeners();
  }

  setupMathRendering() {
    this.renderMathContent();
  }

  renderMathContent() {
    const container = this.promptRef.current;
    if (container && typeof renderMath === 'function') {
      renderMath(container);
    }
  }

  alignImages() {
    const previewPrompt = this.promptRef.current;

    if (!previewPrompt) {
      return;
    }

    const images = previewPrompt.getElementsByTagName('img');

    if (images && images.length) {
      for (let image of images) {
        if (image.attributes && image.attributes.alignment && image.attributes.alignment.value) {
          const alignment = image.attributes.alignment.value;
          const justifyContent =
            alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start';

          const parentNode = image.parentElement;

          if (
            parentNode.tagName === 'DIV' &&
            parentNode.style.display === 'flex' &&
            parentNode.style.width === '100%'
          ) {
            parentNode.style.justifyContent = justifyContent;
          } else {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.width = '100%';
            div.style.justifyContent = justifyContent;

            const copyImage = image.cloneNode(true);
            div.appendChild(copyImage);
            parentNode.replaceChild(div, image);
          }
        }
      }
    }
  }

  render() {
    const { prompt, tagName, className, onClick, defaultClassName } = this.props;
    // legend tag was added once with accessibility tasks, we need extra style to make it work with images alignment
    const legendClass = tagName === 'legend' ? 'legend' : '';
    const customClasses = `${className || ''} ${defaultClassName || ''} ${legendClass} ${PROMPT_CLASS}`.trim();

    return (
      <StyledPromptContainer
        as={tagName || 'div'}
        ref={this.promptRef}
        onClick={onClick}
        className={customClasses}
        tagName={tagName}
        dangerouslySetInnerHTML={{
          __html: this.parsedText(prompt || '').replace(NEWLINE_BLOCK_REGEX, NEWLINE_LATEX),
        }}
      />
    );
  }
}

export default PreviewPrompt;
