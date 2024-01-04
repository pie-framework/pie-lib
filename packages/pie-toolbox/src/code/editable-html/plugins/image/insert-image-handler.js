import omit from 'lodash/omit';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:image:insert-image-handler');

/**
 * Handles user selection, insertion (or cancellation) of an image into the editor.
 * @param {Block} placeHolderPath - a block that has been added to the editor as a place holder for the image
 * @param {Function} getValue - a function to return the value of the editor
 * @param {Function} onFinish - a function to call if uploading fails or succeeds
 * @param {Function} onChange - callback to notify changes applied by the handler
 * @param {Boolean} isPasted - a boolean that keeps track if the file is pasted
 */
class InsertImageHandler {
  constructor(node, placeHolderPath, onFinish, editor, isPasted = false) {
    this.node = node;
    this.onFinish = onFinish;
    this.placeHolderPath = placeHolderPath;
    this.editor = editor;
    this.isPasted = isPasted;
    this.chosenFile = null;
  }

  cancel() {
    log('insert cancelled');
    this.editor.apply({
      type: 'remove_node',
      path: this.placeHolderPath,
    });

    this.onFinish(false);
  }

  done(err, src) {
    log('done: err:', err);
    if (err) {
      //eslint-disable-next-line
      console.log(err);
      this.onFinish(false);
    } else {
      this.editor.apply({
        type: 'set_node',
        path: this.placeHolderPath,
        properties: {
          data: this.node.data,
        },
        newProperties: {
          data: {
            src,
            loaded: true,
            percent: 100,
          },
        },
      });
      const newData = {
        ...this.node.data,
        src,
        loaded: true,
        percent: 100,
      };

      this.node = Object.assign({}, this.node, {
        data: omit(newData, 'newImage'),
      });

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

      this.editor.apply({
        type: 'set_node',
        path: this.placeHolderPath,
        properties: {
          data: this.node.data,
        },
        newProperties: {
          data: {
            ...this.node.data,
            src: dataURL,
          },
        },
      });
      this.node = Object.assign({}, this.node, { data: { src: dataURL } });
    };
    reader.readAsDataURL(file);
  }

  progress(percent, bytes, total) {
    log('progress: ', percent, bytes, total);

    this.editor.apply({
      type: 'set_node',
      path: this.placeHolderPath,
      properties: {
        data: this.node.data,
      },
      newProperties: {
        data: { ...this.node.data, percent },
      },
    });
    this.node = Object.assign({}, this.node, { data: { percent } });
  }

  // Add a getter method to retrieve the chosen file
  getChosenFile() {
    return this.chosenFile;
  }
}

export default InsertImageHandler;
