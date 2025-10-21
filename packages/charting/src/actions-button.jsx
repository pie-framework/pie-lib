import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';

import { color } from '@pie-lib/render-ui';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

const StyledActions = styled('div')(() => ({
  alignSelf: 'flex-end',
}));

const StyledTrigger = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  fontSize: theme.typography.fontSize,
  color: color.tertiary(),
  padding: theme.spacing(1),
}));

const StyledActionsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  '& button': {
    textTransform: 'none',
    fontSize: theme.typography.fontSize,
    color: color.text(),
    justifyContent: 'flex-start',
  },
}));

export class ActionsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actionsAnchorEl: null,
    };
  }

  static propTypes = {
    addCategory: PropTypes.func.isRequired,
    deleteCategory: PropTypes.func.isRequired,
    language: PropTypes.string,
    categories: PropTypes.array,
  };

  handleActionsClick = (event) => {
    this.setState({ actionsAnchorEl: event.currentTarget });
  };

  handleActionsClose = () => {
    this.setState({ actionsAnchorEl: null });
  };

  handleAddCategory = () => {
    const { addCategory } = this.props;
    addCategory();
    this.handleActionsClose();
  };

  handleDeleteCategory = (index) => {
    const { deleteCategory } = this.props;
    deleteCategory(index);
    this.handleActionsClose();
  };

  render() {
    const { categories, language } = this.props;

    return (
      <StyledActions>
        <StyledTrigger role="button" tabIndex={0} onClick={this.handleActionsClick}>
          Actions
        </StyledTrigger>
        <Popover
          open={Boolean(this.state.actionsAnchorEl)}
          anchorEl={this.state.actionsAnchorEl}
          onClose={this.handleActionsClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <StyledActionsPaper>
            <Button onClick={() => this.handleAddCategory()}>
              + {translator.t('charting.add', { lng: language })}
            </Button>
            {categories.length > 0 &&
              categories.map(
                (category, index) =>
                  category.deletable &&
                  !category.correctness && (
                    <Button key={index} onClick={() => this.handleDeleteCategory(index)}>
                      {`${translator.t('charting.delete', { lng: language })} <${category.label ||
                        translator.t('charting.newLabel', { lng: language })}>`}
                    </Button>
                  ),
              )}
          </StyledActionsPaper>
        </Popover>
      </StyledActions>
    );
  }
}

export default ActionsButton;
