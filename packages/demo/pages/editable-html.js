import EditableHtml, { ALL_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';
import grey from '@material-ui/core/colors/grey';
import React from 'react';
import _ from 'lodash';
import debug from 'debug';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import withRoot from '../source/withRoot';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import InputChooser from '../source/editable-html/input-chooser';
import { hasText } from '@pie-lib/pie-toolbox/render-ui';
import InlineDropdownToolbar from './inline-dropdown-toolbar';

const log = debug('@pie-lib:editable-html:demo');
const puppySrc = 'https://bit.ly/23yROY8';

/**
 * Note: See core schema rules - it normalizes so you can only have blocks or inline and text in a block.
 */
const inputOptions = [
  {
    label: 'An image in a P tag',
    html: `<div><p><img src="${puppySrc}" style="width:170px;height:151px"/> bar</p><p><img src="${puppySrc}" style="width:170px;height:151px"/> bar</p></div>`,
  },
  {
    label: 'Latex \\(..\\)',
    html:
      '<p>Which of these northern European countries are EU members? <math><mstack><msrow><mn>111</mn></msrow><msline/></mstack></math></p>',
  },
  {
    label: 'Latex $..$',
    html: '<div><span data-latex="">$\\frac{1}{2}$</span></div>',
  },
  {
    label: 'Latex \\displaystyle',
    html: '<div><span data-latex="">\\(\\displaystyle - \\frac{36}{55}\\)</span></div>',
  },
  {
    label: 'Nested div w/ image',
    html: '<div>​<div><img source="foo.com/img.png"/></div>​</div>',
  },
  {
    label: 'Nested div w/ text',
    html: '<div>​<div>hi</div>​</div>',
  },
  {
    label: 'Table',
    html: '<table border="1"><tr><td>a</td><td>b</td></tr></table>',
  },
  {
    label: 'Table Complex',
    html:
      '<table cellspacing="0" cellpadding="4" class="borderall"> <tbody> <tr> <td style="width:140px" class="center bold">Trial</td> <td style="width:140px" class="center bold">Mass NH<sub>3</sub></td> <td style="width:140px" class="center bold">Mass HCl</td> <td style="width:140px" class="center bold">Mass NH<sub>4</sub>Cl</td> </tr> <tr> <td class="center">1</td> <td class="center">3.40 g</td> <td class="center">7.30 g</td> <td class="center">10.70 g</td> </tr> <tr> <td class="center">2</td> <td class="center">?</td> <td class="center">?</td> <td class="center">32.10 g</td> </tr> </tbody></table>',
  },
];

const html = inputOptions[1].html;

class RawMarkupPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    markup: PropTypes.string.isRequired,
  };

  render() {
    const { markup, classes } = this.props;
    return (
      <div>
        <Typography variant="h6">Markup</Typography>
        <div ref={(r) => (this.preview = r)} dangerouslySetInnerHTML={{ __html: markup }} />
        <hr />
        <Typography variant="subtitle1">Raw</Typography>
        <pre className={classes.prettyPrint}>{markup}</pre>
        <hr />
      </div>
    );
  }
}

const MarkupPreview = withStyles(() => ({
  prettyPrint: {
    whiteSpace: 'normal',
    width: '100%',
  },
}))(RawMarkupPreview);

