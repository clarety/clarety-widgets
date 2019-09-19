import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Form } from 'react-bootstrap';
import { panels, setTeamPanelStatus, checkTeamPassword, selectTeam } from 'registrations/actions';
import { TeamSearchInput } from 'registrations/components';
import { FieldError, Button } from 'form/components';
import { getValidationError } from 'form/utils';

export class _TeamPanel extends React.Component {
  state = {
    password: '',
  };

  _pushNextPanel() {
    this.props.pushPanel({
      panel: panels.eventPanel,
      progress: 20, // TODO: actual progress...
    });
  }

  onClickNext = event => {
    event.preventDefault();
    const { selectedTeam } = this.props;

    if (selectedTeam.passwordRequired) {
      this.props.checkTeamPassword(selectedTeam, this.state.password);
    } else {
      this._pushNextPanel();
    }
  };

  onClickEdit = () => {
    this.props.popToPanel();
  };

  onClickNo = () => {
    this.props.selectTeam(null);
    this._pushNextPanel();
  };

  onClickYes = () => {
    this.props.setPanelStatus('search');
  };

  onClickCancel = () => {
    this.props.setPanelStatus('prompt');
  };

  onClickCreate = () => {
    this.props.setPanelStatus('create');
  };

  onSubmitCreateForm = event => {
    event.preventDefault();

    // TODO: attempt to create team... errors may come back...
  };

  render() {
    if (this.props.isDone) {
      return this.renderDone();
    } else {
      return this.renderEdit();
    }
  }

  renderEdit() {
    const { status } = this.props;

    return (
      <Container>
        <FormattedMessage id="teamPanel.editTitle" tagName="h2" />
        <FormattedMessage id="teamPanel.message.1" tagName="p" />
        <FormattedMessage id="teamPanel.message.2" tagName="p" />

        {status === 'prompt' && this.renderPrompt()}
        {status === 'search' && this.renderSearch()}
        {status === 'create' && this.renderCreate()}
      </Container>
    );
  }

  renderPrompt() {
    return (
      <Form className="panel-body panel-body-team">
        <Button onClick={this.onClickYes}>
          <FormattedMessage id="btn.yes" />
        </Button>

        <Button onClick={this.onClickNo}>
          <FormattedMessage id="btn.no" />
        </Button>
      </Form>
    );
  }

  renderSearch() {
    const { selectedTeam, errors, isBusyPassword } = this.props;
    const { password } = this.state;

    const canContinue = selectedTeam && (selectedTeam.passwordRequired ? !!password : true);
    const showPassword = selectedTeam && !!selectedTeam.passwordRequired;
    const passwordError = getValidationError('team.password', errors);

    return (
      <Form className="panel-body panel-body-team">
        <FormattedMessage id="teamPanel.searchPrompt">
          {text => <TeamSearchInput placeholder={text} />}
        </FormattedMessage>

        {showPassword &&
          <FormattedMessage id="label.password">
            {label =>
              <React.Fragment>
                <Form.Control
                  placeholder={label}
                  value={password}
                  onChange={event => this.setState({ password: event.target.value })}
                  type="password"
                  isInvalid={!!passwordError}
                />
                <FieldError error={passwordError} />
              </React.Fragment>
            }
          </FormattedMessage>
        }

        <Button onClick={this.onClickCancel} disabled={isBusyPassword}>
          <FormattedMessage id="btn.cancel" />
        </Button>

        <Button onClick={this.onClickCreate} disabled={isBusyPassword}>
          <FormattedMessage id="btn.createTeam" />
        </Button>

        <Button onClick={this.onClickNext} disabled={!canContinue} isBusy={isBusyPassword}>
          <FormattedMessage id="btn.next" />
        </Button>
      </Form>
    );
  }

  renderCreate() {
    const canContinue = false; // TODO: implement...
    const isBusyCreate = false; // TODO: get from store...

    return (
      <Form className="panel-body panel-body-team" onSubmit={this.onSubmitCreateForm}>
        <FormattedMessage id="teamPanel.createTeamTitle" tagName="h4" />

        <Button onClick={this.onClickCancel}>
          <FormattedMessage id="btn.cancel" />
        </Button>

        <Button type="submit" disabled={!canContinue} isBusy={isBusyCreate}>
          <FormattedMessage id="btn.createTeam" />
        </Button>
      </Form>
    );
  }

  renderDone() {
    const { selectedTeam } = this.props;

    return (
      <Container>
        <FormattedMessage id="teamPanel.doneTitle" tagName="h4" />

        {selectedTeam !== null
          ? <p>{selectedTeam.name}</p>
          : <FormattedMessage id="teamPanel.noTeam" tagName="p" />
        }

        <Button onClick={this.onClickEdit}>
          <FormattedMessage id="btn.edit" />
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { teamPanel } = state.panels;
  const { selectedTeam } = teamPanel;

  const canContinue = selectedTeam && !selectedTeam.passwordRequired;
  const requiresPassword = selectedTeam && !!selectedTeam.passwordRequired;

  return {
    status: teamPanel.status,
    selectedTeam: teamPanel.selectedTeam,
    canContinue: canContinue,
    requiresPassword: requiresPassword,
    isBusyPassword: teamPanel.isBusyPassword,
    errors: state.errors,
  };
};

const actions = {
  setPanelStatus: setTeamPanelStatus,
  checkTeamPassword: checkTeamPassword,
  selectTeam: selectTeam,
};

export const connectTeamPanel = connect(mapStateToProps, actions);
export const TeamPanel = connectTeamPanel(_TeamPanel);
