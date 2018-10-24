import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import SlatePropTypes from 'slate-prop-types';
import reduce from 'lodash/reduce';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

const log = debug('@pie-lib:editable-html:plugins:image:component');

const size = s => (s ? `${s}px` : 'auto');

export let showToolbar = true;

export class Component extends React.Component {
  static propTypes = {
    node: SlatePropTypes.node.isRequired,
    editor: PropTypes.shape({
      change: PropTypes.func.isRequired
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
    var floored = width / this.img.naturalWidth * 4;
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
      height: size(data.get('height'))
    };
  }

  onSpacerMouseDown = () => {
    showToolbar = false;

    setTimeout(() => {
      const sel = window.getSelection();
      const voidEl = sel.anchorNode.parentElement.closest('[data-slate-void]');

      if (!voidEl) {
        return;
      }

      sel.removeAllRanges();

      const prevEl = voidEl.previousSibling;
      const children = prevEl.querySelectorAll('*');
      const textNode = reduce(children, (ac, c) => {
        if (c.firstChild && c.firstChild.nodeType === Node.TEXT_NODE) {
          return c.firstChild;
        }
      }, {});
      const textLength = textNode.textContent.length;

      sel.setBaseAndExtent(textNode, textLength, textNode, textLength);
      showToolbar = true;
    }, 100);
  };

  /**
   * Getting 1 or 2 spaces depending on the previous element.
   * If the previous element is an empty text, 2 spaces are returned.
   * @returns {[string]}
   */
  getBeginningSpaces = () => {
    const parentJSON = this.props.parent.toJSON();
    const nodeJSON = this.props.node.toJSON();
    const spaces = [' '];
    let previousNode;

    for (let i = 0; i < parentJSON.nodes.length; i++) {
      const n = parentJSON.nodes[i];

      if (i !== 0 && isEqual(n, nodeJSON)) {
        previousNode = parentJSON.nodes[i - 1];
        break;
      }
    }

    if (previousNode) {
      previousNode.leaves.forEach((l) => {
        if (isEmpty(l.text)) {
          spaces.push(' ');
        }
      });
    }

    return spaces;
  };

  render() {
    const { node, editor, classes, attributes, onFocus } = this.props;
    const active =
      editor.value.isFocused && editor.value.selection.hasEdgeIn(node);
    const src = node.data.get('src');
    const percent = node.data.get('percent');
    const loaded = node.data.get('loaded') !== false;
    const deleteStatus = node.data.get('deleteStatus');

    log('[render] node.data:', node.data);

    const size = this.getSize(node.data);

    log('[render] style:', size);

    const className = classNames(
      classes.root,
      {
        [classes.active]: active && showToolbar,
        [classes.loading]: !loaded,
        [classes.pendingDelete]: deleteStatus === 'pending'
      }
    );

    const progressClasses = classNames(
      classes.progress,
      loaded && classes.hideProgress
    );

    return [
      <span
        key={'sp1'}
        onMouseDown={this.onSpacerMouseDown}
      >
        {this.getBeginningSpaces()}
      </span>,
      <div key={'comp'} onFocus={onFocus} className={className}>
        <LinearProgress
          mode="determinate"
          value={percent > 0 ? percent : 0}
          className={progressClasses}
        />
        <img src={src} {...attributes} ref={r => (this.img = r)} style={size}/>
      </div>,
      <span key={'sp2'}>
        &nbsp;
      </span>
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