class RteDemo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      markup: html,
      showHighlight: false,
      disableImageUpload: false,
      disabled: false,
      width: '',
      height: '',
      keypadMode: 'miscellaneous',
      markupText: html,
      hasText: true,
      mathEnabled: true,
      languageCharactersProps: [{ language: 'spanish' }, { language: 'special' }],
    };
  }

  onChange = (markup) => {
    log('onChange: ');
    this.setState({ markup });
  };

  onChangeMarkupText = (markupText) => {
    log('onChangeMarkupText: ');
    this.setState({ markupText, hasText: hasText(markupText) });
  };

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
      _.range(1, 100).forEach((n) => {
        setTimeout(() => {
          imageHandler.progress(n);
        }, n * 20);
      });
      reader.readAsDataURL(file);
    }
  };

  handleFileSelect = (event) => {
    log('[handleFileSelect] event: ', event);
    //disable the check cancelled call
    this.setState({ checkCancelled: false }, () => {
      this.handleInputFiles(event.target);
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.insertImage !== nextState.insertImage) {
      console.log('skip update if the insertImageCallback has changed');
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate() {
    if (this.fileInput) {
      this.fileInput.addEventListener('change', this.handleFileSelect);
    }
  }

  componentWillUnmount() {
    this.fileInput.removeEventListener('change', this.handleFileSelect);
  }

  addImage = (imageHandler) => {
    log('[addImage]', imageHandler);

    if (imageHandler.isPasted && imageHandler.getChosenFile) {
      this.setState({ imageHandler }, () => {
        // this is for images that were pasted into the editor (or dropped)
        // they also need to be uploaded, but the file input doesn't have to be used
        const file = imageHandler.getChosenFile();

        this.handleInputFiles({ files: [file] });
      });
      return;
    }

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
    };
  };

  onDeleteImage = (url, done) => {
    log('delete image source: ', url);
    done();
  };

  updateEditorMarkup = () => {
    this.setState({ markup: this.state.userHtml });
  };

  render() {
    const { classes } = this.props;
    const {
      markup,
      showHighlight,
      disableImageUpload,
      disabled,
      width,
      height,
      mounted,
      keypadMode,
      markupText,
      hasText,
      mathEnabled,
      languageCharactersProps,
    } = this.state;
    const imageSupport = {
      add: this.addImage,
      delete: this.onDeleteImage,
    };

    log('this.state', this.state);

    //activePlugins={['bold', 'bulleted-list', 'numbered-list']}
    return mounted ? (
      <div>
        <Typography variant="h6">EditableHtml</Typography>
        <Typography variant="body2">A rich text editor with a material design look.</Typography>
        <br />
        <InputChooser inputOptions={inputOptions} onChange={(markup) => this.setState({ markup })} />
        <div className={classes.controls}>
          <Typography variant="headline">Runtime Options</Typography>
          <FormGroup row>
            <FormControlLabel
              control={
                <Select
                  name="keypadMode"
                  value={keypadMode}
                  onChange={(event) => this.setState({ keypadMode: event.target.value })}
                  input={<Input id="keypadMode" />}
                >
                  <MenuItem value="1">Grade 1 - 2</MenuItem>
                  <MenuItem value="3">Grade 3 - 5</MenuItem>
                  <MenuItem value="6">Grade 6 - 7</MenuItem>
                  <MenuItem value="8">Grade 8 - HS</MenuItem>
                  <MenuItem value="geometry">Geometry</MenuItem>
                  <MenuItem value="advanced-algebra">Advanced Algebra</MenuItem>
                  <MenuItem value="statistics">Statistics</MenuItem>
                  <MenuItem value="miscellaneous">Miscellaneous</MenuItem>
                </Select>
              }
              label="Equation editor"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showHighlight}
                  onChange={(event) => this.setState({ showHighlight: event.target.checked })}
                />
              }
              label="show highlight"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={disableImageUpload}
                  onChange={(event) => this.setState({ disableImageUpload: event.target.checked })}
                />
              }
              label="disable image upload"
            />
            <FormControlLabel
              control={
                <Checkbox checked={disabled} onChange={(event) => this.setState({ disabled: event.target.checked })} />
              }
              label="disabled"
            />
            <TextField
              className={classes.sizeInput}
              placeholder={'width'}
              value={width}
              onChange={(event) => this.setState({ width: event.target.value })}
            />
            <TextField
              className={classes.sizeInput}
              placeholder={'height'}
              value={height}
              onChange={(event) => this.setState({ height: event.target.value })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={mathEnabled}
                  onChange={(event) => this.setState({ mathEnabled: event.target.checked })}
                />
              }
              label="math enabled"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={languageCharactersProps.filter((a) => a.language === 'spanish').length > 0}
                  onChange={(event) =>
                    this.setState({
                      languageCharactersProps: event.target.checked
                        ? languageCharactersProps.concat([{ language: 'spanish' }])
                        : languageCharactersProps.filter((a) => a.language !== 'spanish'),
                    })
                  }
                />
              }
              label="spanish enabled"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={languageCharactersProps.filter((a) => a.language === 'special').length > 0}
                  onChange={(event) =>
                    this.setState({
                      languageCharactersProps: event.target.checked
                        ? languageCharactersProps.concat([{ language: 'special' }])
                        : languageCharactersProps.filter((a) => a.language !== 'special'),
                    })
                  }
                />
              }
              label="special enabled"
            />
          </FormGroup>
        </div>
        <EditableHtml
          activePlugins={ALL_PLUGINS}
          markup={markup}
          onChange={this.onChange}
          imageSupport={imageSupport}
          onBlur={this.onBlur}
          disabled={disabled}
          highlightShape={showHighlight}
          pluginProps={{
            image: {
              disabled: disableImageUpload,
            },
            math: {
              disabled: !mathEnabled,
              keypadMode: this.state.keypadMode,
            },
          }}
          responseAreaProps={{
            type: 'inline-dropdown',
            options: {
              duplicates: true,
            },
            maxResponseAreas: 3,
            respAreaToolbar: (node, value, onToolbarDone) => {
              let { respAreaChoices } = this.state;
              const { data: nodeData } = node;

              respAreaChoices = respAreaChoices || [];

              return () => (
                <InlineDropdownToolbar
                  onAddChoice={this.onAddChoice}
                  onCheck={this.onCheck}
                  onRemoveChoice={(index) => this.onRemoveChoice(nodeData.index, index)}
                  onSelectChoice={(index) => this.onSelectChoice(nodeData.index, index)}
                  node={node}
                  value={value}
                  onToolbarDone={onToolbarDone}
                  choices={respAreaChoices[nodeData.index]}
                  spellCheck={false}
                  uploadSoundSupport={null}
                />
              );
            },
          }}
          width={width}
          height={height}
          languageCharactersProps={languageCharactersProps}
          // mathMlOptions={{
          //   mmlEditing: true,
          //   mmlOutput: true
          // }}
        />
        <input type="file" hidden ref={(r) => (this.fileInput = r)} />
        <br />
        <MarkupPreview markup={markup} />
        <br />
        <Typography variant="h6">Check if input contains text using the hasText function:</Typography>
        <br />
        {/*<EditableHtml markup={markupText} onChange={this.onChangeMarkupText} width={width} height={height} />*/}
        <br />
        <div id="temp1">{`Has text: ${hasText}`}</div>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const styles = (theme) => ({
  controls: {
    backgroundColor: grey[200],
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  sizeInput: {
    width: '60px',
    paddingLeft: theme.spacing.unit * 2,
  },
});

export default withRoot(withStyles(styles)(RteDemo));
