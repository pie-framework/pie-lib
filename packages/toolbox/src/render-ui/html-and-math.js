import React from 'react';
import { renderMath } from '@pie-lib/math-rendering';
import PropTypes from 'prop-types';

export default class HtmlAndMath extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
    className: PropTypes.string,
    html: PropTypes.string,
  };

  static defaultProps = {
    tag: 'div',
    html: '',
  };

  componentDidMount() {
    if (this.node) {
      renderMath(this.node);
    }
  }

  componentDidUpdate() {
    if (this.node) {
      renderMath(this.node);
    }
  }

  render() {
    const { tag, className, html } = this.props;
    const Tag = tag || 'div';
    return <Tag ref={(r) => (this.node = r)} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  }
}
