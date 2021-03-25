import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import CSSTransition from 'react-transition-group/CSSTransition';
import { CorrectResponse } from '@pie-lib/icons';
import { Readable } from '@pie-lib/render-ui';
import Expander from './expander';
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
/**
 * We export the raw unstyled class for testability. For public use please use the default export.
 */
export class CorrectAnswerToggle extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func,
    toggled: PropTypes.bool,
    show: PropTypes.bool,
    hideMessage: PropTypes.string,
    showMessage: PropTypes.string,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    showMessage: 'Show correct answer',
    hideMessage: 'Hide correct answer',
    show: false,
    toggled: false
  };

  constructor(props) {
    super(props);
    this.state = {
      show: props.show
    };
  }

  onClick() {
    this.props.onToggle(!this.props.toggled);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      show: nextProps.show
    });
  }

  render() {
    const { classes, className, toggled, hideMessage, showMessage } = this.props;

    return (
      <div className={classNames(classes.root, className)}>
        <Expander show={this.state.show} className={classes.expander}>
          <div className={classes.content} onClick={this.onClick.bind(this)}>
            <div className={classes.iconHolder}>
              <CSSTransition timeout={400} in={toggled} exit={!toggled} classNames={classes}>
                <CorrectResponse open={toggled} key="correct-open" className={classes.icon} />
              </CSSTransition>
              <CSSTransition timeout={5000} in={!toggled} exit={toggled} classNames={classes}>
                <CorrectResponse open={toggled} key="correct-closed" className={classes.icon} />
              </CSSTransition>
            </div>
            <Readable false>
              <div className={classes.label}>{toggled ? hideMessage : showMessage}</div>
            </Readable>
          </div>
        </Expander>
      </div>
    );
  }
}

export default withStyles(styles)(CorrectAnswerToggle);
