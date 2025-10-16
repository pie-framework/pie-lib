import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Restore from '@mui/icons-material/Restore';
import Undo from '@mui/icons-material/Undo';

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const ResetUndoContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledIcon = styled('div')(({ theme }) => ({
  width: '24px',
  height: '24px',
  color: 'gray',
  marginRight: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
}));

/**
 * HOC that adds undo and reset functionality for session values
 */
const withUndoReset = (WrappedComponent) => {
  class WithUndoReset extends React.Component {
    static propTypes = {
      session: PropTypes.object,
      onSessionChange: PropTypes.func,
    };

    constructor(props) {
      super(props);

      this.state = {
        sessionInitialValues: JSON.parse(JSON.stringify(props.session)),
        session: props.session,
        changes: [],
      };
    }

    onSessionChange = (session) => {
      this.setState(
        (state) => ({ session, changes: [...state.changes, session] }),
        () => this.props.onSessionChange(session),
      );
    };

    onUndo = () => {
      this.setState(
        (state) => {
          const newChanges = [...state.changes];

          newChanges.pop();

          return {
            changes: newChanges,
            session: newChanges.length ? newChanges[newChanges.length - 1] : state.sessionInitialValues,
          };
        },
        () => this.props.onSessionChange(this.state.session),
      );
    };

    onReset = () => {
      this.setState(
        (state) => ({ session: state.sessionInitialValues, changes: [] }),
        () => this.props.onSessionChange(this.state.sessionInitialValues),
      );
    };

    render() {
      const { ...rest } = this.props;
      const { changes, session } = this.state;

      return (
        <Wrapper>
          <ResetUndoContainer>
            <StyledButton color="primary" disabled={changes.length === 0} onClick={this.onUndo}>
              <StyledIcon>
                <Undo />
              </StyledIcon>
              Undo
            </StyledButton>
            <StyledButton color="primary" disabled={changes.length === 0} onClick={this.onReset}>
              <StyledIcon>
                <Restore />
              </StyledIcon>
              Start Over
            </StyledButton>
          </ResetUndoContainer>
          <WrappedComponent {...rest} session={session} onSessionChange={this.onSessionChange} />
        </Wrapper>
      );
    }
  }

  return WithUndoReset;
};

export default withUndoReset;
