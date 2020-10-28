import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as color from './color';

export class PreviewPrompt extends Component {
    static propTypes = {
        classes: PropTypes.object,
        prompt: PropTypes.string,
        tagName : PropTypes.string,
        className : PropTypes.string
    }

    render() {
        const { prompt, classes, tagName, className} = this.props;
        const CustomTag = tagName || "div";
        const customClasses = `${classes.promptTable} ${(className) || ""} `
        return (
            <CustomTag className={customClasses}
                dangerouslySetInnerHTML={{ __html: prompt }}
            />
        )
    }

}

const styles = (theme) => ({
    prompt: {
        verticalAlign: 'middle',
        color: color.text(),
    },
    rationale: {
        paddingLeft: theme.spacing.unit * 16,
      },
      label: {
        color: `${color.text()} !important`, //'var(--choice-input-color, black)',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer',
      },
    promptTable : {
        '&:not(.MathJax) > table': {
            borderCollapse: 'collapse'
        },
        '&:not(.MathJax) > table tr': {
            borderTop: '1px solid #dfe2e5',
            '&:nth-child(2n)': {
                backgroundColor: '#f6f8fa'
            }
        },
        '&:not(.MathJax) > table td, &:not(.MathJax) > table th': {
            border: '1px solid #dfe2e5',
            padding: '.6em 1em',
            textAlign: 'center'
        }
      }
  });
export default withStyles(styles)(PreviewPrompt);

