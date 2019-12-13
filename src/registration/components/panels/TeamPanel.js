import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { Button, TextInput, SelectInput, CheckboxInput } from 'form/components';
import { TeamSearchInput } from 'registration/components';

export class TeamPanel extends BasePanel {
  state = { mode: 'prompt' };

  onClickNext = async event => {
    event.preventDefault();
    const { selectedTeam, formData, checkTeamPassword, nextPanel } = this.props;

    if (selectedTeam.passwordRequired && !selectedTeam.isCorporateTeam) {
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
    this.props.setOrganisation(null);
    this.props.nextPanel();
  };

  onClickSearch = () => {
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
      <PanelContainer layout={layout} status="wait" className="team-panel">
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
    if (this.props.isCorporateTeam) {
      return this.renderCorporateTeam();
    } else {
      return this.renderTeamSelect();
    }
  }

  renderCorporateTeam() {
    const { layout, index, selectedTeam } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="team-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          intlId="teamPanel.corporateTeamTitle"
        />

        <PanelBody layout={layout} status="edit">

          <p>You are participating with the {selectedTeam.name} team.</p>

          <div className="panel-actions">
            <Button onClick={this.onClickNext}>
              <FormattedMessage id="btn.next" />
            </Button>
          </div>

        </PanelBody>
      </PanelContainer>
    );
  }

  renderTeamSelect() {
    const { layout, index } = this.props;
    const { mode } = this.state;

    return (
      <PanelContainer layout={layout} status="edit" className="team-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          intlId="teamPanel.editTitle"
        />

        <PanelBody layout={layout} status="edit">
          {mode === 'prompt' && this.renderPrompt()}
          {mode === 'search' && this.renderSearch()}
          {mode === 'create' && this.renderCreate()}
        </PanelBody>
      </PanelContainer>
    );
  }

  renderPrompt() {
    const { settings } = this.props;

    return (
      <Form className="panel-body panel-body-team">
        <FormattedMessage id="teamPanel.message.1" tagName="p" />
        <FormattedMessage id="teamPanel.message.2" tagName="p" />

        <div className="panel-actions">

          <div className="d-md-inline mb-3">
            <Button onClick={this.onClickNo} variant="secondary">
              <FormattedMessage id="btn.noTeam" />
            </Button>
          </div>

          {settings.allowCreate &&
            <Button onClick={this.onClickCreate}>
              <FormattedMessage id="btn.createTeam" />
            </Button>
          }

          <Button onClick={this.onClickSearch}>
            <FormattedMessage id="btn.searchTeams" />
          </Button>

        </div>

      </Form>
    );
  }

  renderSearch() {
    const { selectedTeam, isBusyPassword, formData } = this.props;
    const hasSelectedTeam = selectedTeam && !!selectedTeam.teamId;
    const canContinue = hasSelectedTeam && (selectedTeam.passwordRequired ? !!formData['team.passwordCheck'] : true);
    const showPassword = hasSelectedTeam && !!selectedTeam.passwordRequired;

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
            <TextInput field="team.passwordCheck" type="password" />
          </Form.Group>
        }

        <Button onClick={this.onClickCancel} disabled={isBusyPassword} variant="secondary">
          <FormattedMessage id="btn.cancel" />
        </Button>

        <Button onClick={this.onClickNext} disabled={!canContinue} isBusy={isBusyPassword}>
          <FormattedMessage id="btn.next" />
        </Button>
      </Form>
    );
  }

  renderCreate() {
    const { formData, isBusyCreate } = this.props;
    const showPassword = formData['team.passwordRequired'];

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
          <TextInput field="team.name" />
        </Form.Group>

        <Form.Group controlId="team.type">
          <Form.Label>
            <FormattedMessage id="label.team.type" /> *
          </Form.Label>
          <SelectInput field="team.type" options={teamTypeOptions} />
        </Form.Group>

        <Form.Group controlId="team.passwordRequired">
          <CheckboxInput
            field="team.passwordRequired"
            label={<FormattedMessage id="label.team.passwordRequired" />}
          />
        </Form.Group>

        {showPassword &&
          <Form.Group controlId="team.password">
            <Form.Label>
              <FormattedMessage id="label.team.password" /> *
            </Form.Label>
            <TextInput field="team.password" type="password" />
          </Form.Group>
        }        

        <Button onClick={this.onClickCancel} variant="secondary">
          <FormattedMessage id="btn.cancel" />
        </Button>

        <Button type="submit" disabled={!this.canContinueCreate()} isBusy={isBusyCreate}>
          <FormattedMessage id="btn.createTeam" />
        </Button>
      </Form>
    );
  }

  canContinueCreate() {
    const { formData } = this.props;

    if (!formData['team.name']) return false;
    if (!formData['team.type']) return false;
    if (formData['team.passwordRequired'] && !formData['team.password']) return false;
    
    return true;
  }

  renderDone() {
    const { layout, index, selectedTeam } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="team-panel">
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
