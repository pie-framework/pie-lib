import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { alpha, lighten, styled } from '@mui/material/styles';
import { indigo, pink } from '@mui/material/colors';
import debug from 'debug';
import { flatten } from 'lodash-es';
import { color } from '@pie-lib/render-ui';

import * as mq from '../mq';
import { baseSet } from '../keys';
import { commonMqKeyboardStyles } from '../mq/common-mq-styles';
import { sortKeys } from './keys-layout';

const log = debug('pie-lib:math-inline:keypad');

const LatexButtonContent = styled(mq.Static)(({ latex }) => {
  const baseStyles = {
    pointerEvents: 'none',
    textTransform: 'none !important',
    color: color.text(),
    '& .mq-scaled.mq-sqrt-prefix': {
      transform: 'scale(1, 0.9) !important',
    },
    '& .mq-sup-only .mq-sup': {
      marginBottom: '0.9px !important',
    },
    '& .mq-empty': {
      backgroundColor: `${alpha(pink[300], 0.4)} !important`,
    },
    '& .mq-overline .mq-overline-inner': {
      borderTop: '2px solid black',
    },
    '& .mq-non-leaf.mq-overline': {
      borderTop: 'none !important',
    },
    '& .mq-overarrow': {
      width: '30px',
      marginTop: '0 !important',
      borderTop: '2px solid black',
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
      '&.mq-arrow-both': {
        top: '0px !important',
        '& *': {
          lineHeight: '1 !important',
          borderTop: 'none !important',
        },
        '&:before': {
          fontSize: '80%',
          left: 'calc(-13%) !important',
          top: '-0.31em !important',
        },
        '&:after': {
          fontSize: '80% !important',
          right: 'calc(-13%) !important',
          top: '-1.5em',
        },
        '&.mq-empty:before': {
          fontSize: '80%',
          left: 'calc(-13%)',
          top: '-0.26em',
        },
        '&.mq-empty:after': {
          fontSize: '80%',
          right: 'calc(-13%)',
          top: '-0.26em',
        },
        '&.mq-empty': {
          minHeight: '1.4em',
        },
      },
      '&.mq-arrow-right:before': {
        fontSize: '80%',
        right: 'calc(-13%) !important',
        top: '-0.26em !important',
      },
      '& .mq-overarrow-inner': {
        border: 'none !important',
      },
      '& .mq-overarrow-inner .mq-overarrow-inner-right': {
        display: 'none !important',
      },
    },
    '& .mq-root-block': {
      padding: '5px !important',
    },
    '& .mq-overarrow.mq-arrow-both.mq-empty:after': {
      right: '-6px',
      fontSize: '80% !important',
      top: '-3px',
    },
    '& .mq-overarrow.mq-arrow-right.mq-empty:before': {
      right: '-5px',
      fontSize: '80% !important',
      top: '-3px',
    },
    '& .mq-overarrow.mq-arrow-both.mq-empty:before': {
      left: '-6px',
      fontSize: '80% !important',
      top: '-3px',
    },
    '& .mq-longdiv-inner': {
      borderTop: '1px solid !important',
      paddingTop: '1.5px !important',
    },
    '& .mq-parallelogram': {
      lineHeight: 0.85,
    },
    '& .mq-overarc': {
      borderTop: '2px solid black !important',
      '& .mq-overline': {
        borderTop: 'none !important',
      },
      '& .mq-overline-inner': {
        borderTop: 'none !important',
        paddingTop: '0 !important',
      },
    },
  };

  // Add specific styles based on latex content
  if (latex === '\\parallel') {
    return {
      ...baseStyles,
      fontStyle: 'italic !important',
    };
  }

  if (latex === '\\overleftrightarrow{\\overline{}}') {
    return {
      ...baseStyles,
      '& .mq-overarrow.mq-arrow-both': {
        '& .mq-overline-inner': {
          borderTop: 'none !important',
          paddingTop: '0 !important',
        },
        '&:after': {
          position: 'absolute !important',
          top: '0px !important',
        },
      },
    };
  }

  return baseStyles;
});

LatexButtonContent.propTypes = {
  latex: PropTypes.string.isRequired,
};

// LatexButton component removed - LatexButtonContent is used directly instead

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
  ...commonMqKeyboardStyles,
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

const StyledButton = styled(Button)(({ category, isDelete, isComma, isDot }) => ({
  minWidth: 'auto',
  fontSize: isComma || isDot ? '200% !important' : '140% !important',
  lineHeight: isComma || isDot ? '100%' : 'normal',
  color: color.text(),

  backgroundColor:
    category === 'operators'
      ? lighten(pink[300], 0.5)
      : // this code with green seems to not be applied to current implementation, so I commented it out, but left it here just in case
        // category === 'comparison' ? lighten(green[500], 0.5) :
        lighten(indigo[300], 0.5),
  '&:hover': {
    backgroundColor:
      category === 'operators'
        ? lighten(pink[300], 0.7)
        : // category === 'comparison' ? lighten(green[500], 0.7) :
          lighten(indigo[300], 0.7),
  },
  borderRadius: 0,
  ...(isDelete && {
    '& > span': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
    },
  }),
}));

