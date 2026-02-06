import debug from 'debug';

const log = debug('@pie-lib:editable-html:image:insert-image-handler');

/**
 * Handles user selection, insertion (or cancellation) of an image into the editor.
 * @param {Block} placeholderBlock - a block that has been added to the editor as a place holder for the image
 * @param {Function} onFinish - a function to call if uploading fails or succeeds
 * @param {Function} getValue - a function to return the value of the editor
 * @param {Function} onChange - callback to notify changes applied by the handler
 * @param {Boolean} isPasted - a boolean that keeps track if the file is pasted
 */
class InsertImageHandler {
  constructor(editor, node, onFinish, isPasted = false) {
    this.editor = editor;
    this.node = node;

    let nodePos;

    editor.state.doc.descendants((node, pos) => {
      if (node === this.node) {
        nodePos = pos;
        return false;
      }
    });

    this.nodePos = nodePos;
    this.onFinish = onFinish;
    this.isPasted = isPasted;
    this.chosenFile = null;
  }

  cancel() {
    log('insert cancelled');

    try {
      this.deleteNode();
      this.onFinish(false);
    } catch (err) {
      //
    }
  }

  updateNode(newAttrs) {
    const { state, view } = this.editor;
    const { tr } = state;
    const node = state.doc.nodeAt(this.nodePos);

    if (node) {
      const transaction = tr.setNodeMarkup(this.nodePos, undefined, { ...node.attrs, ...newAttrs });

      view.dispatch(transaction);
    }
  }

  deleteNode() {
    const { state, view } = this.editor;
    const { tr } = state;

    const transaction = tr.delete(this.nodePos, this.nodePos + this.node.nodeSize);

    view.dispatch(transaction);
  }

  done(err, src) {
    log('done: err:', err);
    if (err) {
      //eslint-disable-next-line
      console.log(err);
      this.onFinish(false);
    } else {
      this.updateNode({ loaded: true, src, percent: 100 });
      this.onFinish(true);
    }
  }

  /**
   * Notify handler that the user chose a file - will create a change with a preview in the editor.
   *
   * @param {File} file - the file that the user chose using a file input.
   */
  fileChosen(file) {
    if (!file) {
      return;
    }

    // Save the chosen file to this.chosenFile
    this.chosenFile = file;

    log('[fileChosen] file: ', file);
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;

      this.updateNode({ src: dataURL });
    };
    reader.readAsDataURL(file);
  }

  progress(percent, bytes, total) {
    log('progress: ', percent, bytes, total);
    this.updateNode({ percent });
  }

  // Add a getter method to retrieve the chosen file
  getChosenFile() {
    return this.chosenFile;
  }
}

export default InsertImageHandler;
