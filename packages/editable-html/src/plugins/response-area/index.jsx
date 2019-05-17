import { Inline, Text, Node } from 'slate';
import { cloneFragment } from 'slate-react';
import { DragSource, DropTarget } from '@pie-lib/drag';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import ChevronRight from '@material-ui/icons/ChevronRight';
import MoreVert from '@material-ui/icons/MoreVert';
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:plugins:response-area');

const getRotate = direction => {
  switch (direction) {
    case 'down':
      return 90;
    case 'up':
      return -90;
    case 'left':
      return 180;
    default:
      return 0;
  }
};

const Chevron = ({ direction, style }) => {
  const rotate = getRotate(direction);

  return (
    <ChevronRight
      style={{
        transform: `rotate(${rotate}deg)`,
        ...style
      }}
    />
  );
};

const GripIcon = ({ style }) => {
  return (
    <span style={style}>
      <MoreVert
        style={{
          margin: '0 -16px'
        }}
      />
      <MoreVert />
    </span>
  );
};

const useStyles = withStyles(theme => ({
  content: {
    border: `solid 0px ${theme.palette.primary.main}`
  },
  chip: {
    minWidth: '90px'
  },
  correct: {
    border: 'solid 1px green'
  },
  incorrect: {
    border: 'solid 1px red'
  }
}));

const BlankContent = ({ n, children, isDragging, dragItem, isOver, value }) => {
  console.log('Dragging', isDragging);

  const label = dragItem && isOver ? dragItem.value : value || '\u00A0';
  const finalLabel = isDragging ? '\u00A0' : label;
  const hasGrip = finalLabel !== '\u00A0';

  return (
    <div
      style={{
        display: 'inline-flex',
        minWidth: '178px',
        minHeight: '36px',
        height: '36px',
        background: '#FFF',
        border: '1px solid #C0C3CF',
        boxSizing: 'border-box',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative',
        padding: '8px 8px 8px 35px'
      }}
      data-key={n.key}
      contentEditable={false}
    >
      {hasGrip && (
        <GripIcon
          style={{
            position: 'absolute',
            top: '6px',
            left: '15px',
            color: '#9B9B9B'
          }}
          contentEditable={false}
        />
      )}
      <span
        dangerouslySetInnerHTML={{
          __html: finalLabel
        }}
      />
      {children}
    </div>
  );
};

const StyledBlankContent = useStyles(BlankContent);

const connectedBlankContent = useStyles(({ connectDropTarget, connectDragSource, ...props }) => {
  const { classes, isOver, value } = props;
  const dragContent = <StyledBlankContent {...props} />;
  const dragEl = !value ? dragContent : connectDragSource(<span>{dragContent}</span>);
  const content = (
    <span className={classnames(classes.content, isOver && classes.over)}>{dragEl}</span>
  );

  return connectDropTarget ? connectDropTarget(content) : content;
});

const tileTarget = {
  drop(props, monitor) {
    const draggedItem = monitor.getItem();

    if (!draggedItem.fromChoice || (draggedItem.fromChoice && props.duplicates)) {
      log('props.instanceId', props.instanceId, 'draggedItem.instanceId:', draggedItem.instanceId);
      props.onChange(draggedItem.value);
    }
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();

    return draggedItem.instanceId === props.instanceId;
  }
};

const DropTile = DropTarget('drag-in-the-blank-choice', tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem()
}))(connectedBlankContent);

const tileSource = {
  canDrag(props) {
    return !props.disabled && !!props.value;
  },
  beginDrag(props) {
    return {
      id: props.targetId,
      value: props.value,
      instanceId: props.instanceId,
      fromChoice: true
    };
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      if (props.type === 'target') {
        props.onRemoveChoice(monitor.getItem());
      }
    }
  }
};

