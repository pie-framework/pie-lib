export const commonMqFontStyles = {
  fontFamily: 'MJXZERO, MJXTEX !important',
  '-webkit-font-smoothing': 'antialiased !important',

  '& .mq-math-mode > span > var': {
    fontFamily: 'MJXZERO, MJXTEX-I !important',
  },
  '& .mq-math-mode span var': {
    fontFamily: 'MJXZERO, MJXTEX-I !important',
  },
  '& .mq-math-mode .mq-nonSymbola': {
    fontFamily: 'MJXZERO, MJXTEX-I !important',
  },
  '& .mq-math-mode > span > var.mq-operator-name': {
    fontFamily: 'MJXZERO, MJXTEX !important',
  },
};

export const longdivStyles = {
  '& .mq-longdiv-inner': {
    marginTop: '-1px',
    marginLeft: '5px !important;',

    '& > .mq-empty': {
      padding: '0 !important',
      marginLeft: '0px !important',
      marginTop: '2px',
    },
  },

  '& .mq-math-mode .mq-longdiv': {
    display: 'inline-flex !important',
  },
};

export const supsubStyles = {
  '& .mq-math-mode sup.mq-nthroot': {
    fontSize: '70% !important',
    verticalAlign: '0.5em !important',
    paddingRight: '0.15em',
  },
  '& .mq-math-mode .mq-supsub': {
    fontSize: '70.7% !important',
  },
  '& .mq-supsub ': {
    fontSize: '70.7%',
  },
  '& .mq-math-mode .mq-supsub.mq-sup-only': {
    verticalAlign: '-0.1em !important',

    '& .mq-sup': {
      marginBottom: '0px !important',
    },
  },
  /* But when the base is a fraction, move it higher */
  '& .mq-math-mode .mq-fraction + .mq-supsub.mq-sup-only': {
    verticalAlign: '0.4em !important',
  },

  '& .mq-math-mode .mq-supsub.mq-sup-only.mq-after-fraction-group': {
    verticalAlign: '0.4em !important',
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

    '& .mq-math-mode .mq-overarrow .mq-overarrow-inner .mq-empty': {
      padding: '0 !important',
    },

    '& .mq-math-mode .mq-overline .mq-overline-inner .mq-empty ': {
      padding: '0 !important',
    },
  },
};
