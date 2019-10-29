import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { Button, TextInput as FormTextInput, SelectInput as FormSelectInput } from 'form/components';
import { TeamSearchInput } from 'registration/components';

export class TeamPanel extends BasePanel {
  state = { mode: 'prompt' };

  onClickNext = async event => {
    event.preventDefault();
    const { selectedTeam, formData, checkTeamPassword, nextPanel } = this.props;

    if (selectedTeam.passwordRequired) {
      const isCorrect = await checkTeamPassword(selectedTeam, formData['team.passwordCheck']);
      if (!isCorrect) return;
    }

    nextPanel();
  };

  onClickEdit = () => {
    this.setPanelMode('prompt');
    this.props.editPanel();
  };

  onClickNo = () => {
    this.props.selectTeam(null);
    this.props.nextPanel();
  };

  onClickYes = () => {
    this.setPanelMode('search');
  };

  onClickCancel = () => {
    this.setPanelMode('prompt');
  };

  onClickCreate = () => {
    this.setPanelMode('create');
  };

  onSubmitCreateForm = async event => {
    event.preventDefault();

    const { createTeam, nextPanel } = this.props;

    const didCreate = await createTeam();
    if (!didCreate) return;

    nextPanel();
  };

  setPanelMode = (mode) => this.setState({ mode });

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index } = this.props;
    const { mode } = this.state;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          intlId="teamPanel.editTitle"
        />

        <PanelBody layout={layout} status="edit">

          <FormattedMessage id="teamPanel.message.1" tagName="p" />
          <FormattedMessage id="teamPanel.message.2" tagName="p" />

          {mode === 'prompt' && this.renderPrompt()}
          {mode === 'search' && this.renderSearch()}
          {mode === 'create' && this.renderCreate()}

        </PanelBody>
      </PanelContainer>
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
    const { layout, index, selectedTeam } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          intlId="teamPanel.doneTitle"
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">

          {selectedTeam !== null
            ? <p>{selectedTeam.name}</p>
            : <FormattedMessage id="teamPanel.noTeam" tagName="p" />
          }

          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }
}
