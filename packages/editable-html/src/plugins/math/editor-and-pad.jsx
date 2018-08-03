import { HorizontalKeypad } from '@pie-lib/math-input';

import React from 'react';
import debug from 'debug';
import PropTypes from 'prop-types';
import MathQuillEditor from './mathquill/editor';
import { withStyles } from '@material-ui/core/styles';

const log = debug('@pie-lib:editable-html:plugins:math:editor-and-pad');

const toNodeData = data => {
  if (!data) {
    return;
  }

  const { type, value } = data;

  if (type === 'command' || type === 'cursor') {
    return data;
  } else if (value === 'clear') {
    return { type: 'clear' };
  } else {
    return { type: 'write', value };
  }
};

export class EditorAndPad extends React.Component {
  static propTypes = {
    latex: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object
  };

  onClick = data => {
    const c = toNodeData(data);
    log('mathChange: ', c);

    if (c.type === 'clear') {
      log('call clear...');
      this.input.clear();
    } else if (c.type === 'command') {
      this.input.command(c.value);
    } else if (c.type === 'cursor') {
      this.input.keystroke(c.value);
    } else {
      this.input.write(c.value);
    }
  };

  onEditorChange = latex => {
    const { onChange } = this.props;
    onChange(latex);
  };

  /** Only render if the mathquill instance's latex is different */
  shouldComponentUpdate(nextProps) {
    const inputIsDifferent = this.input.latex() !== nextProps.latex;
    log('[shouldComponentUpdate] ', 'inputIsDifferent: ', inputIsDifferent);
    return inputIsDifferent;
  }

  render() {
    const { latex, classes } = this.props;

    log('[render]', latex);

    return (
      <div className={classes.mathToolbar}>
        <MathQuillEditor
          className={classes.mathEditor}
          ref={r => (this.input = r)}
          latex={latex}
          onChange={this.onEditorChange}
        />
        <hr className={classes.hr} />
        <HorizontalKeypad onClick={this.onClick} />
      </div>
    );
  }
}

const styles = theme => ({
  mathEditor: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  hr: {
    padding: 0,
    margin: 0,
    height: '1px',
    border: 'none',
    borderBottom: `solid 1px ${theme.palette.primary.main}`
  },
  mathToolbar: {
    textAlign: 'center',
    '& > .mq-math-mode': {
      border: 'solid 0px lightgrey'
    },
    '& > .mq-focused': {
      outline: 'none',
      boxShadow: 'none',
      border: `dotted 1px ${theme.palette.primary.main}`,
      borderRadius: '0px'
    }
  }
});

export default withStyles(styles)(EditorAndPad);
