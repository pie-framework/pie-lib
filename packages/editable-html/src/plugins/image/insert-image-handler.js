import { Data } from 'slate';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:image:insert-image-handler');

/**
 * Handles user selection, insertion (or cancellation) of an image into the editor.
 * @param {Block} placeholderBlock - a block that has been added to the editor as a place holder for the image
 * @param {Function} getValue - a function to return the value of the editor
 * @param {Function} onChange - callback to notify changes applied by the handler
 * @param {Boolean} isPasted - a boolean that keeps track if the file is pasted
 */
class InsertImageHandler {
  constructor(placeholderBlock, getValue, onChange, isPasted = false) {
    this.placeholderBlock = placeholderBlock;
    this.getValue = getValue;
    this.onChange = onChange;
    this.isPasted = isPasted;
  }

  getPlaceholderInDocument(value) {
    const { document } = value;
    const directChild = document.getChild(this.placeholderBlock.key);

    if (directChild) {
      return directChild;
    }

    const child = document.getDescendant(this.placeholderBlock.key);

    if (child) {
      return child;
    } else {
      //eslint-disable-next-line
      throw new Error("insert-image: Can't find placeholder!");
    }
  }

  cancel() {
    log('insert cancelled');
    const c = this.getValue()
      .change()
      .removeNodeByKey(this.placeholderBlock.key);
    this.onChange(c);
  }

  done(err, src) {
    log('done: err:', err);
    if (err) {
      //eslint-disable-next-line
      console.log(err);
    } else {
      const value = this.getValue();
      const child = this.getPlaceholderInDocument(value);
      const data = child.data.merge(Data.create({ loaded: true, src, percent: 100 }));

      const change = value.change().setNodeByKey(this.placeholderBlock.key, { data });
      this.onChange(change);
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

    log('[fileChosen] file: ', file);
    const reader = new FileReader();
    reader.onload = () => {
      const value = this.getValue();
      const dataURL = reader.result;
      const child = this.getPlaceholderInDocument(value);
      const data = child.data.set('src', dataURL);
      const change = value.change().setNodeByKey(this.placeholderBlock.key, { data });
      this.onChange(change);
    };
    reader.readAsDataURL(file);
  }

  progress(percent, bytes, total) {
    log('progress: ', percent, bytes, total);
    const value = this.getValue();
    const child = this.getPlaceholderInDocument(value);
    const data = child.data.set('percent', percent);
    const change = value.change().setNodeByKey(this.placeholderBlock.key, { data });
    this.onChange(change);
  }
}

export default InsertImageHandler;
