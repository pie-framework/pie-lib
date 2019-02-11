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

const LatexButton = withStyles(theme => ({
  root: {
    textTransform: 'none',
    padding: 0,
    margin: 0,
    fontSize: '1.1rem'
  },
  latexButton: {
    pointerEvents: 'none',
    '& .mq-empty': {
      backgroundColor: fade(theme.palette.secondary.main, 0.4)
    },
    '& .mq-overarrow': {
      width: '20px'
    },
    '& .mq-root-block': {
      padding: '5px'
    },
    '& .mq-overarrow.mq-arrow-both.mq-empty:after': {
      right: '-6px',
      fontSize: '0.9rem',
      top: '-3px'
    },
    '& .mq-overarrow.mq-arrow-right.mq-empty:before': {
      right: '-5px',
      fontSize: '0.9rem',
      top: '-3px'
    },
    '& .mq-overarrow.mq-arrow-both.mq-empty:before': {
      left: '-6px',
      fontSize: '0.9rem',
      top: '-3px'
    }
  }
}))(props => (
  <Button
    className={classNames(props.classes.root, props.className)}
    onClick={props.onClick}
  >
    <mq.Static
      className={classNames(props.classes.latexButton, props.mqClassName)}
      latex={props.latex}
    />
  </Button>
));

export class KeyPad extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    baseSet: PropTypes.array,
    additionalKeys: PropTypes.array,
    onPress: PropTypes.func.isRequired,
    onFocus: PropTypes.func
  };
  static defaultProps = {
    baseSet: baseSet
  };

  buttonClick = key => {
    log('[buttonClick]', key);
    const { onPress } = this.props;
    onPress(key);
  };

  flowKeys = (base, extras) => {
    const transposed = [...sortKeys(base), ...sortKeys(extras)];
    return _.flatten(transposed);
  };

  render() {
    const { classes, className, baseSet, additionalKeys, onFocus } = this.props;

    const allKeys = this.flowKeys(baseSet, additionalKeys || []); //, ...sortKeys(additionalKeys)];

    const shift = allKeys.length % 5 ? 1 : 0;
    const style = {
      gridTemplateColumns: `repeat(${Math.floor(allKeys.length / 5) +
        shift}, minmax(min-content, 150px))`
    };
    return (
      <div
        className={classNames(classes.keys, className)}
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
            className: classNames(
              classes.labelButton,
              classes[k.category],
              k.label === '=' && classes.equals
            ),
            key: `${k.label || k.latex || k.command}-${index}`
          };

          if (k.latex) {
            return (
              <LatexButton
                latex={k.latex}
                {...common}
                className={classes.latexButton}
              />
            );
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
const styles = theme => ({
  keys: {
    width: '100%',
    display: 'grid',
    gridTemplateRows: 'repeat(5, minmax(40px, 60px))',
    gridRowGap: '0px',
    gridColumnGap: '0px',
    gridAutoFlow: 'column'
  },
  holder: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#cceeff',
    borderRadius: 0,
    padding: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px 0`
  },
  labelButton: {
    backgroundColor: lighten(theme.palette.primary.light, 0.5),
    '&:hover': {
      backgroundColor: lighten(theme.palette.primary.light, 0.7)
    },
    borderRadius: 0
  },
  latexButton: {
    backgroundColor: lighten(theme.palette.primary.main, 0.7),
    borderRadius: 0
  },
  base: {},
  operators: {
    backgroundColor: lighten(theme.palette.secondary.light, 0.5),
    '&:hover': {
      backgroundColor: lighten(theme.palette.secondary.light, 0.7)
    }
  },
  comparison: {
    backgroundColor: lighten(green[500], 0.5),
    '&:hover': {
      backgroundColor: lighten(green[500], 0.7)
    }
  },
  equals: {
    backgroundColor: theme.palette.secondary.light,
    '&:hover': {
      backgroundColor: lighten(theme.palette.secondary.light, 0.7)
    }
  },
  icon: {
    height: '30px'
  }
});

export default withStyles(styles)(KeyPad);
