// import TextEditor, { htmlToState, stateToHtml } from '../src/rte';

import EditableHtml from '../src';
import { Raw } from 'slate';
import React from 'react';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import debug from 'debug';

const log = debug('editable-html:rte-demo');

class RteDemo extends React.Component {

  puppy = 'https://s-media-cache-ak0.pinimg.com/736x/ed/0e/68/ed0e68d1f8a0a1f4b5582ed180cce761--puppy-training-tips-images-photos.jpg';

  markup = `<div>
    <div> 
       <img src="${this.puppy}"></img>
       </div>
  </div>`;

  state = {
    editorState: htmlToState(this.markup),
    markup: this.markup
  }

  handleInputFiles = (input) => {
    log('[handleInputFiles] input: ', input);

    const { imageHandler } = this.state;
    if (input.files.length < 1 || !input.files[0]) {
      imageHandler.cancel();
      this.setState({ imageHandler: null });
    } else {
      const file = input.files[0];
      imageHandler.fileChosen(file);
      this.fileInput.value = '';
      const reader = new FileReader();
      reader.onload = () => {
        log('[reader.onload]');
        const dataURL = reader.result;
        setTimeout(() => {
          imageHandler.done(null, dataURL);
          this.setState({ imageHandler: null });
        }, 2000);
      };
      log('call readAsDataUrl...', file);
      let progress = 0;
      imageHandler.progress(progress);
      _.range(1, 100).forEach(n => {
        setTimeout(() => {
          imageHandler.progress(n);
        }, n * 20);
      });
      reader.readAsDataURL(file);
    }
  }

  handleFileSelect = (event) => {

    log('[handleFileSelect] event: ', event);

    //disable the check cancelled call
    this.setState({ checkCancelled: false }, () => {
      this.handleInputFiles(event.target);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.insertImage !== nextState.insertImage) {
      console.log('skip update if the insertImageCallback has changed');
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.fileInput.addEventListener('change', this.handleFileSelect);
  }

  componentWillUnmount() {
    this.fileInput.removeEventListener('change', this.handleFileSelect);
  }

  addImage = (imageHandler) => {
    log('[addImage]', imageHandler);
    this.setState({ imageHandler });
    this.fileInput.click();

    /**
     * There's no way to know if 'cancel' was clicked,
     * instead we have to listen for a focus on body,
     * then call handleInputFiles if checkCancelled is true.
     * It's set to false if a 'change' event is fired.
     */
    document.body.onfocus = (e) => {
      log('focus document...', this.fileInput.files);
      document.body.onfocus = null;
      this.setState({ checkCancelled: true }, () => {
        setTimeout(() => {
          if (this.state.checkCancelled) {
            this.handleInputFiles(this.fileInput);
          }
        }, 200);
      });
    }
  }

  onDeleteImage = (url, done) => {
    log('delete image src: ', url);
    done();
  }

  onMarkupChange = (markup) => {
    log('new markup: ', markup);
    this.setState({ markup });
  }

  render() {

    const imageSupport = {
      add: this.addImage,
      delete: this.onDeleteImage
    }

    const { editorState } = this.state;
    return <div>
      <h1>@pie-lib/editable-html</h1>
      <input type="text"></input>
      <EditableHtml
        markup={this.state.markup}
        imageSupport={imageSupport}
        onChange={this.onMarkupChange}
      />
      {/* <TextField />
      <p>other</p>
      <input type="text"></input> */}
      {/* <EditableHtml
        markup={this.state.markup}
        imageSupport={imageSupport}
        onChange={this.onMarkupChange}
      /> */}
      <input type="file" hidden ref={r => this.fileInput = r}></input>
      <pre style={{ maxWidth: '100%' }}>{this.state.markup}</pre>
    </div>;
  }
}

export default RteDemo

