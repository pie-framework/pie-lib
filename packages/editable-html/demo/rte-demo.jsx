import EditableHtml from '../src';
import React from 'react';
import { Value } from 'slate'
import _ from 'lodash';
import debug from 'debug';

const log = debug('editable-html:rte-demo');
const puppySrc = 'http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg'

/**
 * Note: See core schema rules - it normalizes so you can only have blocks or inline and text in a block.
 */
// const html = `<div><div>hi</div><img src="${puppySrc}"></img></div>`;
const html = `<span data-mathjax="">\\frac{1}{2}</span>`;


// const j = { "kind": "value", "document": { "kind": "document", "data": {}, "nodes": [{ "kind": "block", "type": "div", "nodes": [{ "kind": "text", "leaves": [{ "kind": "leaf", "text": "a" }] }, { "kind": "block", "type": "image", "isVoid": true, "nodes": [], "data": { "src": "http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg", "width": null, "height": null } }] }] } }

export default class RteDemo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      markup: html
    }
  }

  onChange = (markup) => {
    log('onChange: ');
    this.setState({ markup });
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

  render() {

    const { markup } = this.state;

    const imageSupport = {
      add: this.addImage,
      delete: this.onDeleteImage
    }

    return (<div>
      <h1>Editable Html Demo</h1>
      <EditableHtml
        markup={markup}
        onChange={this.onChange}
        imageSupport={imageSupport}
        onBlur={this.onBlur}
      />
      <input type="file" hidden ref={r => this.fileInput = r}></input>
      <br />
      <br />
      <h4>markup</h4>
      <pre>{markup}</pre>
    </div>);
  }
}

