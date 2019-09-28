import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Form } from 'react-bootstrap';
import { Button, TextInput as FormTextInput, SelectInput as FormSelectInput } from 'form/components';
import { BasePanel, TeamSearchInput } from 'registrations/components';
import { setTeamPanelMode, checkTeamPassword, selectTeam, createTeam } from 'registrations/actions';

export class _TeamPanel extends BasePanel {
  _pushNextPanel() {
    this.props.pushPanel({ component: 'EventPanel' });
  }

  onClickNext = async event => {
    event.preventDefault();
    const { selectedTeam, formData, checkTeamPassword } = this.props;

    if (selectedTeam.passwordRequired) {
      const isCorrect = await checkTeamPassword(selectedTeam, formData['team.passwordCheck']);
      if (!isCorrect) return;
    }

    this._pushNextPanel();
  };

  onClickEdit = () => {
    this.props.setPanelMode('prompt');
    this.props.popToPanel();
  };

  onClickNo = () => {
    this.props.selectTeam(null);
    this._pushNextPanel();
  };

  onClickYes = () => {
    this.props.setPanelMode('search');
  };

  onClickCancel = () => {
    this.props.setPanelMode('prompt');
  };

  onClickCreate = () => {
    this.props.setPanelMode('create');
  };

  onSubmitCreateForm = async event => {
    event.preventDefault();

    const { createTeam, pushPanel } = this.props;

    const didCreate = await createTeam();
    if (!didCreate) return;

    // TODO: push the correct panel...
    pushPanel({ component: 'EventPanel' });
  };

  renderWait() {
    return null;
  }

  renderEdit() {
    const { mode } = this.props;

    return (
      <Container>
        <FormattedMessage id="teamPanel.editTitle" tagName="h2" />
        <FormattedMessage id="teamPanel.message.1" tagName="p" />
        <FormattedMessage id="teamPanel.message.2" tagName="p" />

        {mode === 'prompt' && this.renderPrompt()}
        {mode === 'search' && this.renderSearch()}
        {mode === 'create' && this.renderCreate()}
      </Container>
    );
  }

  renderPrompt() {
    return (
      <Form className="panel-body panel-body-team">
        <Button onClick={this.onClickNo}>
          <FormattedMessage id="btn.no" />
        </Button>

        <Button onClick={this.onClickYes}>
          <FormattedMessage id="btn.yes" />
        </Button>
      </Form>
    );
  }

  renderSearch() {
    const { selectedTeam, isBusyPassword, formData } = this.props;
    const canContinue = selectedTeam && (selectedTeam.passwordRequired ? !!formData['team.passwordCheck'] : true);
    const showPassword = selectedTeam && !!selectedTeam.passwordRequired;

    return (
      <Form className="panel-body panel-body-team">
        <Form.Group controlId="team.search">
          <Form.Label>
            <FormattedMessage id="label.team.search" />
          </Form.Label>
          <FormattedMessage id="label.team.name">
            {text => <TeamSearchInput placeholder={text} />}
          </FormattedMessage>
        </Form.Group>

        {showPassword &&
          <Form.Group controlId="team.passwordCheck">
            <Form.Label>
              <FormattedMessage id="label.team.password" />
            </Form.Label>
            <FormTextInput field="team.passwordCheck" type="password" />
          </Form.Group>
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
    const { formData, isBusyCreate } = this.props;
    const canContinue = !!formData['team.name'] && !!formData['team.type'];

    // TODO: move these options somewhere else...
    // TODO: translate...
    const teamTypeOptions = [
      { value: '13', label: 'Schools' },
      { value: '14', label: 'Higher education' },
      { value: '15', label: 'Gym, fitness and wellbeing' },
      { value: '16', label: 'Companies, departments and agencies' },
      { value: '17', label: 'Family and friends' },
      { value: '18', label: 'Community and sporting groups' },
    ];

    return (
      <Form className="panel-body panel-body-team" onSubmit={this.onSubmitCreateForm}>
        <FormattedMessage id="teamPanel.createTeamTitle" tagName="h4" />

        <Form.Group controlId="team.name">
          <Form.Label>
            <FormattedMessage id="label.team.name" /> *
          </Form.Label>
          <FormTextInput field="team.name" />
        </Form.Group>

        <Form.Group controlId="team.type">
          <Form.Label>
            <FormattedMessage id="label.team.type" /> *
          </Form.Label>
          <FormSelectInput field="team.type" options={teamTypeOptions} />
        </Form.Group>

        <Form.Group controlId="team.password">
          <Form.Label>
            <FormattedMessage id="label.team.password" />
          </Form.Label>
          <FormattedMessage id="label.optional">
            {text => <FormTextInput field="team.password" placeholder={text} type="password" />}
          </FormattedMessage>
        </Form.Group>

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
  const { mode, selectedTeam, isBusyPassword, isBusyCreate } = teamPanel;

  const canContinue = selectedTeam && !selectedTeam.passwordRequired;
  const requiresPassword = selectedTeam && !!selectedTeam.passwordRequired;

  return {
    mode: mode,
    selectedTeam: selectedTeam,
    canContinue: canContinue,
    requiresPassword: requiresPassword,
    isBusyPassword: isBusyPassword,
    isBusyCreate: isBusyCreate,
    formData: state.formData,
    errors: state.errors,
  };
};

const actions = {
  setPanelMode: setTeamPanelMode,
  checkTeamPassword: checkTeamPassword,
  selectTeam: selectTeam,
  createTeam: createTeam,
};

export const connectTeamPanel = connect(mapStateToProps, actions, null, { forwardRef: true });
export const TeamPanel = connectTeamPanel(_TeamPanel);
