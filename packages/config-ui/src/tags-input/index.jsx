import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import uniq from 'lodash/uniq';
import Chip from '@material-ui/core/Chip';
import MuiBox from '../mui-box';

const ENTER = 13;

const Tag = withStyles(() => ({
  tag: {
    padding: '0px',
    margin: '1px',
  },
}))(({ classes, label, onDelete }) => <Chip className={classes.tag} label={label} onDelete={onDelete} />);

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export class TagsInput extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      focused: false,
    };

    this.onKeyDown = (event) => {
      if (event.keyCode === ENTER && this.state.value !== '') {
        const tag = this.state.value.trim();
        const newTags = uniq(this.props.tags.concat([tag]));

        if (newTags.length !== this.props.tags.length) {
          this.props.onChange(newTags);
          this.setState({ value: '' });
        }
      }
    };

    this.onChange = (event) => {
      this.setState({ value: event.target.value });
    };

    this.deleteTag = (tag) => {
      const { tags } = this.props;

      const tagIndex = tags.indexOf(tag);
      if (tagIndex !== -1) {
        tags.splice(tagIndex, 1);
        this.props.onChange(tags);
        this.input.focus();
      }
    };
  }

  onFocus = () => {
    this.setState({ focused: true });
  };

  onBlur = () => {
    this.setState({ focused: false });
  };

  render() {
    const { classes, tags } = this.props;
    return (
      <MuiBox focused={this.state.focused}>
        <div className={classes.tagsInput}>
          {(tags || []).map((t, index) => (
            <Tag key={index} label={t} onDelete={() => this.deleteTag(t)} />
          ))}
          <input
            ref={(r) => (this.input = r)}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            className={classes.input}
            value={this.state.value}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            type="text"
          />
        </div>
      </MuiBox>
    );
  }
}

const styles = (theme) => ({
  tagsInput: {
    border: `0px solid ${theme.palette.background.paper}`,
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    padding: '2px',
    margin: '1px',
    minWidth: '30px',
    width: '100%',
    flex: '1',
    border: `0px solid ${theme.palette.background.paper}`,
    height: '28px',
    fontSize: theme.typography.fontSize,
    fontFamily: theme.typography.fontFamily,
    outline: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
});

export default withStyles(styles)(TagsInput);
