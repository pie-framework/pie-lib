import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Mask from './mask';
import componentize from './componentize';
import { deserialize } from './serialization';

export const buildLayoutFromMarkup = (markup, type) => {
  const { markup: processed } = componentize(markup, type);
  const value = deserialize(processed);
  return value.document;
};

export const withMask = (type, renderChildren) => {
  return class WithMask extends React.Component {
    static propTypes = {
      /**
       * At the start we'll probably work with markup
       */
      markup: PropTypes.string,
      /**
       * Once we start authoring, it may make sense for use to us layout, which will be a simple js object that maps to `slate.Value`.
       */
      layout: PropTypes.object,
      value: PropTypes.object,
      onChange: PropTypes.func,
    };

    componentDidUpdate(prevProps) {
      if (this.props.markup !== prevProps.markup) {
        // eslint-disable-next-line
        const domNode = ReactDOM.findDOMNode(this);
        // Query all elements that may contain outdated MathJax renderings
        const mathElements = domNode.querySelectorAll('[data-latex][data-math-handled="true"]');

        // Clean up for fresh MathJax processing
        mathElements.forEach((el) => {
          // Remove the MathJax container to allow for clean updates
          const mjxContainer = el.querySelector('mjx-container');

          if (mjxContainer) {
            el.removeChild(mjxContainer);
          }

          // Update the innerHTML to match the raw LaTeX data, ensuring it is reprocessed correctly
          const latexCode = el.getAttribute('data-raw');
          el.innerHTML = latexCode;

          // Remove the attribute to signal that MathJax should reprocess this element
          el.removeAttribute('data-math-handled');
        });
      }
    }

    render() {
      const { markup, layout, value, onChange } = this.props;

      const maskLayout = layout ? layout : buildLayoutFromMarkup(markup, type);
      return <Mask layout={maskLayout} value={value} onChange={onChange} renderChildren={renderChildren(this.props)} />;
    }
  };
};
