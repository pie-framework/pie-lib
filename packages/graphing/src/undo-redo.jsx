import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

export class UndoRedo extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onUndo: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired
  };
  static defaultProps = {};
  render() {
    const { className, onUndo, onRedo, onReset } = this.props;
    return (
      <div className={classNames(className)}>
        <Button onClick={onUndo}>Undo</Button>
        <Button onClick={onRedo}>Redo</Button>
        <Button onClick={onReset}>Reset</Button>
      </div>
    );
  }
}
export default UndoRedo;
