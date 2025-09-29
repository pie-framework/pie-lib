import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
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
import withRoot from '../../source/withRoot';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import InputChooser from '../../source/editable-html/input-chooser';
import { hasText } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { Button } from '@material-ui/core';

const Latex = '\\(2x\\ \\le4y\\ +\\ 8\\)';

const log = debug('@pie-lib:editable-html:demo');
const testImage = 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg';

class Demo extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      console.log('componentDidMount');
      renderMath(this.root);
    }, 50);
  }

  componentDidUpdate() {
    renderMath(this.root);
  }

  render() {
    return <div ref={(r) => (this.root = r)} dangerouslySetInnerHTML={{ __html: this.props.mathml }} />;
  }
}

/**
 * Note: See core schema rules - it normalizes so you can only have blocks or inline and text in a block.
 */
const inputOptions = [
  {
    label: 'An image in a P tag',
    html: `<div><p><img src="${testImage}" style="width:170px;height:151px"/> bar</p><p><img src="${testImage}" style="width:170px;height:151px"/> bar</p></div>`,
  },
  {
    label: 'Latex \\(..\\)',
    html: 'This is the question prompt',
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
  {
    label: 'Sum',
    html:
      '<p>Solve:</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mstack charalign="center" stackalign="right"><msrow><mn>6</mn><mo>,</mo><mn>057</mn></msrow><msrow><mo>-</mo><mn>4</mn><mo>,</mo><mn>859</mn></msrow><msline/><msrow/></mstack></math></p>',
  },
  {
    label: 'PD-4401',
    html:
      '<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mo>(</mo><mo>-</mo><mn>1</mn><mo>,</mo><mo>&nbsp;</mo><mn>1</mn><mo>)</mo></math><br><img alt="The coordinate plane showing 2 lines intersecting at (-1, 1)." width="222" height="214" src="https://assets.pie-api.com/assets/830281a5-cabf-45a7-a778-4efd9d6ce63b/image/jpg/fc4ede78-5e5c-4696-9efc-ed4f58959380"></p>',
  },
  {
    label: 'PD-4441',
    html:
      '<div>Given the piecewise-defined function:<br /><br />&#160;</div><div><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>y</mi><mo>=</mo><mfenced open="{" close=""><mtable columnalign="left"><mtr><mtd><mfrac><mn>1</mn><mn>2</mn></mfrac><msup><mi>x</mi><mn>2</mn></msup><mo>&#160;</mo><mtext>&#160;for&#160;</mtext><mi>x</mi><mo>&lt;</mo><mn>0</mn></mtd></mtr><mtr><mtd><mn>4</mn><mi>x</mi><mo>-</mo><mn>3</mn><mo>&#160;</mo><mtext>&#160;for&#160;</mtext><mn>0</mn><mo>&#8804;</mo><mi>x</mi><mo>&#8804;</mo><mn>2</mn><mspace linebreak="newline" /><mo>-</mo><msqrt><mi>x</mi><mo>-</mo><mn>2</mn></msqrt><mo>&#160;</mo><mtext>&#160;for&#160;</mtext><mi>x</mi><mo>&gt;</mo><mn>2</mn></mtd></mtr></mtable></mfenced></math></div><p><br /><br />Place<span class="relative-emphasis"> four </span>points on the coordinate grid to show the values of <span class="variable">y</span> when <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi><mo>=</mo><mo>-</mo><mn>2</mn></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn></math>, and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn></math>.</p>',
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
      mmlOutput: false,
      mmlEditing: false,
      languageCharactersProps: [],
      showMathTemplated: false,
    };

    const setListeners = () => {
      // dummy data for automation
      // IF FIRST custom button is pressed, we add a WORD
      const words = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'the seventh', 'the eighth', 'the ninth'];
      // IF SECOND custom button is pressed, we add an EXTRA
      const extras = [
        '<math xmlns="http://www.w3.org/1998/Math/MathML"><mstack charalign="center" stackalign="right"><mn>358999</mn><msrow><mo>+</mo><mn>223</mn></msrow><msline /><msrow /></mstack></math>',
        '<math xmlns="http://www.w3.org/1998/Math/MathML">\n<mstack charalign="center" stackalign="right">\n   <msrow>\n     <mn>1</mn>\n     <mo>.</mo>\n     <mn>5</mn>\n     <none/>\n     <none/>\n     <none/>\n   </msrow>\n   <msrow>     \n     <mo>+</mo>\n     <mn>0</mn>\n     <mo>.</mo>\n     <mn>0015</mn>\n   </msrow>\n   <msline/>\n   <msrow/>\n</mstack>\n</math>',
        '<p><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow> <mi>x</mi> <mo>=</mo> <mfrac> <mrow> <mrow> <mo>-</mo> <mi>b</mi> </mrow> <mo>±</mo> <msqrt> <mrow> <msup> <mi>b</mi> <mn>2</mn> </msup> <mo>-</mo> <mrow> <mn>4</mn> <mo>⁢</mo> <mi>a</mi> <mo>⁢</mo> <mi>c</mi> </mrow> </mrow> </msqrt> </mrow> <mrow> <mn>2</mn> <mo>⁢</mo> <mi>a</mi> </mrow> </mfrac></mrow></math></p>',
        '<p><math xmlns="http://www.w3.org/1998/Math/MathML" display="block" title="a x^2+b x+c=0"><mstyle mathcolor="blue" fontfamily="serif" displaystyle="true"><mi>a</mi><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mi>b</mi><mi>x</mi><mo>+</mo><mi>c</mi><mo>=</mo><mn>0</mn></mstyle></math></p>',
        '<div><span data-latex="">\\(\\displaystyle - \\frac{36}{55}\\)</span></div>',
        '<div><span data-latex="">\\(2x\\ \\le4y\\ +\\ 8\\)</span></div>',
        `<div><p>Image:<img src="${testImage}" style="width:170px;height:151px"/></p></div>`,
        '<table border="1"><tr><td>a</td><td>b</td></tr></table>',
        '<table cellspacing="0" cellpadding="4" class="borderall"> <tbody> <tr> <td style="width:140px" class="center bold">Trial</td> <td style="width:140px" class="center bold">Mass NH<sub>3</sub></td> <td style="width:140px" class="center bold">Mass HCl</td> <td style="width:140px" class="center bold">Mass NH<sub>4</sub>Cl</td> </tr> <tr> <td class="center">1</td> <td class="center">3.40 g</td> <td class="center">7.30 g</td> <td class="center">10.70 g</td> </tr> <tr> <td class="center">2</td> <td class="center">?</td> <td class="center">?</td> <td class="center">32.10 g</td> </tr> </tbody></table>',
      ];
      let indexA = 0;
      let indexB = 0;

      // YOU NEED the event listener
      window.addEventListener('PIE-test_event_A', (event) => {
        // YOU NEED to call the callback
        event.detail.callback({ customContent: words[indexA] });

        // dummy code for automation
        if (indexA === words.length - 1) {
          indexA = 0;
        } else {
          indexA += 1;
        }
      });

      // YOU NEED the event listener
      window.addEventListener('PIE-test_event_B', (event) => {
        // YOU NEED to call the callback
        event.detail.callback({ customContent: extras[indexB] });

        // dummy code for automation
        if (indexB === words.length - 1) {
          indexB = 0;
        } else {
          indexB += 1;
        }
      });
    };
    setListeners();
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
      this.fileInput?.addEventListener('change', this.handleFileSelect);
    }
  }

  componentWillUnmount() {
    this.fileInput?.removeEventListener('change', this.handleFileSelect);
  }

  addImage = (imageHandler) => {
    log('[addImage]', imageHandler);
    this.setState({ imageHandler });
    this.fileInput?.click();

    /**
     * There's no way to know if 'cancel' was clicked,
     * instead we have to listen for a focus on body,
     * then call handleInputFiles if checkCancelled is true.
     * It's set to false if a 'change' event is fired.
     */
    document.body.onfocus = (e) => {
      log('focus document...', this.fileInput?.files);
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
      mmlOutput,
      mmlEditing,
      languageCharactersProps,
      showMathTemplated,
    } = this.state;
    const imageSupport = {
      add: this.addImage,
      delete: this.onDeleteImage,
    };

    log('this.state', this.state);

    const content = showMathTemplated ? (
      <EditableHtml
        activePlugins={ALL_PLUGINS}
        toolbarOpts={{ position: 'top' }}
        responseAreaProps={{
          type: 'math-templated',
          respAreaToolbar: null,
          onHandleAreaChange: this.onHandleAreaChange,
        }}
        className={classes.markup}
        markup={markup}
        onChange={this.onChange}
        imageSupport={imageSupport}
        disableImageAlignmentButtons={true}
        onBlur={this.onBlur}
        disabled={false}
        highlightShape={false}
      />
    ) : (
      <>
        <br />
        <br />
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
                  checked={mmlOutput}
                  onChange={(event) => this.setState({ mmlOutput: event.target.checked })}
                />
              }
              label="mmlOutput"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={mmlEditing}
                  onChange={(event) => this.setState({ mmlEditing: event.target.checked })}
                />
              }
              label="mmlEditing"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={languageCharactersProps.filter((a) => a.language === 'spanish').length}
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
                  checked={languageCharactersProps.filter((a) => a.language === 'special').length}
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
          markup={markup}
          onChange={this.onChange}
          imageSupport={imageSupport}
          onBlur={this.onBlur}
          disabled={disabled}
          highlightShape={showHighlight}
          pluginProps={{
            customPlugins: [
              {
                icon:
                  '<?xml version="1.0" encoding="utf-8"?><svg width="28px" height="28px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M547.8 408.1H291.9v-92.8c0-15.2 12.4-27.6 27.6-27.6h200.7c15.2 0 27.6 12.4 27.6 27.6v92.8z" fill="#D5D9CF" /><path d="M553.3 413.6H286.4v-98.3c0-18.3 14.9-33.1 33.1-33.1h200.7c18.3 0 33.1 14.9 33.1 33.1v98.3z m-255.9-11h244.9v-87.3c0-12.2-9.9-22.1-22.1-22.1H319.5c-12.2 0-22.1 9.9-22.1 22.1v87.3z" fill="#333336" /><path d="M558.7 446.2H281c-6.6 0-12-5.4-12-12v-14.1c0-6.6 5.4-12 12-12h277.7c6.6 0 12 5.4 12 12v14.1c0 6.6-5.4 12-12 12z" fill="#D5D9CF" /><path d="M558.7 451.7H281c-9.6 0-17.5-7.9-17.5-17.5v-14.1c0-9.6 7.9-17.5 17.5-17.5h277.7c9.6 0 17.5 7.9 17.5 17.5v14.1c0 9.7-7.8 17.5-17.5 17.5zM281 413.6c-3.6 0-6.5 2.9-6.5 6.5v14.1c0 3.6 2.9 6.5 6.5 6.5h277.7c3.6 0 6.5-2.9 6.5-6.5v-14.1c0-3.6-2.9-6.5-6.5-6.5H281z" fill="#333336" /><path d="M608.2 488.4c-20.7-4.2-41.2-8.2-78.7-11v-31.2H310.2v31.7c-36.8 3-57.6 7.4-78.9 11.8-30.4 6.2-52.1 32.9-52.1 63.9v232.8c0 11.9 9.7 21.6 21.6 21.6h438.1c11.9 0 21.6-9.7 21.6-21.6V552.3c0-31.1-21.9-57.8-52.3-63.9z" fill="#FFD632" /><path d="M638.9 813.5H200.8c-14.9 0-27.1-12.1-27.1-27.1V553.5c0-33.4 23.8-62.6 56.5-69.3l1.8-0.4c19.5-4 39.6-8.1 72.7-11.1v-32.1H535v31.6c35 2.8 55 6.8 74.3 10.7 32.9 6.6 56.7 35.7 56.7 69.3v234.1c0 15-12.2 27.2-27.1 27.2zM315.7 451.7V483l-5.1 0.4c-35.4 2.9-56.3 7.2-76.4 11.3l-1.8 0.4c-27.7 5.7-47.7 30.3-47.7 58.5v232.8c0 8.9 7.2 16.1 16.1 16.1h438.1c8.9 0 16.1-7.2 16.1-16.1V552.3c0-28.3-20.1-53-47.9-58.5-19.9-4-40.5-8.1-78-10.9l-5.1-0.4v-30.8H315.7z" fill="#333336" /><path d="M661.4 830.7h-483c-6.5 0-11.7-5.2-11.7-11.7v-36.7c0-6.5 5.2-11.7 11.7-11.7h483c6.5 0 11.7 5.2 11.7 11.7V819c0 6.5-5.3 11.7-11.7 11.7z" fill="#D8A128" /><path d="M661.4 836.2h-483c-9.5 0-17.2-7.7-17.2-17.2v-36.7c0-9.5 7.7-17.2 17.2-17.2h483c9.5 0 17.2 7.7 17.2 17.2V819c0 9.5-7.7 17.2-17.2 17.2z m-483.1-60.1c-3.4 0-6.2 2.8-6.2 6.2V819c0 3.4 2.8 6.2 6.2 6.2h483c3.4 0 6.2-2.8 6.2-6.2v-36.7c0-3.4-2.8-6.2-6.2-6.2h-483z" fill="#333336" /><path d="M179.2 588.3h481.3v110.9H179.2z" fill="#68A240" /><path d="M666 704.7H173.7V582.8H666v121.9z m-481.3-11H655v-99.9H184.7v99.9z" fill="#333336" /><path d="M826.5 703.2l6.5 127c0 2.1-1.3 3.8-2.6 5.4-16.2 20.7-37.5 55.4-45.9 67-3.2 4.5-9.5 5-12.3 0.2-8.5-14.7-30.7-53-45.8-67.3-1.4-1.3-2.2-3.2-2.2-5.1l6.5-127.3c0-3.9 3.1-7 7-7h81.7c4 0.1 7.1 3.3 7.1 7.1z" fill="#D5D9CF" /><path d="M777.9 911.8h-0.7c-4.1-0.2-7.7-2.4-9.8-6.1-7.5-12.9-30.1-52.1-44.8-66-2.5-2.4-3.9-5.7-3.9-9.1v-0.3l6.4-127.2c0.1-6.8 5.7-12.4 12.5-12.4h81.7c6.9 0 12.4 5.5 12.5 12.4l6.5 127.2c0 4-2.2 6.9-3.7 8.8-10.3 13.2-22.7 32-32.6 47.2-5.4 8.3-10.1 15.4-13.2 19.6-2.5 3.7-6.6 5.9-10.9 5.9z m-48.1-81.1c0 0.4 0.2 0.7 0.5 1 14.2 13.4 33.5 45.5 46.7 68.5 0.3 0.6 0.6 0.6 0.9 0.6 0.6 0 1.5-0.4 2.2-1.3 2.9-4 7.5-11.1 12.9-19.2 10-15.3 22.6-34.4 33.1-48 0.4-0.6 1.3-1.6 1.4-2l-6.4-127c0-0.8-0.7-1.5-1.5-1.5h-81.7c-0.8 0-1.5 0.7-1.5 1.5v0.3l-6.6 127.1z" fill="#333336" /><path d="M802.4 739.7h-47.6c-23.2 0-42-18.8-42-42V335.6h131.6v362.1c0 23.2-18.8 42-42 42z" fill="#FFD632" /><path d="M802.4 745.2h-47.6c-26.2 0-47.5-21.3-47.5-47.5V330.1h142.6v367.6c0 26.2-21.3 47.5-47.5 47.5z m-84.1-404.1v356.6c0 20.1 16.4 36.5 36.5 36.5h47.6c20.1 0 36.5-16.4 36.5-36.5V341.1H718.3z" fill="#333336" /><path d="M857.4 264.3c0-110.9-35.3-146.6-78.8-146.6s-78.8 35.7-78.8 146.6v157.8c0 33.5 27.2 60.7 60.7 60.7h36.2c33.5 0 60.7-27.2 60.7-60.7V264.3z" fill="#68A240" /><path d="M796.7 488.3h-36.2c-36.5 0-66.2-29.7-66.2-66.2V264.3c0-52.8 8-92.4 23.9-117.8 14.2-22.7 34.5-34.3 60.4-34.3s46.1 11.5 60.4 34.3c15.9 25.4 23.9 65 23.9 117.8v157.8c0 36.5-29.7 66.2-66.2 66.2z m-18.1-365.1c-21.8 0-38.9 9.8-51 29.1-14.8 23.6-22.2 61.2-22.2 112v157.8c0 30.4 24.8 55.2 55.2 55.2h36.2c30.4 0 55.2-24.8 55.2-55.2V264.3c0-50.7-7.5-88.4-22.2-112-12.2-19.3-29.4-29.1-51.2-29.1z" fill="#333336" /><path d="M778.6 791.1m-14.3 0a14.3 14.3 0 1 0 28.6 0 14.3 14.3 0 1 0-28.6 0Z" fill="#F2F0E7" /><path d="M778.6 810.9c-10.9 0-19.8-8.9-19.8-19.8s8.9-19.8 19.8-19.8 19.8 8.9 19.8 19.8-8.9 19.8-19.8 19.8z m0-28.6c-4.9 0-8.8 3.9-8.8 8.8s3.9 8.8 8.8 8.8 8.8-3.9 8.8-8.8-3.9-8.8-8.8-8.8z" fill="#333336" /><path d="M773.1 805.4h11v97.5h-11z" fill="#333336" /><path d="M778.6 421.7c-3.3 0-6-2.7-6-6V194.9c0-3.3 2.7-6 6-6s6 2.7 6 6v220.8c0 3.3-2.7 6-6 6z" fill="#333336" /></svg>',
                iconType: 'SVG',
                iconAlt: 'Button A',
                event: 'test_event_A',
              },
              {
                icon:
                  '<?xml version="1.0" encoding="utf-8"?><svg width="28px" height="28px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M589.3 826.7V121.4l114.3 37.8v667.5z" fill="#D5D9CF" /><path d="M709.1 832.2H583.8V113.8l125.3 41.4v677z m-114.3-11h103.3v-658L594.8 129v692.2z" fill="#333336" /><path d="M663.9 305.9V179.5c0-4.9 4.8-8.2 9.4-6.6l38 13.8v119.2h-47.4z" fill="#D5D9CF" /><path d="M716.8 311.4h-58.4V179.5c0-4.1 2-7.9 5.3-10.2 3.3-2.3 7.6-2.9 11.4-1.5l41.6 15.1v128.5z m-47.4-11h36.4V190.6l-34.4-12.4c-0.6-0.2-1.1 0-1.4 0.2-0.2 0.2-0.6 0.6-0.6 1.2v120.8z" fill="#333336" /><path d="M614.8 690.3l-7.1-5.6c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l8-6.4c2.4-1.9 2.4-5.6 0-7.5l-8-6.4c-1.7-1.4-1.7-4 0-5.4l7.1-5.6c3.6-2.8 5.7-7.2 5.7-11.7V178.7c0-4.9-4.8-8.2-9.4-6.6l-29.4 20.6V841h38.8V702c-0.1-4.6-2.1-8.9-5.7-11.7z" fill="#D5D9CF" /><path d="M625.9 846.5h-49.8V189.8l32.4-22.7 0.7-0.2c3.8-1.4 8.1-0.8 11.4 1.5 3.3 2.3 5.3 6.2 5.3 10.2v200.2c0 6.3-2.8 12.1-7.7 16l-5.1 4 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 6 4.8c2.5 2 3.9 4.9 3.9 8.1 0 3.2-1.4 6.1-3.9 8.1l-6 4.8 5.1 4.1c4.9 3.9 7.7 9.7 7.7 16v143.8z m-38.8-11h27.8V702c0-2.9-1.3-5.6-3.6-7.4l-7.1-5.6c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7s1.2-5.3 3.4-7l7.3-5.9-7.3-5.8c-2.2-1.7-3.4-4.3-3.4-7 0-2.8 1.2-5.3 3.4-7l7.1-5.6c2.3-1.8 3.6-4.5 3.6-7.4V178.7c0-0.7-0.4-1.1-0.6-1.2-0.2-0.1-0.5-0.3-0.9-0.3l-26.3 18.4v639.9z" fill="#333336" /><path d="M550.8 900.1l40.3-8.9V289.8c0-3.4-3.8-5.4-6.6-3.4-11.5 8.3-33.9 25.8-33.2 34.7l1 13.6c3.6 48.8-2.8 97.9-19 144.1l-16.1 46c-7.2 20.7-9.9 42.6-7.9 64.4l4.5 49.3c5.5 59.7-4.1 119.9-27.7 175l-2.5 5.7c-5 11.7-6 23.9-3.8 35.1 6.4 32.5 38.8 52.9 71 45.8z m-24.7-133.4c0-8.8 7.1-15.9 15.9-15.9s15.9 7.1 15.9 15.9-7.1 15.9-15.9 15.9-15.9-7.1-15.9-15.9z" fill="#FFD632" /><path d="M537.8 907.1c-12.6 0-24.9-3.6-35.7-10.7-14.5-9.5-24.3-24-27.7-40.8-2.5-12.9-1.1-26.1 4.1-38.3l2.5-5.7c23.2-54.1 32.7-113.7 27.3-172.4l-4.5-49.3c-2.1-22.7 0.7-45.2 8.2-66.7l16.1-46c16-45.8 22.3-93.5 18.7-141.8l-1-13.6c-0.3-3.6-1-13.1 35.5-39.5 3-2.1 6.8-2.4 10.1-0.8 3.3 1.7 5.3 5 5.3 8.6v605.8l-44.7 9.8c-4.8 0.8-9.5 1.4-14.2 1.4z m47.8-614.6c-23.6 17.4-28.8 26.3-28.8 28.2l1 13.6c3.7 49.9-2.8 99.1-19.3 146.3l-16.1 46c-7 20-9.6 40.9-7.7 62.1l4.5 49.3c5.5 60.5-4.2 121.9-28.2 177.7l-2.5 5.7c-4.4 10.2-5.6 21.2-3.5 31.9 2.8 13.9 10.9 25.9 22.9 33.8 12.4 8.1 27.1 10.8 41.5 7.6l36-7.9V292.5zM542 788.1c-11.8 0-21.4-9.6-21.4-21.4s9.6-21.4 21.4-21.4 21.4 9.6 21.4 21.4-9.7 21.4-21.4 21.4z m0-31.8c-5.7 0-10.4 4.7-10.4 10.4s4.7 10.4 10.4 10.4 10.4-4.7 10.4-10.4-4.7-10.4-10.4-10.4z" fill="#333336" /><path d="M590.2 818.2V676c0-20.6 16.7-37.3 37.3-37.3 20.6 0 37.3 16.7 37.3 37.3v142.2c0 20.6-16.7 37.3-37.3 37.3-20.6 0-37.3-16.7-37.3-37.3z" fill="#68A240" /><path d="M627.5 861c-23.6 0-42.8-19.2-42.8-42.8V676c0-23.6 19.2-42.8 42.8-42.8s42.8 19.2 42.8 42.8v142.2c0 23.6-19.2 42.8-42.8 42.8z m0-216.8c-17.5 0-31.8 14.3-31.8 31.8v142.2c0 17.5 14.3 31.8 31.8 31.8s31.8-14.3 31.8-31.8V676c0-17.6-14.3-31.8-31.8-31.8z" fill="#333336" /><path d="M590.2 726.8V676c0-20.6 16.7-37.3 37.3-37.3 20.6 0 37.3 16.7 37.3 37.3v50.8c0 20.6-16.7 37.3-37.3 37.3-20.6 0-37.3-16.7-37.3-37.3z" fill="#68A240" /><path d="M627.5 769.6c-23.6 0-42.8-19.2-42.8-42.8V676c0-23.6 19.2-42.8 42.8-42.8s42.8 19.2 42.8 42.8v50.8c0 23.6-19.2 42.8-42.8 42.8z m0-125.4c-17.5 0-31.8 14.3-31.8 31.8v50.8c0 17.5 14.3 31.8 31.8 31.8s31.8-14.3 31.8-31.8V676c0-17.6-14.3-31.8-31.8-31.8z" fill="#333336" /><path d="M663.9 873.7c40-16.3 67.1-55.4 67.1-99.8V334.2c0-20.7-14-38.8-34.1-44l-21.9-5.6c-5.6-1.4-11.1 2.8-11.1 8.6v580.5z" fill="#FFD632" /><path d="M658.4 881.9V293.3c0-4.5 2-8.6 5.6-11.4 3.5-2.7 8-3.7 12.4-2.6l21.9 5.6c22.5 5.8 38.3 26 38.3 49.3v439.7c0 22.8-6.7 44.7-19.5 63.5-12.6 18.6-30.3 32.9-51 41.4l-7.7 3.1z m14.4-592c-1 0-1.7 0.4-2 0.7-0.5 0.4-1.3 1.2-1.3 2.7v571.9c34.3-17.3 56.1-52.3 56.1-91.3V334.2c0-18.2-12.3-34.1-30-38.6l-21.9-5.6c-0.4-0.1-0.7-0.1-0.9-0.1z" fill="#333336" /><path d="M731.1 773.9v-23s-99.9 84.1-245 62.8l-2.5 5.7c-5 11.7-6 23.9-3.8 35.1 6.4 32.4 31.6 60.7 117.5 42.3 110.1-23.7 133.8-72.3 133.8-122.9z" fill="#68A240" /><path d="M548.9 908.1c-20.5 0-36.7-4.1-49.1-12.2-13.3-8.8-21.9-22.3-25.4-40.4-2.5-12.9-1.1-26.1 4.1-38.3l4.1-9.6 4.2 0.6c73.5 10.8 135-6.4 173.6-22.8 42-17.8 66.8-38.5 67.1-38.7l9-7.6v34.8c0 30.8-8.8 55.4-27 75.3-22.4 24.4-58.8 41.7-111.1 53-18.6 3.9-35.1 5.9-49.5 5.9z m-59.5-88.5l-0.8 1.9c-4.4 10.2-5.6 21.2-3.5 31.9 3 15.3 9.8 26.2 20.7 33.3 18.3 12 48.6 13.6 90.2 4.7 50-10.7 84.5-27 105.3-49.7 16.5-17.9 24.2-39.5 24.2-67.8v-12c-11 7.8-31.7 21.1-60.4 33.4-39.2 16.7-101.3 34.3-175.7 24.3zM731.1 633h-24.7c-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5h24.7c3 0 5.5 2.5 5.5 5.5s-2.5 5.5-5.5 5.5zM731.1 655.3h-24.7c-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5h24.7c3 0 5.5 2.5 5.5 5.5s-2.5 5.5-5.5 5.5zM731.1 677.6h-24.7c-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5h24.7c3 0 5.5 2.5 5.5 5.5s-2.5 5.5-5.5 5.5zM731.1 699.9h-24.7c-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5h24.7c3 0 5.5 2.5 5.5 5.5s-2.5 5.5-5.5 5.5zM731.1 722.2h-24.7c-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5h24.7c3 0 5.5 2.5 5.5 5.5s-2.5 5.5-5.5 5.5z" fill="#333336" /><path d="M640.8 606.2m-11.4 0a11.4 11.4 0 1 0 22.8 0 11.4 11.4 0 1 0-22.8 0Z" fill="#333336" /><path d="M419.1 341.8v484.3c0 34.8-28.2 63.1-63.1 63.1-34.8 0-63.1-28.2-63.1-63.1V341.8l60.8-109.4c1-1.8 3.5-1.8 4.5 0l60.9 109.4z" fill="#FFD632" /><path d="M356 894.7c-37.8 0-68.6-30.8-68.6-68.6V340.4L349 229.7c1.4-2.6 4.1-4.2 7.1-4.2 2.9 0 5.6 1.6 7.1 4.2l61.5 110.6v485.8c-0.1 37.8-30.8 68.6-68.7 68.6z m-57.5-551.5v482.9c0 31.8 25.8 57.6 57.6 57.6s57.6-25.8 57.6-57.6V343.2L356 239.6l-57.5 103.6z" fill="#333336" /><path d="M419.1 344.6v481.5c0 34.8-28.2 63.1-63.1 63.1-34.8 0-63.1-28.2-63.1-63.1V344.6h126.2z" fill="#68A240" /><path d="M356 894.7c-37.8 0-68.6-30.8-68.6-68.6v-487h137.2v487c0 37.8-30.7 68.6-68.6 68.6z m-57.5-544.6v476c0 31.8 25.8 57.6 57.6 57.6s57.6-25.8 57.6-57.6v-476H298.5z" fill="#333336" /><path d="M590.2 670.5h74.6v11h-74.6zM590.2 695.3h74.6v11h-74.6zM590.2 720.2h74.6v11h-74.6z" fill="#333336" /><path d="M385.1 889.3h-58c-18.8 0-34.1-15.3-34.1-34.1v-52h126.2v52c-0.1 18.9-15.3 34.1-34.1 34.1z" fill="#D8A128" /><path d="M385.1 894.8h-58c-21.8 0-39.6-17.8-39.6-39.6v-57.5h137.2v57.5c-0.1 21.9-17.8 39.6-39.6 39.6z m-86.6-86.1v46.5c0 15.8 12.8 28.6 28.6 28.6h58c15.8 0 28.6-12.8 28.6-28.6v-46.5H298.5z" fill="#333336" /><path d="M292.9 792.1h126.2v32.8H292.9z" fill="#D5D9CF" /><path d="M424.6 830.5H287.5v-43.8h137.2v43.8z m-126.1-11h115.2v-21.8H298.5v21.8z" fill="#333336" /><path d="M323.9 345.5h11v446.6h-11z" fill="#333336" /><path d="M375 345.5h11v446.6h-11z" fill="#333336" /><path d="M380.2 271.9l-21.9-39.5c-1-1.8-3.5-1.8-4.5 0l-21.9 39.5h12.2l12 8.4 12.2-8.4h11.9z" fill="#D5D9CF" /><path d="M356 287l-13.7-9.6h-19.8l26.5-47.6c1.4-2.6 4.1-4.2 7.1-4.2 2.9 0 5.6 1.6 7.1 4.2l26.5 47.6H370l-14 9.6z m-14.8-20.6h4.6l10.3 7.2 10.5-7.2h4.3L356 239.6l-14.8 26.8z" fill="#333336" /></svg>',
                iconType: 'SVG',
                iconAlt: 'Button B',
                event: 'test_event_B',
              },
            ],
            image: {
              disabled: disableImageUpload,
            },
            math: {
              disabled: !mathEnabled,
              keypadMode: this.state.keypadMode,
            },
            // 'bold': { disabled: true },
            // 'html': { disabled: true },
            // 'italic': { disabled: true },
            // 'underline': { disabled: true },
            // 'strikethrough': { disabled: true },
            // 'bulleted-list': { disabled: true },
            // 'numbered-list': { disabled: true },
            // 'languageCharacters': { disabled: true },
            // 'blockquote': { disabled: true },
            // 'h3': { disabled: true },
            // 'table': { disabled: true },
            // 'video': { disabled: true },
            // 'audio': { disabled: true },
            // 'responseArea': { disabled: true },
            // 'redo': { disabled: true },
            // 'undo': { disabled: true },
            // 'sup': { disabled: true },
            // 'sub': { disabled: true },
            // 'ul_list': { disabled: true },
            // 'ol_list': { disabled: true },
          }}
          width={width}
          height={height}
          languageCharactersProps={languageCharactersProps}
          mathMlOptions={{
            mmlEditing: mmlEditing,
            mmlOutput: mmlOutput,
          }}
        />
        <input type="file" hidden ref={(r) => (this.fileInput = r)} />
        <br />
        <MarkupPreview markup={markup} />
        <br />
        <Demo mathml={markup} />
        <Typography variant="h6">Check if input contains text using the hasText function:</Typography>
        <br />
        {/*<EditableHtml markup={markupText} onChange={this.onChangeMarkupText} width={width} height={height} />*/}
        <br />
        <div id="temp1">{`Has text: ${hasText}`}</div>
      </>
    );

    //activePlugins={['bold', 'bulleted-list', 'numbered-list']}
    return mounted ? (
      <div>
        <Typography variant="h6">EditableHtml</Typography>
        <Typography variant="body2">A rich text editor with a material design look.</Typography>

        {content}
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