const DragDropTile = DragSource('drag-in-the-blank-choice', tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(DropTile);

const isNumber = val => !isNaN(parseFloat(val)) && isFinite(val);

let clickInterval;

const insertSnackBar = message => {
  const prevSnacks = document.querySelectorAll('.response-area-alert');

  prevSnacks.forEach(s => s.remove());

  const newEl = document.createElement('div');

  newEl.className = 'response-area-alert';

  const el = (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={true}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={<span id="message-id">{message}</span>}
    />
  );

  ReactDOM.render(el, newEl);

  document.body.appendChild(newEl);

  setTimeout(() => {
    newEl.remove();
  }, 2000);
};

const findSN = key => document.querySelector('[data-key="' + key + '"]');

export default function ResponseAreaPlugin(opts) {
  const toolbar = {
    icon: (
      <div
        style={{
          fontFamily: 'Cerebri Sans',
          fontSize: '14px',
          lineHeight: '14px',
          position: 'relative',
          top: '7px',
          width: '110px',
          height: '28px'
        }}
      >
        + Response Area
      </div>
    ),
    onClick: (value, onChange) => {
      log('[toolbar] onClick');
      const change = value.change();
      let newInline;

      switch (opts.type) {
        case 'explicit-constructed-response':
          newInline = Inline.create({
            type: 'explicit_constructed_response',
            nodes: [Text.create('\u00A0')],
            data: {
              selected: null
            }
          });
          break;
        case 'drag-in-the-blank':
          newInline = Inline.create({
            type: 'drag_in_the_blank',
            isVoid: true,
            data: {
              duplicates: opts.options.duplicates,
              value: null
            }
          });
          break;
        default:
          // inline-dropdown
          newInline = Inline.create({
            type: 'inline_dropdown',
            nodes: [
              Inline.create({
                type: 'item_builder',
                nodes: [Text.create('\u00A0')]
              }),
              {
                object: 'inline',
                type: 'menu_item',
                data: {
                  id: 0,
                  value: 'Default Option 1',
                  isDefault: true
                },
                nodes: [Text.create('Default Option 1')]
              },
              {
                object: 'inline',
                type: 'menu_item',
                data: {
                  id: 1,
                  value: 'Default Option 2',
                  isDefault: true
                },
                nodes: [Text.create('Default Option 2')]
              }
            ],
            data: {
              open: false,
              selected: null
            }
          });
          break;
      }

      if (newInline) {
        change.insertInline(newInline);

        onChange(change);
      }
    },
    supports: node =>
      node.object === 'inline' && (node.type === 'inline_dropdown' || node.type === 'item_builder'),
    showDone: true
  };

  return {
    name: 'inline_dropdown',
    toolbar,
    pluginStyles: (parentNode, p) => {
      if (p && p.name === 'math') {
        const domNode = findSN(parentNode.key);
        const domNodeRect = domNode.getBoundingClientRect();
        const editor = domNode.closest('[data-slate-editor]');
        const editorRect = editor.getBoundingClientRect();
        const top = domNodeRect.top - editorRect.top;

        return {
          position: 'absolute',
          top: `${top + domNodeRect.height}px`,
          width: getComputedStyle(editor).width
        };
      }
    },

    schema: {
      document: { match: [{ type: 'inline_dropdown' }] }
    },

    // Doesn't need reset
    stopReset: () => {
      return true;
    },

    renderNode(props) {
      const { attributes, node: n } = props;

      if (n.type === 'item_builder') {
        return (
          <span
            {...attributes}
            style={{
              alignItems: 'center',
              background: '#E0E1E6',
              boxSizing: 'border-box',
              borderRadius: '2px 2px 0px 0px',
              display: 'inline-flex',
              minHeight: '52px',
              justifyContent: 'center',
              minWidth: '178px',
              width: '100%',
              cursor: 'initial',
              padding: '10px'
            }}
            contentEditable
            suppressContentEditableWarning
          >
            <span
              style={{
                background: '#fff',
                border: '2px solid #89B7F4',
                borderRadius: '3px',
                boxSizing: 'border-box',
                display: 'inline-block',
                minWidth: '160px',
                width: '100%',
                minHeight: '36px',
                position: 'relative',
                padding: '10px 25px 10px 10px'
              }}
              data-key={n.key}
              onMouseDown={e => {
                const value = props.editor.value;
                const change = value.change();
                const closestWithKey = e.target.closest('[data-key]');
                const key = closestWithKey.dataset.key;
                const currentNode = value.document.findDescendant(d => d.key === key);
                const lastText = currentNode.getLastText();

                setTimeout(() => {
                  const native = window.getSelection();
                  const p = native.anchorNode.parentElement.closest('[data-offset-key]');

                  if (p) {
                    const attr = p.getAttribute('data-offset-key');
                    const focusKey = attr.split(':')[0];

                    if (focusKey !== lastText.key) {
                      change
                        .moveFocusTo(lastText.key, lastText.text.length - 1)
                        .moveAnchorTo(lastText.key, lastText.text.length - 1);

                      props.editor.onChange(change);
                    }
                  }
                });
              }}
            >
              {props.children}
              <i
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  position: 'absolute',
                  top: '8px',
                  right: '8px'
                }}
                contentEditable={false}
                onMouseDown={e => {
                  const value = props.editor.value;
                  const { document } = value;
                  const change = value.change();
                  const inlineDropdown = document.getClosest(
                    n.key,
                    a => a.type === 'inline_dropdown'
                  );
                  const newVal = n.getText();

                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();

                  if (n.nodes.size !== 1 || (newVal && newVal !== '\u00A0')) {
                    const lastMenuItem = inlineDropdown.nodes.findLast(n => n.type === 'menu_item');
                    const clonedNodes = n.nodes.map(n => Node.create(n.toJSON()));
                    const node = Inline.create({
                      type: 'menu_item',
                      nodes: clonedNodes,
                      data: {
                        id: !lastMenuItem ? 0 : parseInt(lastMenuItem.data.get('id')) + 1
                      }
                    });

                    const jsonNode = n.toJSON();

                    change.insertNodeByKey(inlineDropdown.key, inlineDropdown.nodes.size, node);
                    change.replaceNodeByKey(
                      n.key,
                      Node.create({
                        ...jsonNode,
                        nodes: [Text.create('\u00A0')]
                      })
                    );
                  } else {
                    insertSnackBar('Choice cannot be empty');
                  }

                  props.editor.onChange(change);
                }}
              >
                +
              </i>
            </span>
          </span>
        );
      }

      if (n.type === 'response_menu_item') {
        return props.children;
      }

      if (n.type === 'menu_item') {
        const data = n.data.toJSON();

        console.log('Index', n.key, data.id);

        return (
          <span
            contentEditable={false}
            data-node-key={n.key}
            style={{
              background: data.clicked ? '#C4DCFA' : '#fff',
              boxSizing: 'border-box',
              display: 'block',
              minHeight: '45px',
              minWidth: '178px',
              cursor: 'pointer',
              lineHeight: '30px',
              padding: '10px 25px 10px 10px',
              margin: '0px 0px -20px 0px',
              position: 'relative'
            }}
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();

              const handleClick = (e, doubleClick) => {
                const val = props.editor.value;
                const change = val.change();
                const list = val.document.filterDescendants(d => d.type === 'menu_item');

                if (doubleClick) {
                  const closestEl = e.target.closest('[data-node-key]');
                  const key = closestEl.dataset.nodeKey;
                  // response area
                  const inlineDropdown = val.document.getClosest(
                    key,
                    a => a.type === 'inline_dropdown'
                  );
                  const newData = {
                    ...inlineDropdown.data.toJSON(),
                    open: false,
                    selected: null
                  };

                  const menuItem = inlineDropdown.findDescendant(
                    d => d.type === 'menu_item' && d.key === key
                  );

                  newData.selected = menuItem && menuItem.data.get('id');

                  console.log('Changing to', newData.selected);

                  change.setNodeByKey(inlineDropdown.key, {
                    data: newData
                  });
                  const nextText = val.document.getNextText(inlineDropdown.key);

                  change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);
                } else {
                  list.forEach(n =>
                    change.setNodeByKey(n.key, {
                      data: {
                        ...n.data.toJSON(),
                        clicked: false
                      }
                    })
                  );

                  change.setNodeByKey(n.key, {
                    data: {
                      ...data,
                      clicked: true
                    }
                  });
                }

                props.editor.onChange(change);
                clickInterval = undefined;
              };

              console.log('click', clickInterval);

              if (clickInterval) {
                clearInterval(clickInterval);
                handleClick(e, true);
              } else {
                clickInterval = setTimeout(() => handleClick(e), 200);
              }
            }}
          >
            <i
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                fontStyle: 'normal',
                position: 'absolute',
                top: '0',
                right: '0',
                zIndex: 3,
                width: '25px',
                height: '50px',
                lineHeight: '40px'
              }}
              data-key={n.key}
              onMouseDown={e => {
                const elKey = e.target.dataset.key;
                const val = props.editor.value;
                const inlineDropdown = val.document.getClosest(
                  elKey,
                  a => a.type === 'inline_dropdown'
                );
                const menuItems = inlineDropdown.filterDescendants(d => d.type === 'menu_item');
                const change = val.change();

                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();

                if (menuItems.size > 2) {
                  const elKey = e.target.dataset.key;

                  change.removeNodeByKey(elKey);
                } else {
                  insertSnackBar('You need to have at least 2 possible responses.');
                }

                props.editor.onChange(change);
              }}
            >
              x
            </i>
            <div
              style={{
                background: 'transparent',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2
              }}
            />
            {props.children}
          </span>
        );
      }

      if (n.type === 'explicit_constructed_response') {
        const data = n.data.toJSON();
        const { focused } = data;

        return (
          <span
            {...attributes}
            style={{
              display: 'inline-flex',
              minHeight: '50px',
              minWidth: '178px',
              position: 'relative',
              margin: '0 10px',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                cursor: 'default',
                display: focused ? 'block' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
              onClick={() => {
                const { value: val, onChange } = props.editor;
                const change = val.change();
                const nextText = val.document.getNextText(n.key);

                change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);
                change.setNodeByKey(n.key, {
                  data: { focused: false }
                });

                onChange(change);
              }}
            />
            <div
              style={{
                display: 'inline-flex',
                minWidth: '178px',
                minHeight: '36px',
                height: !data.focused && '36px',
                background: '#FFF',
                border: '1px solid #C0C3CF',
                boxSizing: 'border-box',
                borderRadius: '3px',
                overflow: 'hidden',
                position: data.focused ? 'absolute' : 'relative',
                padding: '8px'
              }}
              data-key={n.key}
              onMouseDown={e => {
                const value = props.editor.value;
                const change = value.change();
                const closestWithKey = e.target.closest('[data-key]');
                const key = closestWithKey.dataset.key;
                const currentNode =
                  key === n.key
                    ? value.document.findDescendant(d => d.key === key)
                    : value.document.getClosestInline(key);
                const lastText = currentNode.getLastText();

                setTimeout(() => {
                  const native = window.getSelection();
                  const p = native.anchorNode.parentElement.closest('[data-offset-key]');

                  if (p) {
                    const attr = p.getAttribute('data-offset-key');
                    const focusKey = attr.split(':')[0];

                    if (!focused || focusKey !== lastText.key) {
                      change
                        .moveFocusTo(lastText.key, lastText.text.length - 1)
                        .moveAnchorTo(lastText.key, lastText.text.length - 1);

                      change.setNodeByKey(currentNode.key, {
                        data: { focused: true }
                      });

                      props.editor.onChange(change);
                    }
                  }
                });
              }}
              contentEditable
              suppressContentEditableWarning
            >
              {props.children}
            </div>
          </span>
        );
      }

      if (n.type === 'drag_in_the_blank') {
        const data = n.data.toJSON();

        return (
          <span
            {...attributes}
            style={{
              display: 'inline-flex',
              minHeight: '50px',
              minWidth: '178px',
              position: 'relative',
              margin: '0 10px',
              cursor: 'pointer'
            }}
          >
            <DragDropTile
              n={n}
              targetId="0"
              value={data.value}
              duplicates={data.duplicates}
              onChange={value => {
                const val = props.editor.value;
                const change = val.change();

                change.setNodeByKey(n.key, {
                  data: { value }
                });

                props.editor.onChange(change);
              }}
            >
              {props.children}
            </DragDropTile>
          </span>
        );
      }

      if (n.type === 'inline_dropdown') {
        const data = n.data.toJSON();

        const openOrClose = open => {
          const key = n.key;
          const data = { open: open };
          const val = props.editor.value;
          const node = val.document.findDescendant(d => d.key === key);
          const itemBuilder = node.findDescendant(d => d.type === 'item_builder');
          const newChange = val.change();

          newChange.setNodeByKey(key, {
            data: {
              ...node.data.toJSON(),
              ...data
            }
          });

          if (open) {
            const firstText = itemBuilder.getFirstText();

            newChange.moveFocusTo(firstText.key, 0).moveAnchorTo(firstText.key, 0);
          } else {
            const inlineDropdown = val.document.getClosest(
              itemBuilder.key,
              a => a.type === 'inline_dropdown'
            );
            const nextText = val.document.getNextText(inlineDropdown.key);

            newChange.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);
          }

          props.editor.onChange(newChange);
        };

        const { open } = data;
        const getSelectedItem = () => {
          const selectedChildren = props.children.find(
            c => c.props.node.type === 'response_menu_item'
          );

          return selectedChildren ? React.cloneElement(selectedChildren) : null;
        };

        const selectedItem = getSelectedItem();
        const filteredItems = props.children.filter(
          c => c.props.node.type !== 'response_menu_item'
        );

        console.log('Open', open);

        return (
          <span
            {...attributes}
            style={{
              display: 'inline-flex',
              height: '50px',
              position: 'relative',
              top: '10px',
              margin: '0 10px',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                minWidth: '178px',
                height: '36px',
                background: '#FFF',
                border: '1px solid #C0C3CF',
                boxSizing: 'border-box',
                borderRadius: '3px',
                position: 'relative',
                bottom: '10px'
              }}
              contentEditable={false}
              onClick={() => openOrClose(true)}
            >
              <div
                style={{
                  background: 'transparent',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
              />
              <div
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  padding: '8px 25px 8px 8px'
                }}
              >
                {selectedItem || '\u00A0'}
              </div>
              <Chevron
                direction="down"
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px'
                }}
              />
            </div>
            <div
              style={{
                cursor: 'default',
                display: open ? 'block' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
              onClick={() => openOrClose(false)}
            />
            <div
              style={{
                background: '#fff',
                position: 'absolute',
                top: '30px',
                display: 'block',
                minWidth: '178px',
                border: '1px solid #E0E1E6',
                boxSizing: 'border-box',
                boxShadow: '0px 0px 5px rgba(126, 132, 148, 0.3)',
                borderRadius: '3px',
                maxHeight: '400px',
                overflow: 'scroll',
                zIndex: open ? 2 : -1,
                visibility: open ? 'visible' : 'hidden'
              }}
            >
              {filteredItems}
            </div>
          </span>
        );
      }
    },
    normalizeNode: node => {
      if (node.object !== 'document' && node.type !== 'inline_dropdown') {
        return;
      }

      const removeSelectionArray = [];
      const altChangesMap = {};
      const changeSelectionArray = [];
      const removeValueOnCloseArray = [];
      const addItemBuilder = [];

      const shouldRemoveSelection = node => {
        const selected = node.data.get('selected');

        if (!isNumber(selected)) {
          return false;
        }

        const selectedMenuItem = node.findDescendant(d => {
          if (d.type === 'menu_item') {
            const id = d.data.get('id');

            return `${id}` === `${selected}`;
          }
        });

        return !selectedMenuItem;
      };

      const shouldChangeSelection = node => {
        const selected = node.data.get('selected');
        const selectedMenuItem = node.findDescendant(d => {
          if (d.type === 'menu_item') {
            const id = d.data.get('id');

            return `${id}` === `${selected}`;
          }
        });

        if (!isNumber(selected)) {
          return false;
        }

        const hasResponse = node.findDescendant(d => d.type === 'response_menu_item');

        if (hasResponse) {
          const jsResponse = hasResponse.toJSON();
          const jsItem = selectedMenuItem && selectedMenuItem.toJSON();
          const respId = jsResponse.data.id;

          return !(
            `${respId}` === `${selected}` &&
            (!jsItem || isEqual(jsResponse.nodes, jsItem.nodes))
          );
        }

        return true;
      };
      const shouldRemoveValueOnClose = node => {
        if (node.data.get('open')) {
          return false;
        }

        const itemBuilder = node.findDescendant(d => d.type === 'item_builder');
        const text = itemBuilder && itemBuilder.getText();

        return !(text === '\u00A0' || isEmpty(text));
      };
      const shouldAddItemBuilder = node => {
        const itemBuilder = node.findDescendant(d => d.type === 'item_builder');

        return !itemBuilder;
      };

      if (node.object === 'document') {
        const inlineDropdowns = node.filterDescendants(d => d.type === 'inline_dropdown');

        inlineDropdowns.forEach(respArea => {
          if (shouldRemoveSelection(respArea)) {
            removeSelectionArray.push(respArea);
          } else {
            if (shouldChangeSelection(respArea)) {
              changeSelectionArray.push(respArea);
            }

            if (shouldRemoveValueOnClose(respArea)) {
              removeValueOnCloseArray.push(respArea);
            }

            if (shouldAddItemBuilder(respArea)) {
              addItemBuilder.push(respArea);
            }
          }
        });

        if (inlineDropdowns.length) {
          const mathNode = node.findDescendant(d => d.type === 'math');

          if (removeSelectionArray.length === 0 && mathNode) {
            const prevText = node.getPreviousText(mathNode.key);
            const nextText = node.getNextText(mathNode.key);
            const fn = (text, pos) => {
              const index = pos === 'l' ? (text.length || 1) - 1 : 0;
              const t = text[index];

              return t !== ' ';
            };

            if (fn(prevText.text, 'l')) {
              altChangesMap['prev'] = prevText;
            }

            if (fn(nextText.text, 'f')) {
              altChangesMap['next'] = nextText;
            }
          }
        }
      }

      if (node.type === 'inline_dropdown') {
        if (shouldRemoveSelection(node)) {
          removeSelectionArray.push(node);
        } else {
          if (shouldChangeSelection(node)) {
            changeSelectionArray.push(node);
          }

          if (shouldRemoveValueOnClose(node)) {
            removeValueOnCloseArray.push(node);
          }

          if (shouldAddItemBuilder(node)) {
            addItemBuilder.push(node);
          }
        }
      }

      if (
        /*!removeSelectionArray.length &&*/
        !changeSelectionArray.length &&
        !removeValueOnCloseArray.length &&
        !addItemBuilder.length &&
        isEmpty(altChangesMap)
      ) {
        return;
      }

      const getInsertInfo = node => {
        // current selected id
        const selected = node.data.get('selected');
        // searching for previous selected, to delete
        const prevSelected = node.findDescendant(d => d.type === 'response_menu_item');
        const selectedItem = node.findDescendant(
          d => d.type === 'menu_item' && `${d.data.get('id')}` === `${selected}`
        );
        const jsonItem = selectedItem.toJSON();
        const newNode = Node.create({
          ...jsonItem,
          type: 'response_menu_item',
          data: {
            ...jsonItem.data,
            response: true
          }
        });

        return {
          key: node.key,
          offset: node.nodes.size,
          newNode,
          prevSelected
        };
      };

      return change => {
        change.withoutNormalization(() => {
          removeSelectionArray.forEach(n => {
            change.setNodeByKey(n.key, {
              data: {
                open: n.data.get('open')
              }
            });
          });

          changeSelectionArray.forEach(n => {
            const { key, offset, newNode, prevSelected } = getInsertInfo(n);

            if (prevSelected) {
              change.removeNodeByKey(prevSelected.key);
            }

            change.insertNodeByKey(key, offset, newNode);
          });

          removeValueOnCloseArray.forEach(n => {
            const itemBuilder = n.findDescendant(d => d.type === 'item_builder');
            const jsonNode = itemBuilder.toJSON();

            change.replaceNodeByKey(
              itemBuilder.key,
              Node.create({
                ...jsonNode,
                nodes: [Text.create('\u00A0')]
              })
            );
          });

          addItemBuilder.forEach(n => {
            const node = Inline.create({
              type: 'item_builder',
              nodes: [Text.create('\u00A0')]
            });

            change.insertNodeByKey(n.key, 0, node);
          });

          if (altChangesMap.prev) {
            change.insertTextByKey(altChangesMap.prev.key, altChangesMap.prev.text.length, ' ');
          }

          if (altChangesMap.next) {
            change.insertTextByKey(altChangesMap.next.key, 0, ' ');
          }
        });
      };
    },
    onKeyDown(event, change, editor) {
      const { startKey, startOffset, startText, endOffset, document } = editor.value;
      const closesInline = document.getClosestInline(startKey);

      const ARROW_LEFT = 37;
      const ARROW_RIGHT = 39;
      const ARROW_UP = 38;
      const ARROW_DOWN = 40;
      const A_KEY = 65;
      const C_KEY = 67;
      const V_KEY = 86;
      const BACKSPACE_KEY = 8;
      const DELETE_KEY = 46;
      let shouldCancel = null;

      if (closesInline && closesInline.type === 'item_builder') {
        const key = event.keyCode || event.which;

        if (
          key === A_KEY ||
          key === C_KEY ||
          key === V_KEY ||
          (key >= 35 && key <= 40) ||
          key === BACKSPACE_KEY ||
          key === DELETE_KEY
        ) {
          let allText = '';
          let length = 0;

          closesInline.forEachDescendant(d => {
            length += d.text.length;
            allText = `${allText}${d.text}`;
          });

          const preventEvent = () => {
            event.preventDefault();
            event.nativeEvent.stopImmediatePropagation();
            shouldCancel = true;
          };

          if (startOffset === 0) {
            if (key === ARROW_LEFT || key === ARROW_UP) {
              preventEvent();

              console.log('Moved Left');

              if (startOffset !== endOffset) {
                change.moveOffsetsTo(0);
              }
            }

            if (key === BACKSPACE_KEY && startOffset === endOffset) {
              preventEvent();
            }
          }

          if (length - startOffset <= 1) {
            if (key === ARROW_RIGHT || key === ARROW_DOWN) {
              preventEvent();
              console.log('Moved Right');
            }

            if (key === DELETE_KEY && startOffset === endOffset) {
              preventEvent();
            }
          }

          const goToBeginning = () => {
            if (key === 36) {
              return true;
            }

            const altKey = event.metaKey;

            return altKey && (key === ARROW_LEFT || key === ARROW_UP);
          };

          const goToEnd = () => {
            if (key === 35) {
              return true;
            }

            const altKey = event.metaKey;

            return altKey && (key === ARROW_RIGHT || key === ARROW_DOWN);
          };

          if (goToEnd()) {
            preventEvent();

            change.moveAnchorOffsetTo(length - 1);

            if (!event.shiftKey) {
              change.moveFocusOffsetTo(length - 1);
            }

            editor.onChange(change);
            console.log('Moved To End');
          }

          if (goToBeginning()) {
            preventEvent();
            change.moveAnchorOffsetTo(0);

            if (!event.shiftKey) {
              change.moveFocusOffsetTo(0);
            }

            editor.onChange(change);
            console.log('Moved To Start');
          }

          if (event.cmdKey || event.metaKey) {
            if (key === A_KEY) {
              const firstText = closesInline.getFirstText();
              const lastText = closesInline.getLastText();

              preventEvent();

              change
                .moveFocusTo(firstText.key, 0)
                .moveAnchorTo(lastText.key, lastText.text.length - 1);
              console.log('Select All');
            }

            if (key === C_KEY) {
              preventEvent();

              console.log(cloneFragment);
            }

            if (key === V_KEY) {
              console.log('Paste');
            }
          }

          setTimeout(() => {
            const { startKey, document } = editor.value;
            const closestItemBuilder = document.getClosest(
              startKey,
              a => a.type === 'item_builder'
            );

            if (!closestItemBuilder) {
              change
                .moveFocusTo(startText.key, startText.text.length - 1)
                .moveAnchorTo(startText.key, startText.text.length - 1);

              editor.onChange(change);
              console.log('A iesit');
            }
          }, 0);
        }
      }

      const native = window.getSelection();

      /*
       * If after pressing a key the focus moves inside the ecr input
       * we expand the item
       * */
      if (!closesInline || closesInline.type !== 'explicit_constructed_response') {
        setTimeout(() => {
          const { document, startKey, startOffset } = editor.value;
          const closestEl =
            native.anchorNode && native.anchorNode.parentElement.closest('[data-key]');
          const closestKey = closestEl && closestEl.dataset.key;
          const closestEcr =
            closestKey &&
            document.getClosest(closestKey, a => a.type === 'explicit_constructed_response');

          if (closestEcr) {
            change.moveFocusTo(closestKey, startOffset).moveAnchorTo(closestKey, startOffset);
            change.setNodeByKey(closestEcr.key, {
              data: { focused: true }
            });

            editor.onChange(change);
          }
        }, 0);
      }

      const closestEl = native.anchorNode && native.anchorNode.parentElement.closest('[data-key]');
      const closestKey = closestEl && closestEl.dataset.key;
      const closestEcr = closestKey && document.getClosestInline(closestKey);

      if (closestEcr && closestEcr.type === 'explicit_constructed_response') {
        const inlineDOMNode = findSN(closestEcr);
        const absoluteChild = inlineDOMNode.childNodes[1];
        const childStyle = getComputedStyle(absoluteChild);

        inlineDOMNode.style.width = childStyle.width;
      }

      setTimeout(() => {
        const closestEl =
          native.anchorNode && native.anchorNode.parentElement.closest('[data-key]');
        const closestKey = closestEl && closestEl.dataset.key;
        const closestEcr = closestKey && document.getClosestInline(closestKey);

        if (closestEcr) {
          const lastText = closestEcr.getLastText();

          if (
            lastText.text === native.anchorNode.textContent &&
            native.anchorOffset === lastText.text.length
          ) {
            change
              .moveFocusTo(lastText.key, lastText.text.length - 1)
              .moveAnchorTo(lastText.key, lastText.text.length - 1);

            editor.onChange(change);
            console.log('A iesit');
          }
        }
      }, 0);

      return shouldCancel;
    },
    onDrop(event, change, editor) {
      const closestEl = event.target.closest('[data-key]');
      const inline = editor.value.document.findDescendant(d => d.key === closestEl.dataset.key);

      if (inline.type === 'drag_in_the_blank') {
        return false;
      }
    }
  };
}

