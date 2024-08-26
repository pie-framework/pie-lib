import React from 'react';
import { withMask } from './with-mask';
import EditableHtml from '../editable-html';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { stripHtmlTags } from './serialization';
import { color } from '../../render-ui';

const styles = (theme) => ({
  editableHtmlCustom: {
    display: 'inline-block',
    verticalAlign: 'middle',
    margin: '4px',
    borderRadius: '4px'
  },
  correct: {
    border: `1px solid ${color.correct()}`,
  },
  incorrect: {
    border: `1px solid ${color.incorrect()}`,
  }
});

// eslint-disable-next-line react/display-name
const MaskedInput = (props) => (node, data) => {
  const { adjustedLimit, disabled, feedback, showCorrectAnswer, maxLength, spellCheck, classes, spanishInputEnabled, onChange } = props;
  const dataset = node.data?.dataset || {};

  if (dataset.component === 'input') {
    const correctAnswer = ((props.choices && dataset && props.choices[dataset.id]) || [])[0];
    const finalValue = showCorrectAnswer ? correctAnswer && correctAnswer.label : data[dataset.id] || '';
    const width = maxLength && maxLength[dataset.id];
    const languageCharactersProps = spanishInputEnabled ? [{ language: 'spanish' }] : [];
    const isCorrect = feedback && feedback[dataset.id] && feedback[dataset.id] === 'correct';
    const isIncorrect = feedback && feedback[dataset.id] && feedback[dataset.id] === 'incorrect';

    const handleInputChange = (newValue) => {
      const updatedValue = {
        ...data,
        [dataset.id]: newValue
      };
      onChange(updatedValue);
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
            languageCharactersProps={languageCharactersProps}
            spellCheck={spellCheck}
            width={width * 22}
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

