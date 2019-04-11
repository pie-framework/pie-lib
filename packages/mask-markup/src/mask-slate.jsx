import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import SlatePropTypes from 'slate-prop-types';
import { Editor } from 'slate-react';
import debug from 'debug';

const log = debug('pie-lib:masked-markup:mask-slate');

const schema = {
  document: {
    nodes: [
      {
        match: [{ type: 'div' }, { type: 'span' }, { type: 'image' }, { type: 'text-input' }]
      }
    ],
    normalize: (editor, err) => {
      log('doc err:', err);
    }
  },
  blocks: {
    div: {
      nodes: [
        {
          match: [{ object: 'text' }, { type: 'text-input' }, { type: 'div' }]
        }
      ],

      normalize: (editor, err) => {
        log('div err:', err);
      }
    },
    image: {
      isVoid: true,
      data: {
        src: v => v && isUrl(v)
      }
    }
  },
  inlines: {
    'text-input': {
      isVoid: true,
      normalize: (editor, err) => {
        log('text-input err:', err);
      }
    },
    span: {
      nodes: [
        {
          match: [
            { type: 'text-input' },
            {
              object: 'text'
            }
          ]
        }
      ],
      normalize: (editor, err) => {
        log('span err:', err);
      }
    }
  }
};

export class MaskSlate extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    value: SlatePropTypes.value.isRequired
  };
  static defaultProps = {};

  // renderNode = (props, editor, next) => {
  //   console.log('renderNode root', props);

  //   if (props.node.type === 'span') {
  //     return <span>{props.children}</span>;
  //   } else {
  //     return next();
  //   }
  // };

  render() {
    const { classes, className, plugins, value } = this.props;
    return <Editor schema={schema} value={value} readOnly={true} plugins={plugins} />;
  }
}
const styles = theme => ({
  class: {}
});
export default withStyles(styles)(MaskSlate);
