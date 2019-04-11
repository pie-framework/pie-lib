import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Text from './text';
import { Document, Value } from 'slate';
// const valueJson = {
//   object: 'value',
//   document: {
//     object: 'document',
//     data: {},
//     nodes: [
//       {
//         object: 'block',
//         type: 'paragraph',
//         nodes: [
//           {
//             object: 'text',
//             leaves: [{ object: 'leaf', text: 'hi' }, { object: 'leaf', text: ' there' }]
//           }
//         ]
//       },
//       {
//         object: 'inline',
//         type: 'woof-component',
//         data: {
//           maskComponent: 'myComp',
//           label: 'foo'
//         }
//       },
//       {
//         object: 'block',
//         type: 'paragraph',
//         nodes: [
//           {
//             object: 'text',
//             leaves: [
//               {
//                 object: 'leaf',
//                 text: 'A line of text in a paragraph.'
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// };
// const value = Value.fromJSON(valueJson, { normalize: false });

// console.log('value:', value.toJS());
class Node extends React.Component {
  render() {
    const { editor, node } = this.props;

    const children = [];

    node.nodes.forEach(n => {
      children.push(this.renderNode(n));
    });

    const props = {
      node,
      editor
    };
    const attributes = { 'data-key': node.key };
    const element = editor.run('renderNode', { ...props, attributes, children });
    return element;
  }

  renderNode = (child, isSelected, decorations) => {
    const { block, editor, node, readOnly, isFocused } = this.props;
    const Component = child.object === 'text' ? Text : Node;

    return (
      <Component
        block={node.object === 'block' ? node : block}
        decorations={decorations}
        editor={editor}
        isSelected={isSelected}
        isFocused={isFocused && isSelected}
        key={child.key}
        node={child}
        parent={node}
        readOnly={readOnly}
      />
    );
  };
}

class Content extends React.Component {
  render() {
    const { value, editor } = this.props;

    const children = [];
    console.log('value.document', value.document.nodes);
    value.document.nodes.forEach(n => {
      children.push(this.renderNode(n));
    });

    return <div>{children}</div>;
  }

  renderNode = child => {
    const { editor, readOnly } = this.props;
    const { value } = editor;
    const { document } = value;

    return (
      <Node
        block={null}
        editor={editor}
        key={child.key}
        node={child}
        parent={document}
        readOnly={readOnly}
      />
    );
  };
}
const Woof = () => <h1>Woof Woof</h1>;

export class MaskMarkup extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
  }
  run(name, data) {
    if (name === 'renderNode') {
      return this.renderNode(data);
    }
  }

  renderNode(props) {
    const { plugins } = this.props;
    const { node, children } = props;
    console.log('node.type:', node.type);

    const el = (plugins || []).reduce((el, p) => {
      if (el) {
        return el;
      }
      return p.renderNode(node, children);
    }, undefined);

    console.log('el:', el);
    if (el) {
      return el;
    }
    console.log('[renderNode]: ', props);

    if (node.type === 'paragraph') {
      return <p>{children}</p>;
    }

    // if (node.type === 'woof-component') {
    //   return (
    //     <Woof node={node} editor={this} value={value}>
    //       {children}
    //     </Woof>
    //   );
    // }

    if (node.object === 'block') {
      return <div>{children}</div>;
    }
    if (node.object === 'inline') {
      return <span>{children}</span>;
    }

    return <div>render-node</div>;
  }

  get value() {
    return this.props.value;
  }
  render() {
    const { classes, className, value } = this.props;
    return <Content value={value} editor={this} />;
  }
}
const styles = theme => ({
  class: {}
});

export default withStyles(styles)(MaskMarkup);
