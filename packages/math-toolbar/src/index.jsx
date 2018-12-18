import React from 'react';
import PropTypes from 'prop-types';
import EditorAndPad from './editor-and-pad';
import { DoneButton } from './done-button';
import { withStyles } from '@material-ui/core/styles';
import MathPreview from './math-preview';

export { MathPreview };

export class MathToolbar extends React.Component {
  static propTypes = {
    allowAnswerBlock: PropTypes.bool,
    latex: PropTypes.string.isRequired,
    onDone: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      latex: props.latex
    };
  }

  done = () => {
    this.props.onDone(this.state.latex);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ latex: nextProps.latex });
  }

  onChange = latex => this.setState({ latex });

  render() {
    const { allowAnswerBlock } = this.props;
    const { latex } = this.state;
    return (
      <PureToolbar
        allowAnswerBlock={allowAnswerBlock}
        latex={latex}
        onChange={this.onChange}
        onDone={this.done}
      />
    );
  }
}

export class RawPureToolbar extends React.Component {
  static propTypes = {
    latex: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    allowAnswerBlock: PropTypes.bool
  };

  render() {
    const { allowAnswerBlock, latex, onChange, onDone, classes } = this.props;
    return (
      <div className={classes.pureToolbar}>
        <EditorAndPad
          allowAnswerBlock={allowAnswerBlock}
          latex={latex}
          onChange={onChange}
        />
        <DoneButton onClick={onDone} />
      </div>
    );
  }
}
const styles = () => ({
  pureToolbar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  }
});

export const PureToolbar = withStyles(styles)(RawPureToolbar);
