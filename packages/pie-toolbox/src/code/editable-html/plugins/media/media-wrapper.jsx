import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  editor: {
    display: 'inline-block',
    overflow: 'hidden',
  },
}));

const MediaWrapper = React.forwardRef((props, ref) => {
  const { children, width, attributes, ...rest } = props;
  const classes = useStyles(props);

  return (
    <span
      className={classNames(classes.root, {
        [classes.editor]: editor,
      })}
      ref={ref}
      {...rest}
      {...attributes}
      contentEditable={false}
      style={{
        width: width || 300,
      }}
    >
      {children}
    </span>
  );
});

MediaWrapper.propTypes = {
  attributes: PropTypes.object,
  classes: PropTypes.object,
  children: PropTypes.array,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default MediaWrapper;
