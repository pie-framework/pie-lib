import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import debug from 'debug';
import { flatten } from 'lodash-es';
import { color } from '@pie-lib/render-ui';

import { baseSet } from '../keys';
import { sortKeys } from './keys-layout';
import { commonKeyboardStyles } from '../mf/common-styles';
import { loadMathLive, latexToMarkup } from '../mathlive-instance';

const log = debug('pie-lib:math-input-mathlive:keypad');

/**
 * A LaTeX keypad label.
 *
 * The MathQuill implementation rendered every LaTeX label as its own
 * `MQ.StaticMath` instance. Here each label is static HTML produced once by
 * `convertLatexToMarkup`, so a 40-key keypad no longer creates 40 live math
 * instances.
 */
// The `color.*()` helpers must be called lazily, inside the styled callback.
// Evaluating them in a plain object literal runs them at module load, which
// breaks any consumer that mocks a subset of @pie-lib/render-ui.
const LabelHolder = styled('span')(() => ({
  pointerEvents: 'none',
  textTransform: 'none',
  color: color.text(),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  // Never let a label size its grid column. Stretchy accents
  // (\overrightarrow, \overleftrightarrow, \overarc) render an <svg> that
  // mathlive-static.css positions absolutely at width:100%; if that stylesheet
  // is missing the svg lays out statically and expands without bound, dragging
  // the whole column across the screen. `overflow: hidden` also collapses the
  // label's min-content contribution, so the grid can't blow out either way.
  maxWidth: '100%',
  overflow: 'hidden',
  '& svg': {
    position: 'absolute',
    width: '100%',
  },
  // Answer-block / empty-slot boxes inside a label.
  '& .ML__placeholder': {
    backgroundColor: color.keypadEmptyPlaceholder ? color.keypadEmptyPlaceholder() : undefined,
  },
}));

export class LatexLabel extends React.Component {
  static propTypes = {
    latex: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { markup: latexToMarkup(props.latex) };
  }

  async componentDidMount() {
    // MathLive may not have finished loading when the keypad first mounts.
    if (this.state.markup) {
      return;
    }

    await loadMathLive();

    if (this.unmounted) {
      return;
    }

    const markup = latexToMarkup(this.props.latex);

    if (markup) {
      this.setState({ markup });
      return;
    }

    // Still nothing: the engine is genuinely unavailable (a missing chunk, a
    // blocked request). Keep the raw-latex fallback visible rather than an
    // empty button, and log once so this is diagnosable.
    if (!LatexLabel.warned) {
      LatexLabel.warned = true;
      log('MathLive unavailable - keypad labels are falling back to raw latex');
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.latex !== this.props.latex) {
      this.setState({ markup: latexToMarkup(this.props.latex) });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { markup } = this.state;

    // Fall back to the raw latex so a button is never blank.
    return markup ? (
      // eslint-disable-next-line react/no-danger
      <LabelHolder dangerouslySetInnerHTML={{ __html: markup }} />
    ) : (
      <LabelHolder>{this.props.latex}</LabelHolder>
    );
  }
}

const createCustomLayout = (layoutObj) => {
  if (layoutObj) {
    return {
      gridTemplateColumns: `repeat(${layoutObj.columns}, minmax(min-content, 150px))`,
      gridTemplateRows: `repeat(${layoutObj.rows}, minmax(40px, 60px))`,
      gridAutoFlow: 'initial',
    };
  }

  return {};
};

const KeyPadContainer = styled('div')(() => ({
  ...commonKeyboardStyles,
  width: '100%',
  display: 'grid',
  gridTemplateRows: 'repeat(5, minmax(40px, 60px))',
  gridRowGap: '0px',
  gridColumnGap: '0px',
  gridAutoFlow: 'column',
  '&.character': {
    textTransform: 'initial !important',
    gridTemplateRows: 'repeat(5, minmax(40px, 50px)) !important',
  },
  '&.language': {
    gridTemplateRows: 'repeat(4, minmax(40px, 50px)) !important',
    '& *': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
    },
  },
}));

const buttonBackground = (category) => ({
  backgroundColor: category === 'operators' ? color.keypadButtonOperator() : color.keypadButton(),
  '&:hover': {
    backgroundColor: category === 'operators' ? color.keypadButtonOperatorHover() : color.keypadButtonHover(),
  },
});

const StyledButton = styled(Button)(({ category, isDelete, isComma, isDot }) => ({
  minWidth: 'auto',
  textTransform: 'none',
  fontSize: isComma || isDot ? '200% !important' : '140% !important',
  lineHeight: isComma || isDot ? '100%' : 'normal',
  color: color.text(),
  ...buttonBackground(category),
  borderRadius: 0,
  ...(isDelete && {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
  }),
}));

const StyledLatexButtonWrapper = styled(Button)(({ category }) => ({
  textTransform: 'none',
  padding: 0,
  margin: 0,
  fontSize: '110% !important',
  minWidth: 'auto',
  borderRadius: 0,
  ...buttonBackground(category),
}));

const StyledIconButton = styled(IconButton)(({ category }) => ({
  minWidth: 'auto',
  ...buttonBackground(category),
  borderRadius: 0,
  '& .icon': {
    height: '30px',
  },
}));