export const serialization = {
  deserialize(el, next) {
    const type = el.dataset && el.dataset.type;

    const createDefaultMenuItem = (id, label) => ({
      object: 'inline',
      type: 'menu_item',
      data: {
        id,
        value: label,
        isDefault: true
      },
      nodes: [Text.create(label)]
    });
    const createDefaultMenuItems = nodes => {
      const newMenuItems = nodes.map(n => {
        if (n.data.isDefault) {
          return createDefaultMenuItem(1, 'Default Option 1');
        }

        return n;
      });

      if (newMenuItems.length === 1) {
        newMenuItems.push(createDefaultMenuItem(2, 'Default Option 2'));
      }

      return newMenuItems;
    };
    const getChildNodes = nodes => {
      const nextNodes = next(nodes);

      return nextNodes.length >= 2 ? nextNodes : createDefaultMenuItems(nextNodes);
    };

    switch (type) {
      case 'inline_dropdown':
        return {
          object: 'inline',
          type: 'inline_dropdown',
          data: {
            selected: isNumber(el.dataset.correctId) ? parseInt(el.dataset.correctId) : undefined
          },
          nodes: getChildNodes(el.childNodes)
        };
      case 'menu_item':
        return {
          object: 'inline',
          type: 'menu_item',
          data: {
            value: el.textContent,
            id: el.dataset.id,
            isDefault: el.dataset.isDefault
          },
          nodes: next(el.childNodes)
        };
      case 'explicit_constructed_response':
        return {
          object: 'inline',
          type: 'explicit_constructed_response',
          nodes: next(el.childNodes)
        };
      case 'drag_in_the_blank':
        return {
          object: 'inline',
          type: 'drag_in_the_blank',
          isVoid: true,
          data: {
            id: el.dataset.id,
            value: el.dataset.value
          }
        };
    }
  },
  serialize(object, children) {
    if (object.object !== 'inline') {
      return;
    }

    switch (object.type) {
      case 'inline_dropdown': {
        return (
          <span data-type="inline_dropdown" data-correct-id={object.data.get('selected')}>
            {children}
          </span>
        );
      }
      case 'explicit_constructed_response': {
        return <span data-type="explicit_constructed_response">{children}</span>;
      }
      case 'drag_in_the_blank': {
        const jsonData = object.data.toJSON();

        return (
          <span data-type="drag_in_the_blank" data-id={jsonData.id} data-value={jsonData.value} />
        );
      }
      case 'item_builder':
      case 'response_menu_item':
        return null;
      case 'menu_item': {
        const jsonData = object.data.toJSON();

        return (
          <span data-type="menu_item" data-id={jsonData.id} data-is-default={jsonData.isDefault}>
            {children}
          </span>
        );
      }
    }
  }
};
