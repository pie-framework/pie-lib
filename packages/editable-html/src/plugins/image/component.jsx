import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import SlatePropTypes from 'slate-prop-types';

const log = debug('@pie-lib:editable-html:plugins:image:component');

const size = s => (s ? `${s}px` : 'auto');

export class Component extends React.Component {
  static propTypes = {
    node: SlatePropTypes.node.isRequired,
    editor: PropTypes.shape({
      change: PropTypes.func.isRequired,
      value: PropTypes.object
    }).isRequired,
    classes: PropTypes.object.isRequired,
    attributes: PropTypes.object,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
  };

  getWidth = percent => {
    const multiplier = percent / 100;
    return this.img.naturalWidth * multiplier;
  };

  getHeight = percent => {
    const multiplier = percent / 100;
    return this.img.naturalHeight * multiplier;
  };

  getPercentFromWidth = width => {
    var floored = (width / this.img.naturalWidth) * 4;
    return parseInt(floored.toFixed(0) * 25, 10);
  };

  applySizeData = () => {
    const { node, editor } = this.props;

    const resizePercent = node.data.get('resizePercent');
    log('[applySizeData]: resizePercent: ', resizePercent);

    let update = node.data;

    if (resizePercent) {
      update = update.set('width', this.getWidth(resizePercent));
      update = update.set('height', this.getHeight(resizePercent));
    } else {
      const w = update.get('width');
      if (w) {
        update = update.set('resizePercent', this.getPercentFromWidth(w));
      }
    }

    log('[applySizeData] update: ', update);

    if (!update.equals(node.data)) {
      editor.change(c => c.setNodeByKey(node.key, { data: update }));
    }
  };

  componentDidMount() {
    this.applySizeData();
  }

  componentDidUpdate() {
    this.applySizeData();
  }

  getSize(data) {
    return {
      width: size(data.get('width')),
      height: size(data.get('height')),
      objectFit: 'contain'
    };
  }

  render() {
    const { node, editor, classes, attributes, onFocus } = this.props;
    const active = editor.value.isFocused && editor.value.selection.hasEdgeIn(node);
    const src = node.data.get('src');
    const percent = node.data.get('percent');
    const loaded = node.data.get('loaded') !== false;
    const deleteStatus = node.data.get('deleteStatus');

    log('[render] node.data:', node.data);

    const size = this.getSize(node.data);

    log('[render] style:', size);

    const className = classNames(
      classes.root,
      active && classes.active,
      !loaded && classes.loading,
      deleteStatus === 'pending' && classes.pendingDelete
    );

    const progressClasses = classNames(classes.progress, loaded && classes.hideProgress);

    return [
      <span key={'sp1'}>&nbsp;</span>,
      <div key={'comp'} onFocus={onFocus} className={className}>
        <LinearProgress
          mode="determinate"
          value={percent > 0 ? percent : 0}
          className={progressClasses}
        />
        <img src={src} {...attributes} ref={r => (this.img = r)} style={size} />
      </div>,
      <span key={'sp2'}>&nbsp;</span>
    ];
  }
}

const styles = theme => ({
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
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
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
    display: 'inline-block',
    transition: 'opacity 200ms linear'
  },
  active: {
    border: `solid 1px ${theme.palette.primary.main}`
  },
  delete: {
    position: 'absolute',
    right: 0
  }
});

export default withStyles(styles)(Component);
