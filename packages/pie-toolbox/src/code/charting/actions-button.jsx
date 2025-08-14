import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';

import { color } from '../render-ui';
import Translator from '../translator';

const { translator } = Translator;

export class ActionsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actionsAnchorEl: null,
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
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
    const { classes, categories, language } = this.props;

    return (
      <div className={classes.actions}>
        <div role="button" tabIndex={0} className={classes.trigger} onClick={this.handleActionsClick}>
          Actions
        </div>
        <Popover
          open={Boolean(this.state.actionsAnchorEl)}
          anchorEl={this.state.actionsAnchorEl}
          onClose={this.handleActionsClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Paper className={classes.actionsPaper}>
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
          </Paper>
        </Popover>
      </div>
    );
  }
}

const styles = (theme) => ({
  actions: {
    alignSelf: 'flex-end',
  },
  trigger: {
    cursor: 'pointer',
    fontSize: theme.typography.fontSize,
    color: color.tertiary(),
    padding: theme.spacing.unit,
  },
  actionsPaper: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.unit,
    '& button': {
      textTransform: 'none',
      fontSize: theme.typography.fontSize,
      color: color.text(),
      justifyContent: 'flex-start',
    },
  },
});

export default withStyles(styles)(ActionsButton);
