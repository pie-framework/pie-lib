import React from 'react';
import PropTypes from 'prop-types';
import { convertLatexToMarkup, normalizeLatex, getMathLive } from './mathlive-instance';

const PROMPT_RE = /\\(?:placeholder|MathQuillMathField)\[([^\]]*)\]\{([^}]*)\}/g;

function hasPrompts(latex) {
  if (!latex) return false;
  PROMPT_RE.lastIndex = 0;
  return PROMPT_RE.test(latex);
}

class PromptField extends React.Component {
  constructor(props) {
    super(props);
    this.hostRef = React.createRef();
    this.mathField = null;
  }

  componentDidMount() {
    getMathLive();
    this.mathField = document.createElement('math-field');
    this.mathField.value = normalizeLatex(this.props.latex) || '';
    this.mathField.addEventListener('input', () => {
      if (this.props.onChange) {
        this.props.onChange(this.props.name, this.mathField.value);
      }
    });
    if (this.hostRef.current) {
      this.hostRef.current.appendChild(this.mathField);
    }
  }

  componentWillUnmount() {
    if (this.mathField && this.hostRef.current) {
      this.hostRef.current.removeChild(this.mathField);
    }
    this.mathField = null;
  }

  render() {
    return <span ref={this.hostRef} />;
  }
}

PromptField.propTypes = {
  name: PropTypes.string,
  latex: PropTypes.string,
  onChange: PropTypes.func,
};

class Static extends React.Component {
  render() {
    const { latex, className, onSubFieldChange } = this.props;

    if (!latex) {
      return <span className={className} />;
    }

    const normalized = normalizeLatex(latex);

    if (hasPrompts(normalized)) {
      const parts = [];
      let last = 0;
      PROMPT_RE.lastIndex = 0;
      let match;
      let idx = 0;
      const normalizedForParse = normalized;
      while ((match = PROMPT_RE.exec(normalizedForParse)) !== null) {
        const before = normalizedForParse.slice(last, match.index);
        if (before) {
          parts.push(
            <span
              key={`text-${idx}`}
              dangerouslySetInnerHTML={{
                __html: convertLatexToMarkup(before),
              }}
            />
          );
        }
        parts.push(
          <PromptField
            key={`prompt-${idx}`}
            name={match[1]}
            latex={`\\placeholder[${match[1]}]{${match[2]}}`}
            onChange={onSubFieldChange}
          />
        );
        last = match.index + match[0].length;
        idx++;
      }
      const tail = normalizedForParse.slice(last);
      if (tail) {
        parts.push(
          <span
            key={`text-end`}
            dangerouslySetInnerHTML={{ __html: convertLatexToMarkup(tail) }}
          />
        );
      }
      return <span className={className}>{parts}</span>;
    }

    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: convertLatexToMarkup(normalized) }}
      />
    );
  }
}

Static.propTypes = {
  latex: PropTypes.string,
  className: PropTypes.string,
  onSubFieldChange: PropTypes.func,
};

export default Static;
