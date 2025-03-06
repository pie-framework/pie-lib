import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import AppendCSSRules from './append-css-rules';

class UiLayout extends AppendCSSRules {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.array,
    extraCSSRules: PropTypes.shape({
      names: PropTypes.arrayOf(PropTypes.string),
      rules: PropTypes.string,
    }),
    fontSizeFactor: PropTypes.number,
  };

  static defaultProps = {
    extraCSSRules: {},
    fontSizeFactor: 1,
  };

  constructor(props) {
    super(props);
    this.classesSheet = document.createElement('style');
  }

  computeStyle(fontSizeFactor) {
    const getFontSize = (element) => parseFloat(getComputedStyle(element).fontSize);

    const rootFontSize = getFontSize(document.documentElement);
    const bodyFontSize = getFontSize(document.body);
    const effectiveFontSize = Math.max(rootFontSize, bodyFontSize);

    return fontSizeFactor !== 1 ? { fontSize: `${effectiveFontSize * fontSizeFactor}px` } : null;
  }

  render() {
    let { children, className, classes, fontSizeFactor, ...rest } = this.props;

    const finalClass = classNames(className, classes.extraCSSRules, classes.uiLayoutContainer);
    const restProps = omit(rest, 'extraCSSRules');
    const style = this.computeStyle(fontSizeFactor);

    return (
      <div className={finalClass} {...restProps} {...(style && { style })}>
        {children}
      </div>
    );
  }
}

const styles = {
  extraCSSRules: {},
  // need this because some browsers set their own style on table
  uiLayoutContainer: {
    '& table, th, td': {
      fontSize: 'inherit' /* Ensure table elements inherit font size */,
    },
  },
};

const Styled = withStyles(styles)(UiLayout);

export default Styled;
