import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import { MARK_TAGS } from './serialization';

const Paragraph = withStyles(theme => ({
  para: {
    paddingTop: 2 * theme.spacing.unit,
    paddingBottom: 2 * theme.spacing.unit
  }
}))(props => <div className={props.classes.para}>{props.children}</div>);

const restrictWhitespaceTypes = ['tbody', 'tr'];

const addText = (parentNode, text) => {
  const isWhitespace = text.trim() === '';
  const parentType = parentNode && parentNode.type;

  if (isWhitespace && restrictWhitespaceTypes.includes(parentType)) {
    return undefined;
  } else {
    return text;
  }
};

const getMark = n => {
  const mark = n.leaves.find(leave => get(leave, 'marks', []).length);

  if (mark) {
    return mark.marks[0];
  }

  return null;
};

export const renderChildren = (layout, value, onChange, rootRenderChildren, parentNode) => {
  if (!value) {
    return null;
  }

  const children = [];

  (layout.nodes || []).forEach((n, index) => {
    const key = `${n.type}-${index}`;

    if (n.isMath) {
      children.push(
        <span
          dangerouslySetInnerHTML={{
            __html: `<math displaystyle="true">${n.nodes[0].innerHTML}</math>`
          }}
        />
      );
      return children;
    }

    if (rootRenderChildren) {
      const c = rootRenderChildren(n, value, onChange);
      if (c) {
        children.push(c);
        return;
      }
    }

    if (n.object === 'text') {
      const content = n.leaves.reduce((acc, l) => {
        const t = l.text;
        const extraText = addText(parentNode, t);
        return extraText ? acc + extraText : acc;
      }, '');
      const mark = getMark(n);

      if (mark) {
        let markKey;

        for (markKey in MARK_TAGS) {
          if (MARK_TAGS[markKey] === mark.type) {
            const Tag = markKey;

            children.push(<Tag>{content}</Tag>);
            break;
          }
        }
      } else if (content.length > 0) {
        children.push(content);
      }
    } else {
      const subNodes = renderChildren(n, value, onChange, rootRenderChildren, n);
      if (n.type === 'p' || n.type === 'paragraph') {
        children.push(<Paragraph key={key}>{subNodes}</Paragraph>);
      } else {
        const Tag = n.type;
        if (n.nodes && n.nodes.length > 0) {
          children.push(
            <Tag key={key} {...n.data.attributes}>
              {subNodes}
            </Tag>
          );
        } else {
          children.push(<Tag key={key} {...n.data.attributes} />);
        }
      }
    }
  });
  return children;
};

const MaskContainer = withStyles(() => ({
  main: {
    display: 'initial'
  }
}))(props => <div className={props.classes.main}>{props.children}</div>);

/**
 * Renders a layout that uses the slate.js Value model structure.
 */
export default class Mask extends React.Component {
  static propTypes = {
    renderChildren: PropTypes.func,
    layout: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func
  };

  handleChange = (id, value) => {
    const data = { ...this.props.value, [id]: value };
    this.props.onChange(data);
  };

  render() {
    const { value, layout } = this.props;
    const children = renderChildren(layout, value, this.handleChange, this.props.renderChildren);

    return <MaskContainer>{children}</MaskContainer>;
  }
}
