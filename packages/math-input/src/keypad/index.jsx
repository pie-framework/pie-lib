import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { lighten, fade } from '@material-ui/core/styles/colorManipulator';
import green from '@material-ui/core/colors/green';
import { sortKeys } from './keys-layout';
import * as mq from '../mq';
import { baseSet } from '../keys';
import debug from 'debug';
import _ from 'lodash';

const log = debug('pie-lib:math-inline:keypad');

const LatexButton = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    padding: 0,
    margin: 0,
    fontSize: '110% !important',
  },
  latexButton: {
    pointerEvents: 'none',
    textTransform: 'none !important',
    '& .mq-scaled.mq-sqrt-prefix': {
      transform: 'scale(1, 0.9) !important',
    },
    '& .mq-sup-only .mq-sup': {
      marginBottom: '0.9px !important',
    },
    '& .mq-empty': {
      backgroundColor: `${fade(theme.palette.secondary.main, 0.4)} !important`,
    },
    '& .mq-overline .mq-overline-inner': {
      borderTop: '2px solid black',
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
        },
        '&:before': {
          fontSize: '80%',
          left: 'calc(-13%)',
          top: '-0.31em',
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
        right: 'calc(-13%)',
        top: '-0.26em',
      },
      '& .mq-overarrow-inner': {
        border: 'none !important',
      },
      '& .mq-overarrow-inner .mq-overarrow-inner-right': {
        display: 'none !important',
      },
    },
    '& .mq-root-block': {
      padding: '5px',
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
      '& .mq-overline-inner': {
        borderTop: 'none !important',
        paddingTop: '0 !important',
      },
    },
  },
  parallelButton: {
    fontStyle: 'italic',
  },
  leftRightArrowButton: {
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
  },
}))((props) => {
  let buttonClass;

  if (props.latex === '\\parallel') {
    buttonClass = classNames(props.classes.latexButton, props.mqClassName, props.classes.parallelButton);
  } else if (props.latex === '\\overleftrightarrow{\\overline{}}') {
    buttonClass = classNames(props.classes.latexButton, props.mqClassName, props.classes.leftRightArrowButton);
  } else {
    buttonClass = classNames(props.classes.latexButton, props.mqClassName);
  }

  try {
    const MQ = MathQuill.getInterface(2);
    const span = document.createElement('span');
    span.innerHTML = '';
    const mathField = MQ.StaticMath(span);

    mathField.parseLatex(props.latex);
    mathField.latex(props.latex);
  } catch (e) {
    // received latex has errors - do not create button
    return <></>;
  }

  return (
    <Button className={classNames(props.classes.root, props.className)} onClick={props.onClick}>
      <mq.Static className={buttonClass} latex={props.latex} />
    </Button>
  );
});

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

export class KeyPad extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    baseSet: PropTypes.array,
    additionalKeys: PropTypes.array,
    layoutForKeyPad: PropTypes.object,
    onPress: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    noDecimal: PropTypes.bool,
    mode: PropTypes.string,
  };
  static defaultProps = {
    baseSet: baseSet,
    noDecimal: false,
  };

  buttonClick = (key) => {
    log('[buttonClick]', key);
    const { onPress } = this.props;
    onPress(key);
  };

  flowKeys = (base, extras) => {
    const transposed = [...sortKeys(base), ...sortKeys(extras)];
    return _.flatten(transposed);
  };

  keyIsNotAllowed = (key) => {
    const { noDecimal } = this.props;

    if (((key.write === '.' && key.label === '.') || (key.write === ',' && key.label === ',')) && noDecimal) {
      return true;
    }

    return false;
  };

  render() {
    const { classes, className, baseSet, additionalKeys, layoutForKeyPad, onFocus, mode } = this.props;

    const noBaseSet = ['non-negative-integers', 'integers', 'decimals', 'fractions', 'item-authoring', 'language'];

    const keysWithoutBaseSet = noBaseSet.includes(mode);
    const allKeys = keysWithoutBaseSet
      ? this.flowKeys([], additionalKeys || [])
      : this.flowKeys(baseSet, additionalKeys || []); //, ...sortKeys(additionalKeys)];

    const shift = allKeys.length % 5 ? 1 : 0;
    const style = {
      gridTemplateColumns: `repeat(${Math.floor(allKeys.length / 5) + shift}, minmax(min-content, 150px))`,
      ...createCustomLayout(layoutForKeyPad),
    };
    return (
      <div className={classNames(classes.keys, className, classes[mode])} style={style} onFocus={onFocus}>
        {allKeys.map((k, index) => {
          const onClick = this.buttonClick.bind(this, k);

          if (!k) {
            return <span key={`empty-${index}`} />;
          }

          const common = {
            onClick,
            className: classNames(
              classes.labelButton,
              !keysWithoutBaseSet && classes[k.category],
              classes[k.extraClass],
              k.label === ',' && classes.comma,
              k.label === '.' && classes.dot,
            ),
            disabled: this.keyIsNotAllowed(k),
            key: `${k.label || k.latex || k.command}-${index}`,
            ...(k.actions || {}),
            ...(k.extraProps || {}),
          };

          if (k.latex) {
            return <LatexButton latex={k.latex} {...common} className={classes.latexButton} />;
          }

          if (k.label) {
            return <Button {...common}>{k.label}</Button>;
          } else {
            const Icon = k.icon ? k.icon : 'div';

            return (
              <IconButton tabIndex={'-1'} {...common}>
                <Icon className={classes.icon} />
              </IconButton>
            );
          }
        })}
      </div>
    );
  }
}

const styles = (theme) => ({
  keys: {
    '& *': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
    },
    width: '100%',
    display: 'grid',
    gridTemplateRows: 'repeat(5, minmax(40px, 60px))',
    gridRowGap: '0px',
    gridColumnGap: '0px',
    gridAutoFlow: 'column',
  },
  character: {
    textTransform: 'initial !important',
  },
  holder: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#cef',
    borderRadius: 0,
    padding: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px 0`,
  },
  labelButton: {
    minWidth: 'auto',
    fontSize: '140% !important',
    backgroundColor: lighten(theme.palette.primary.light, 0.5),
    '&:hover': {
      backgroundColor: lighten(theme.palette.primary.light, 0.7),
    },
    borderRadius: 0,
  },
  latexButton: {
    minWidth: 'auto',
    borderRadius: 0,
    backgroundColor: lighten(theme.palette.primary.light, 0.5),
    '&:hover': {
      backgroundColor: lighten(theme.palette.primary.light, 0.7),
    },
  },
  base: {},
  operators: {
    backgroundColor: lighten(theme.palette.secondary.light, 0.5),
    '&:hover': {
      backgroundColor: lighten(theme.palette.secondary.light, 0.7),
    },
  },
  comparison: {
    backgroundColor: lighten(green[500], 0.5),
    '&:hover': {
      backgroundColor: lighten(green[500], 0.7),
    },
  },
  comma: {
    fontSize: '200% !important',
    lineHeight: '100%',
  },
  dot: {
    fontSize: '200% !important',
    lineHeight: '100%',
  },
  icon: {
    height: '30px',
  },
});

export default withStyles(styles)(KeyPad);
