import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import SlatePropTypes from 'slate-prop-types';
import { Editor } from 'slate-react';

const schema = {
  document: {
    nodes: [
      {
        match: [{ type: 'paragraph' }, { type: 'image' }, { type: 'text-input' }]
      }
    ],
    normalize: (editor, err) => {
      console.log('doc err:', err);
    }
  },
  blocks: {
    paragraph: {
      nodes: [
        {
          match: { object: 'text' }
        }
      ],

      normalize: (editor, err) => {
        console.log('p err:', err);
      }
    },
    image: {
      isVoid: true,
      data: {
        src: v => v && isUrl(v)
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

  constructor(props) {
    super(props);
    this.schema = {
      document: {
        normalize: (editor, error) => {
          console.log('normalize error: ', error);
        }
      }
    };
  }
  render() {
    const { classes, className, plugins, value } = this.props;
    return <Editor schema={this.schema} value={value} readOnly={true} plugins={plugins} />;
  }
}
const styles = theme => ({
  class: {}
});
export default withStyles(styles)(MaskSlate);
