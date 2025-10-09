import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import UiLayout from './ui-layout';

class PreviewLayout extends React.Component {
  static propTypes = {
    ariaLabel: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    classes: PropTypes.object,
    role: PropTypes.string,
    extraCSSRules: PropTypes.shape({
      names: PropTypes.arrayOf(PropTypes.string),
      rules: PropTypes.string,
    }),
    fontSizeFactor: PropTypes.number,
  };

  render() {
    const { children, classes, ariaLabel, role, extraCSSRules, fontSizeFactor } = this.props;
    const accessibility = ariaLabel ? { 'aria-label': ariaLabel, role } : {};

    return (
      <UiLayout
        className={classes.container}
        {...accessibility}
        extraCSSRules={extraCSSRules}
        fontSizeFactor={fontSizeFactor}
      >
        {children}
      </UiLayout>
    );
  }
}

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
});

const Styled = withStyles(styles)(PreviewLayout);

const RootElem = (props) => <Styled {...props} />;

export default RootElem;
