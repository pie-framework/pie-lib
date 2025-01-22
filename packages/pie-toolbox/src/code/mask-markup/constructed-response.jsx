import React from 'react';
import { withMask } from './with-mask';
import EditableHtml from '../editable-html';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { color } from '../../render-ui';

const styles = (theme) => ({
  editableHtmlCustom: {
    display: 'inline-block',
    verticalAlign: 'middle',
    margin: '4px',
    borderRadius: '4px',
    border: `1px solid ${color.black()}`,
  },
  correct: {
    border: `1px solid ${color.correct()}`,
  },
  incorrect: {
    border: `1px solid ${color.incorrect()}`,
  }
});

const MaskedInput = (props) => (node, data) => {
  const { adjustedLimit, disabled, feedback, showCorrectAnswer, maxLength, spellCheck, classes, pluginProps, onChange } = props;
  const dataset = node.data?.dataset || {};

  if (dataset.component === 'input') {
    const correctAnswer = ((props.choices && dataset && props.choices[dataset.id]) || [])[0];
    const finalValue = showCorrectAnswer ? correctAnswer && correctAnswer.label : data[dataset.id] || '';
    const width = maxLength && maxLength[dataset.id];
    const isCorrect = feedback && feedback[dataset.id] && feedback[dataset.id] === 'correct';
    const isIncorrect = feedback && feedback[dataset.id] && feedback[dataset.id] === 'incorrect';

    const handleInputChange = (newValue) => {
      const updatedValue = {
        ...data,
        [dataset.id]: newValue
      };
      onChange(updatedValue);
    };

    const handleKeyDown = (event) => {
        // the keyCode value for the Enter/Return key is 13
        if (event.key === 'Enter' || event.keyCode === 13) {
            return false;
        }
    };

    return (
        <EditableHtml
            id={dataset.id}
            key={`${node.type}-input-${dataset.id}`}
            disabled={showCorrectAnswer || disabled}
            disableUnderline
            onChange={handleInputChange}
            markup={finalValue || ''}
            charactersLimit={adjustedLimit ? width : 25}
            activePlugins={['languageCharacters']}
            pluginProps={pluginProps}
            languageCharactersProps={[{ language: 'spanish' }]}
            spellCheck={spellCheck}
            width={`calc(${width}ch + 42px)`} // added 42px for left and right padding of editable-html
            onKeyDown={handleKeyDown}
            autoWidthToolbar
            toolbarOpts={{
              minWidth: 'auto',
              noBorder: true,
              isHidden: !!pluginProps?.characters?.disabled
            }}
            className={classnames(
                classes.editableHtmlCustom,
                {
                  [classes.correct]: isCorrect,
                  [classes.incorrect]: isIncorrect,
                }
            )}
        />
    );
  }
};

export default withStyles(styles)(withMask('input', MaskedInput));

