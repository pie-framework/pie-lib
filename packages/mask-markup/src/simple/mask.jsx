import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import ReactDOM from 'react-dom';
const d = require('@pie-lib/drag');
console.log('DDD:', d);
console.log('DDD:', d.withDragContext);
// import { d } from '@pie-lib/drag';
// console.log('d:', d, d.withDragContext);
export class SimpleMask extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    markup: PropTypes.string,
    components: PropTypes.object,
    model: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {};

  componentDidMount() {
    this.renderComps();
  }

  componentDidUpdate() {
    this.renderComps();
  }

  compChange = (id, value) => {
    const { onChange } = this.props;

    const m = { ...this.props.model[id], value };
    const model = { ...this.props.model, [id]: m };
    onChange(model);
  };

  renderComps() {
    if (!this.root) {
      return;
    }
    const nodes = this.root.querySelectorAll('[data-component]');
    const { components, model } = this.props;

    nodes.forEach(e => {
      console.log('e.dataset.component:', e.dataset.component);
      const Comp = components[e.dataset.component];
      console.log('Comp', Comp);
      if (!Comp) {
        return;
      }
      const props = model[e.dataset.id];
      const el = React.createElement(Comp, {
        ...props,
        id: e.dataset.id,
        onChange: this.compChange
      });
      ReactDOM.render(el, e);
    });
  }

  render() {
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
const Styled = withStyles(styles)(SimpleMask);

const Out = d.withDragContext(Styled);
export default Out;
