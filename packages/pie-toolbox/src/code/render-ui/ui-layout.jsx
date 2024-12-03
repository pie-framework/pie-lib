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
    // get the standard fontSize  of the page (rootFontSize)
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return { fontSize: `${rootFontSize * fontSizeFactor}px` };
  }

  render() {
    const { children, className, classes, fontSizeFactor, ...rest } = this.props;

    const finalClass = classNames(className, classes.extraCSSRules, classes.uiLayoutContainer);
    const restProps = omit(rest, 'extraCSSRules');

    return (
      <div className={finalClass} {...restProps} style={this.computeStyle(fontSizeFactor)}>
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
