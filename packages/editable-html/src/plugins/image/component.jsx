import { Data, Raw } from 'slate';

import { LinearProgress } from 'material-ui/Progress';
import Portal from 'react-portal';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import { primary } from '../../theme';
import { withStyles } from 'material-ui/styles';

const log = debug('editable-html:plugins:image:component');

const logError = debug('editable-html:plugins:image:component');

logError.log = console.error.bind(console);

export class RawComponent extends React.Component {

  getWidth = (percent) => {
    const multiplier = percent / 100;
    return this.img.naturalWidth * multiplier;
  }

  getHeight = (percent) => {
    const multiplier = percent / 100;
    return this.img.naturalHeight * multiplier;
  }

  getPercentFromWidth = (width) => {
    var floored = (width / this.img.naturalWidth) * 4;
    return parseInt(floored.toFixed(0) * 25, 10);
  }

  applySizeData = () => {
    const { node, editor } = this.props;

    const resizePercent = node.data.get('resizePercent');

    let update = node.data;

    if (resizePercent) {
      const w = update.get('width');
      update = update.set('width', this.getWidth(resizePercent));

      const h = update.get('height');
      update = update.set('height', this.getHeight(resizePercent));
    } else {
      const w = update.get('width');
      if (w) {
        update = update.set('resizePercent', this.getPercentFromWidth(w));
      }
    }

    if (!update.equals(node.data)) {
      editor.change(c => c.setNodeByKey(node.key, { data: update }));
    }
  }

  componentDidMount() {
    this.applySizeData();
  }

  componentDidUpdate() {
    this.applySizeData();
  }

  render() {

    const { node, editor, classes, attributes, onFocus, onBlur } = this.props;
    const active = editor.value.isFocused && editor.value.selection.hasEdgeIn(node);
    const src = node.data.get('src');
    const percent = node.data.get('percent');
    const resizePercent = node.data.get('resizePercent');
    const loaded = node.data.get('loaded') !== false;
    const deleteStatus = node.data.get('deleteStatus');

    const style = {
      width: resizePercent ? `${node.data.get('width')}px` : 'auto',
      height: resizePercent ? `${node.data.get('height')}px` : 'auto'
    }

    const className = classNames(
      classes.root,
      active && classes.active,
      !loaded && classes.loading,
      deleteStatus === 'pending' && classes.pendingDelete);

    const progressClasses = classNames(
      classes.progress,
      loaded && classes.hideProgress);

    const resize = (amount) => this.resizeBy.bind(this, amount);
    log('showDelete: loaded: ', loaded, 'deleteStatus: ', deleteStatus);

    const showDelete = editor.value.isFocused && loaded && deleteStatus !== 'pending';

    return <div
      onFocus={onFocus}
      className={className}>
      <LinearProgress
        mode="determinate"
        value={percent > 0 ? percent : 0}
        className={progressClasses} />
      <img
        src={src}
        {...attributes}
        ref={r => this.img = r}
        style={style} />
    </div>
  }
}

RawComponent.propTypes = {
  onDelete: PropTypes.func.isRequired
}

const styles = {
  portal: {
    position: 'absolute',
    opacity: 0,
    transition: 'opacity 200ms linear'
  },
  floatingButtonRow: {
    backgroundColor: 'white',
    borderRadius: '1px',
    display: 'flex',
    padding: '10px',
    border: 'solid 1px #eeeeee',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
  },
  progress: {
    position: 'absolute',
    left: '0',
    width: '100%',
    top: '0%',
    transition: 'opacity 200ms linear'
  },
  hideProgress: {
    opacity: 0
  },
  loading: {
    opacity: 0.3
  },
  pendingDelete: {
    opacity: 0.3
  },
  root: {
    position: 'relative',
    border: 'solid 1px white',
    display: 'inline-flex',
    transition: 'opacity 200ms linear'
  },
  active: {
    border: `solid 1px ${primary}`
  },
  delete: {
    position: 'absolute',
    right: 0,
  }
}

export default withStyles(styles)(RawComponent);