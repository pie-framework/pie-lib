import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const useStyles = withStyles(() => ({
  root: {
    position: 'relative'
  },
  editor: {
    display: 'inline-block',
    overflow: 'hidden'
  }
}));

class MediaWrapper extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    children: PropTypes.array,
    editor: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  render() {
    const { editor, classes, children, width, ...rest } = this.props;

    return (
      <span
        className={classNames(classes.root, {
          [classes.editor]: editor
        })}
        {...rest}
        style={{
          width: width || 300
        }}
      >
        {children}
      </span>
    );
  }
}

export default useStyles(MediaWrapper);
