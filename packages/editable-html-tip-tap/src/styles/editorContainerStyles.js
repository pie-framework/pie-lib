import { color } from '@pie-lib/render-ui';
import { primary } from '../theme';

const styles = (theme) => ({
  root: {
    position: 'relative',
    padding: '0px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'text',
    '& [data-slate-editor="true"]': {
      wordBreak: 'break-word',
      overflow: 'visible',
      maxHeight: '500px',
      // needed in order to be able to put the focus before a void element when it is the first one in the editor
      padding: '5px',
    },

    '&:first-child': {
      marginTop: 0,
    },

    '& ul, & ol': {
      padding: '0 1rem',
      margin: '1.25rem 1rem 1.25rem 0.4rem',
    },

    '& ul li p, & ol li p': {
      marginTop: '0.25em',
      marginBottom: '0.25em',
    },

    '& h1, & h2, & h3, & h4, & h5, & h6': {
      lineHeight: 1.1,
      marginTop: '2.5rem',
      textWrap: 'pretty',
    },

    '& h1, & h2': {
      marginTop: '3.5rem',
      marginBottom: '1.5rem',
    },

    '& h1': {
      fontSize: '1.4rem',
    },

    '& h2': {
      fontSize: '1.2rem',
    },

    '& h3': {
      fontSize: '1.1rem',
    },

    '& h4, & h5, & h6': {
      fontSize: '1rem',
    },

    '& code': {
      backgroundColor: 'var(--purple-light)',
      borderRadius: '0.4rem',
      color: 'var(--black)',
      fontSize: '0.85rem',
      padding: '0.25em 0.3em',
    },

    '& pre': {
      background: 'var(--black)',
      borderRadius: '0.5rem',
      color: 'var(--white)',
      fontFamily: "'JetBrainsMono', monospace",
      margin: '1.5rem 0',
      padding: '0.75rem 1rem',

      '& code': {
        background: 'none',
        color: 'inherit',
        fontSize: '0.8rem',
        padding: 0,
      },
    },

    '& blockquote': {
      borderLeft: '3px solid var(--gray-3)',
      margin: '1.5rem 0',
      paddingLeft: '1rem',
    },

    '& hr': {
      border: 'none',
      borderTop: '1px solid var(--gray-2)',
      margin: '2rem 0',
    },

    '& table': {
      tableLayout: 'fixed',
      width: '100%',
      borderCollapse: 'collapse',
      color: color.text(),
      backgroundColor: color.background(),
    },
    '& table:not([border="1"]) tr': {
      borderTop: '1px solid #dfe2e5',
    },
    '& td, th': {
      padding: '.6em 1em',
      textAlign: 'center',
    },
    '& table:not([border="1"]) td, th': {
      border: '1px solid #dfe2e5',
    },
  },
  children: {
    padding: '10px 16px',
  },
  editorHolder: {
    position: 'relative',
    padding: '0px',
    overflowY: 'auto',
    color: color.text(),
    backgroundColor: color.background(),
    '&::before': {
      left: '0',
      right: '0',
      bottom: '0',
      height: '1px',
      content: '""',
      position: 'absolute',
      transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
    '&::after': {
      left: '0',
      right: '0',
      bottom: '0',
      height: '1px',
      content: '""',
      position: 'absolute',
      transform: 'scaleX(0)',
      transition: 'transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms, background-color 200ms linear',
      backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
  },
  disabledUnderline: {
    '&::before': {
      display: 'none',
    },
    '&::after': {
      display: 'none',
    },
  },
  disabledScrollbar: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none',
  },
  readOnly: {
    '&::before': {
      background: 'transparent',
      backgroundSize: '5px 1px',
      backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.42) 33%, transparent 0%)',
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'left top',
    },
    '&::after': {
      left: '0',
      right: '0',
      bottom: '0',
      height: '1px',
      content: '""',
      position: 'absolute',
      transform: 'scaleX(0)',
      transition: 'transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms, background-color 0ms linear',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    '&:hover': {
      '&::after': {
        transform: 'scaleX(0)',
        backgroundColor: theme.palette.common.black,
        height: '2px',
      },
    },
  },
  error: {
    border: `2px solid ${theme.palette.error.main} !important`,
  },
  noBorder: {
    border: 'none',
  },
  noPadding: {
    padding: 0,
  },
  toolbarOnTop: {
    marginTop: '45px',
  },
});

export default styles;