export class KeyPad extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    controlledKeypadMode: PropTypes.bool,
    baseSet: PropTypes.array,
    additionalKeys: PropTypes.array,
    layoutForKeyPad: PropTypes.object,
    onPress: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    noDecimal: PropTypes.bool,
    setKeypadInteraction: PropTypes.func,
    mode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    baseSet: baseSet,
    noDecimal: false,
  };

  constructor(props) {
    super(props);
    this.keypadRef = React.createRef();
  }

  componentDidMount() {
    // Ensure MathLive is available for the LaTeX labels.
    loadMathLive();

    const keyPadElement = this.keypadRef?.current;
    const mainContainer = keyPadElement?.closest('.main-container');
    const currentToolbar = keyPadElement?.closest('.pie-toolbar');

    // need only for math keyboard so we need also controlledKeypadMode
    if (this.props.controlledKeypadMode && mainContainer && currentToolbar) {
      const mainContainerPosition = mainContainer.getBoundingClientRect();
      const currentToolbarPosition = currentToolbar.getBoundingClientRect();
      const difference =
        mainContainerPosition.top +
        mainContainerPosition.height -
        (currentToolbarPosition.top + currentToolbarPosition.height);

      if (difference < 0) {
        const totalHeight = mainContainerPosition.height + mainContainerPosition.top - difference;

        mainContainer.style.height = `${totalHeight}px`;
      }
    }

    if (keyPadElement) {
      keyPadElement.addEventListener('touchstart', this.handleKeypadInteraction, true);
      keyPadElement.addEventListener('mousedown', this.handleKeypadInteraction, true);
    }
  }

  componentWillUnmount() {
    const keyPadElement = this.keypadRef?.current;

    if (this.props.controlledKeypadMode && keyPadElement) {
      const mainContainer = keyPadElement.closest('.main-container');

      if (mainContainer) {
        mainContainer.style.height = 'unset';
      }
    }

    if (keyPadElement) {
      keyPadElement.removeEventListener('touchstart', this.handleKeypadInteraction, true);
      keyPadElement.removeEventListener('mousedown', this.handleKeypadInteraction, true);
    }
  }

  handleKeypadInteraction = () => {
    if (this.props.setKeypadInteraction) {
      this.props.setKeypadInteraction(true);
    }
  };

  buttonClick = (key) => {
    log('[buttonClick]', key);
    this.props.onPress(key);
  };

  flowKeys = (base, extras) => flatten([...sortKeys(base), ...sortKeys(extras)]);

  keyIsNotAllowed = (key) => {
    const { noDecimal } = this.props;

    return !!(((key.write === '.' && key.label === '.') || (key.write === ',' && key.label === ',')) && noDecimal);
  };

  render() {
    const { className, baseSet: base, additionalKeys, layoutForKeyPad, onFocus, mode } = this.props;

    const noBaseSet = ['non-negative-integers', 'integers', 'decimals', 'fractions', 'item-authoring', 'language'];
    const keysWithoutBaseSet = noBaseSet.includes(mode);
    const allKeys = keysWithoutBaseSet
      ? this.flowKeys([], additionalKeys || [])
      : this.flowKeys(base, additionalKeys || []);

    const shift = allKeys.length % 5 ? 1 : 0;
    const style = {
      gridTemplateColumns: `repeat(${Math.floor(allKeys.length / 5) + shift}, minmax(min-content, 150px))`,
      ...createCustomLayout(layoutForKeyPad),
    };

    return (
      <KeyPadContainer
        ref={this.keypadRef}
        className={[className, mode].filter(Boolean).join(' ')}
        style={style}
        onFocus={onFocus}
      >
        {allKeys.map((k, index) => {
          if (!k) {
            return <span key={`empty-${index}`} />;
          }

          const key = `${k.label || k.latex || k.command}-${index}`;
          const category = !keysWithoutBaseSet ? k.category : undefined;
          const extra = { ...(k.actions || {}), ...(k.extraProps || {}) };
          const onClick = this.buttonClick.bind(this, k);
          const disabled = this.keyIsNotAllowed(k);
          const ariaLabel = k.ariaLabel ? k.ariaLabel : k.name || k.label;

          if (k.latex) {
            return (
              <StyledLatexButtonWrapper
                key={key}
                onClick={onClick}
                disabled={disabled}
                category={category}
                aria-label={ariaLabel}
                {...extra}
              >
                <LatexLabel latex={k.latex} />
              </StyledLatexButtonWrapper>
            );
          }

          if (k.label) {
            return (
              <StyledButton
                key={key}
                onClick={onClick}
                disabled={disabled}
                category={category}
                isDelete={k.label === '⌫'}
                isComma={k.label === ','}
                isDot={k.label === '.'}
                aria-label={ariaLabel}
                {...extra}
              >
                {k.label}
              </StyledButton>
            );
          }

          const Icon = k.icon ? k.icon : 'div';

          return (
            <StyledIconButton
              key={key}
              tabIndex={'-1'}
              onClick={onClick}
              disabled={disabled}
              category={category}
              size="large"
              {...extra}
            >
              <Icon className="icon" />
            </StyledIconButton>
          );
        })}
      </KeyPadContainer>
    );
  }
}

export default KeyPad;
