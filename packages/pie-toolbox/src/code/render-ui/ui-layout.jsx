import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
  };

  static defaultProps = {
    extraCSSRules: {},
  };

  constructor(props) {
    super(props);
    this.classesSheet = document.createElement('style');
  }

  render() {
    const { children, className, classes, ...rest } = this.props;
    const finalClass = classNames(className, classes.extraCSSRules);

    return (
      <div className={finalClass} {...rest}>
        {children}
      </div>
    );
  }
}

const styles = {
  extraCSSRules: {},
};

const Styled = withStyles(styles)(UiLayout);

export default Styled;
