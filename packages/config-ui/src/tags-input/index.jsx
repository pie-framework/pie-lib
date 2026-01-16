import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import uniq from 'lodash/uniq';
import Chip from '@mui/material/Chip';
import MuiBox from '../mui-box';

const ENTER = 13;

const StyledChip = styled(Chip)(() => ({
  padding: '0px',
  margin: '1px',
}));

const Tag = ({ label, onDelete }) => <StyledChip label={label} onDelete={onDelete} />;

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTagsInput = styled('div')(({ theme }) => ({
  border: `0px solid ${theme.palette.background.paper}`,
  display: 'flex',
  flexWrap: 'wrap',
}));

const StyledInput = styled('input')(({ theme }) => ({
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
}));

export class TagsInput extends React.Component {
  static propTypes = {
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
    const { tags } = this.props;
    return (
      <MuiBox focused={this.state.focused}>
        <StyledTagsInput>
          {(tags || []).map((t, index) => (
            <Tag key={index} label={t} onDelete={() => this.deleteTag(t)} />
          ))}
          <StyledInput
            ref={(r) => (this.input = r)}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            value={this.state.value}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            type="text"
          />
        </StyledTagsInput>
      </MuiBox>
    );
  }
}

export default TagsInput;
