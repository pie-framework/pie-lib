import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
// const d = require('@pie-lib/drag');
import { DragDropContext } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline
//export default DragDropContext(MultiBackend(HTML5toTouch))(App);

export class SimpleMask extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    markup: PropTypes.string,
    components: PropTypes.object,
    value: PropTypes.object,
    config: PropTypes.object,
    feedback: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
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

    const m = { ...this.props.value[id], value };
    delete m.correct;
    const model = { ...this.props.value, [id]: m };
    onChange(model);
  };

  renderComps() {
    if (!this.root) {
      return;
    }
    const nodes = this.root.querySelectorAll('[data-component]');
    const { components, value, disabled } = this.props;

    nodes.forEach(e => {
      const Comp = components[e.dataset.component];
      if (!Comp) {
        return;
      }
      const props = value[e.dataset.id];
      const config = (this.props.config || {})[e.dataset.id];
      const feedback = (this.props.feedback || {})[e.dataset.id];

      // const el = React.createElement(Comp, {
      //   ...props,
      //   ...config,
      //   ...feedback,
      //   disabled,
      //   id: e.dataset.id,
      //   onChange: this.compChange
      // });
      // ReactDOM.render(el, e);
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

// const Out = d.withDragContext(Styled);
// export default Out;
// import { DragDropContext } from 'react-dnd';
//   import MultiBackend from 'react-dnd-multi-backend';
//   import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline
//   ...
export default DragDropContext(MultiBackend(HTML5toTouch))(Styled);
