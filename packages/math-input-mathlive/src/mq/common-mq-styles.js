import { css } from '@emotion/react';

export const CommonMqStyles = css`
  .ML__latex {
    font-family: 'Cambria Math', 'Latin Modern Math', serif;
  }
  math-field {
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 2px 4px;
    min-width: 2em;
    font-size: inherit;
  }
  math-field:focus-within {
    outline: 2px solid #1976d2;
    border-color: #1976d2;
  }
`;

export const commonMqFontStyles = {
  fontFamily: 'MJXZERO, MJXTEX !important',
  '-webkit-font-smoothing': 'antialiased !important',
};

export const longdivStyles = {
  '& .mq-longdiv-inner': {
    marginTop: '-1px',
    marginLeft: '5px !important;',
  },
};

export const commonMqKeyboardStyles = {
  '& *': {
    ...commonMqFontStyles,
    ...longdivStyles,
    '& .mq-math-mode .mq-sqrt-prefix': {
      top: '0 !important',
    },
    '& .mq-math-mode .mq-empty': {
      padding: '9px 1px !important',
    },
    '& .mq-math-mode .mq-supsub': {
      fontSize: '70.7% !important',
    },
    '& .mq-math-mode .mq-sqrt-stem': {
      marginTop: '-5px',
      paddingTop: '4px',
    },
    '& .mq-math-mode .mq-paren': {
      verticalAlign: 'middle !important',
    },
  },
};

export default CommonMqStyles;
