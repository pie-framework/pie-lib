import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { styled } from '@mui/material/styles';
import { MARK_TAGS } from './serialization';

const Paragraph = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const Spacer = styled('span')(() => ({
  display: 'inline-block',
  width: '.75em',
}));

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

const getMark = (n) => {
  const mark = n.leaves.find((leave) => get(leave, 'marks', []).length);

  if (mark) {
    return mark.marks[0];
  }

  return null;
};

export const renderChildren = (layout, value, onChange, rootRenderChildren, parentNode, elementType) => {
  if (!value) {
    return null;
  }

  const children = [];

  (layout.nodes || []).forEach((n, index) => {
    const key = n.type ? `${n.type}-${index}` : `${index}`;

    if (n.isMath) {
      children.push(
        <span
          dangerouslySetInnerHTML={{
            __html: `<math displaystyle="true">${n.nodes[0].innerHTML}</math>`,
          }}
        />,
      );
      return children;
    }

    if (rootRenderChildren) {
      const c = rootRenderChildren(n, value, onChange);
      if (c) {
        children.push(c);
        if (parentNode?.type !== 'td' && elementType === 'drag-in-the-blank') {
          children.push(<Spacer key={`spacer-${index}`} />);
        }
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

            children.push(<Tag key={key}>{content}</Tag>);
            break;
          }
        }
      } else if (content.length > 0) {
        children.push(content);
        if (parentNode?.type !== 'td' && elementType === 'drag-in-the-blank') {
          children.push(<Spacer key={`spacer-${index}`} />);
        }
      }
    } else {
      const subNodes = renderChildren(n, value, onChange, rootRenderChildren, n, elementType);
      if (n.type === 'p' || n.type === 'paragraph') {
        children.push(<Paragraph key={key}>{subNodes}</Paragraph>);
      } else {
        const Tag = n.type;
        if (n.nodes && n.nodes.length > 0) {
          children.push(
            <Tag key={key} {...n.data.attributes}>
              {subNodes}
            </Tag>,
          );
        } else {
          children.push(<Tag key={key} {...n.data.attributes} />);
        }
      }
    }
  });
  return children;
};

const MaskContainer = styled('div')(() => ({
  display: 'initial',
  '&:not(.MathJax) table': {
    borderCollapse: 'collapse',
  },
  // align table content to left as per STAR requirement PD-3687
  '&:not(.MathJax) table td, &:not(.MathJax) table th': {
    padding: '8px 12px',
    textAlign: 'left',
  },
}));

/**
 * Renders a layout that uses the slate.js Value model structure.
 */
export default class Mask extends React.Component {
  static propTypes = {
    renderChildren: PropTypes.func,
    layout: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
    elementType: PropTypes.string,
  };

  handleChange = (id, value) => {
    const data = { ...this.props.value, [id]: value };
    this.props.onChange(data);
  };

  render() {
    const { value, layout, elementType } = this.props;
    const children = renderChildren(layout, value, this.handleChange, this.props.renderChildren, null, elementType);

    return <MaskContainer>{children}</MaskContainer>;
  }
}
