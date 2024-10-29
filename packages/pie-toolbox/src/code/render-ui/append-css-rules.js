import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

class ExtraCSSRulesMixin extends React.Component {
  static propTypes = {
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

  componentDidMount() {
    this.appendExtraStyles();
  }

  appendExtraStyles = () => {
    if (isEmpty(this.props.extraCSSRules) || !this.classesSheet) {
      return;
    }

    const headElement = document.head || document.getElementsByTagName('head')[0];

    if (!headElement) {
      return;
    }

    if (!this.classesSheet.parentElement) {
      headElement.appendChild(this.classesSheet);
    }

    const { extraCSSRules, classes } = this.props;

    this.classesSheet.innerHTML = `
      .${classes.extraCSSRules} {
        ${extraCSSRules.rules}
      }
    `;
  };
}

export default ExtraCSSRulesMixin;