const StyledLatexButtonWrapper = styled(Button)(({ category }) => ({
  textTransform: 'none',
  padding: 0,
  margin: 0,
  fontSize: '110% !important',
  minWidth: 'auto',
  borderRadius: 0,
  backgroundColor:
    category === 'operators'
      ? lighten(pink[300], 0.5)
      : // category === 'comparison' ? lighten(green[500], 0.5) :
        lighten(indigo[300], 0.5),
  '&:hover': {
    backgroundColor:
      category === 'operators'
        ? lighten(pink[300], 0.7)
        : // category === 'comparison' ? lighten(green[500], 0.7) :
          lighten(indigo[300], 0.7),
  },
}));

const StyledIconButton = styled(IconButton)(({ category }) => ({
  minWidth: 'auto',
  backgroundColor:
    category === 'operators'
      ? lighten(pink[300], 0.5)
      : // category === 'comparison' ? lighten(green[500], 0.5) :
        lighten(indigo[300], 0.5),
  '&:hover': {
    backgroundColor:
      category === 'operators'
        ? lighten(pink[300], 0.7)
        : // category === 'comparison' ? lighten(green[500], 0.7) :
          lighten(indigo[300], 0.7),
  },
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
        // increase the height of the main container if keyboard needs it
        if (mainContainer) {
          mainContainer.style.height = `${totalHeight}px`;
        }
      }
    }

    if (keyPadElement) {
      keyPadElement.addEventListener('touchstart', this.handleKeypadInteraction, true);
      keyPadElement.addEventListener('mousedown', this.handleKeypadInteraction, true);
    }
  }

  componentWillUnmount() {
    const keyPadElement = this.keypadRef?.current;
    // need only for math keyboard
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
    // Check if the setKeypadInteraction prop is available, which is used for both
    // the language keypad and the special characters keypad
    if (this.props.setKeypadInteraction) {
      this.props.setKeypadInteraction(true);
    }
  };

  buttonClick = (key) => {
    log('[buttonClick]', key);
    const { onPress } = this.props;

    onPress(key);
  };

  flowKeys = (base, extras) => {
    const transposed = [...sortKeys(base), ...sortKeys(extras)];
    return flatten(transposed);
  };

  keyIsNotAllowed = (key) => {
    const { noDecimal } = this.props;

    if (((key.write === '.' && key.label === '.') || (key.write === ',' && key.label === ',')) && noDecimal) {
      return true;
    }

    return false;
  };

  render() {
    const { className, baseSet, additionalKeys, layoutForKeyPad, onFocus, mode } = this.props;

    const noBaseSet = ['non-negative-integers', 'integers', 'decimals', 'fractions', 'item-authoring', 'language'];

    const keysWithoutBaseSet = noBaseSet.includes(mode);
    const allKeys = keysWithoutBaseSet
      ? this.flowKeys([], additionalKeys || [])
      : this.flowKeys(baseSet, additionalKeys || []);

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
          const onClick = this.buttonClick.bind(this, k);

          if (!k) {
            return <span key={`empty-${index}`} />;
          }

          const common = {
            onClick,
            disabled: this.keyIsNotAllowed(k),
            key: `${k.label || k.latex || k.command}-${index}`,
            ...(k.actions || {}),
            ...(k.extraProps || {}),
          };

          if (k.latex) {
            return (
              <StyledLatexButtonWrapper
                key={common.key}
                onClick={common.onClick}
                disabled={common.disabled}
                category={!keysWithoutBaseSet ? k.category : undefined}
                aria-label={k.ariaLabel ? k.ariaLabel : k.name || k.label}
                {...(k.actions || {})}
                {...(k.extraProps || {})}
              >
                <LatexButtonContent latex={k.latex} />
              </StyledLatexButtonWrapper>
            );
          }

          if (k.label) {
            return (
              <StyledButton
                key={common.key}
                onClick={common.onClick}
                disabled={common.disabled}
                category={!keysWithoutBaseSet ? k.category : undefined}
                isDelete={k.label === '⌫'}
                isComma={k.label === ','}
                isDot={k.label === '.'}
                aria-label={k.ariaLabel ? k.ariaLabel : k.name || k.label}
                {...(k.actions || {})}
                {...(k.extraProps || {})}
              >
                {k.label}
              </StyledButton>
            );
          } else {
            const Icon = k.icon ? k.icon : 'div';

            return (
              <StyledIconButton
                key={common.key}
                tabIndex={'-1'}
                onClick={common.onClick}
                disabled={common.disabled}
                category={!keysWithoutBaseSet ? k.category : undefined}
                size="large"
                {...(k.actions || {})}
                {...(k.extraProps || {})}
              >
                <Icon className="icon" />
              </StyledIconButton>
            );
          }
        })}
      </KeyPadContainer>
    );
  }
}

export default KeyPad;
