import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import ReactDOM from 'react-dom';

export class SimpleMask extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    markup: PropTypes.string,
    components: PropTypes.object,
    model: PropTypes.object
  };

  static defaultProps = {};

  componentDidMount() {
    this.renderComps();
  }

  componentDidUpdate() {
    this.renderComps();
  }

  compChange(id, value) {
    console.log('changed: ', id, value);
  }

  renderComps() {
    if (!this.root) {
      return;
    }

    const nodes = this.root.querySelectorAll('[data-component]');

    const { components, model } = this.props;
    nodes.forEach(e => {
      const Comp = components[e.dataset.component];
      const value = model[e.dataset.id];
      console.log('value: ', value);
      if (!Comp) {
        return;
      }
      const el = React.createElement(Comp, { value, id: e.dataset.id, onChange: this.compChange });
      ReactDOM.render(el, e);
    });
  }

  render() {
    console.log('RENDED!!!');
    const { classes, className, markup } = this.props;
    return (
      <div
        className={classNames(classes.class, className)}
        dangerouslySetInnerHTML={{ __html: markup }}
        ref={r => (this.root = r)}
      />
    );
  }
}
const styles = theme => ({
  class: {}
});
export default withStyles(styles)(SimpleMask);
