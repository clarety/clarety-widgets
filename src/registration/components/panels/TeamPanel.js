import React from 'react';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
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
          title={t('teamPanel.corporateTeamTitle', 'Your Team')}
        />

        <PanelBody layout={layout} status="edit">

          <p>You are participating with the {selectedTeam.name} team.</p>

          <div className="panel-actions">
            <Button onClick={this.onClickNext}>
              {t('btn.next', 'Next')}
            </Button>
          </div>

        </PanelBody>
      </PanelContainer>
    );
  }

  renderTeamSelect() {
    const { layout, index, settings } = this.props;
    const { mode } = this.state;

    return (
      <PanelContainer layout={layout} status="edit" className="team-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={t('teamPanel.editTitle', settings.title || 'Do you want to participate with a team?')}
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
        <p>{t('teamPanel.message-1', settings.messageText1 || 'Combine your efforts and participate as a team! Either create a new team or join one that’s already been created.')}</p>
        <p>{t('teamPanel.message-2', settings.messageText2 || 'If you are registering with an existing team, please contact your team leader for the team name and password (if applicable) before proceeding with the team registration process.')}</p>

        <div className="panel-actions">

          <div className="d-md-inline mb-3">
            <Button onClick={this.onClickNo} variant="secondary">
              {t('btn.noTeam', 'No Thanks')}
            </Button>
          </div>

          {settings.allowCreate &&
            <Button onClick={this.onClickCreate}>
              {t('btn.createTeam', 'Create Team')}
            </Button>
          }

          <Button onClick={this.onClickSearch}>
            {t('btn.searchTeams', 'Search Teams')}
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
          <Form.Label>{t('label.team.search', 'Team Search')}</Form.Label>
          <TeamSearchInput placeholder={t('label.team.name', 'Team Name')} />
        </Form.Group>

        {showPassword &&
          <Form.Group controlId="team.passwordCheck">
            <Form.Label>{t('label.team.password', 'Team Password')}</Form.Label>
            <TextInput field="team.passwordCheck" type="password" />
          </Form.Group>
        }

        <Button onClick={this.onClickCancel} disabled={isBusyPassword} variant="secondary">
          {t('btn.cancel', 'Cancel')}
        </Button>

        <Button onClick={this.onClickNext} disabled={!canContinue} isBusy={isBusyPassword}>
          {t('btn.next', 'Next')}
        </Button>
      </Form>
    );
  }

  renderCreate() {
    const { formData, isBusyCreate, settings } = this.props;
    const showPasswordCheckbox = settings.showPassword;
    const showPasswordInput = settings.showPassword && formData['team.passwordRequired'];

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
        <h4>{t('teamPanel.createTeamTitle', 'Create New Team')}</h4>

        <Form.Group controlId="team.name">
          <Form.Label>{t('label.team.name', 'Team Name')}</Form.Label>
          <TextInput field="team.name" />
        </Form.Group>

        {settings.showTeamType &&
          <Form.Group controlId="team.type">
            <Form.Label>{t('label.team.type', 'Team Type')}</Form.Label>
            <SelectInput field="team.type" options={teamTypeOptions} />
          </Form.Group>
        }

        {showPasswordCheckbox &&
          <Form.Group controlId="team.passwordRequired">
            <CheckboxInput
              field="team.passwordRequired"
              label={t('label.team.passwordRequired', 'Should team members enter a password in order to join?')}
            />
          </Form.Group>
        }

        {showPasswordInput &&
          <Form.Group controlId="team.password">
            <Form.Label>{t('label.team.password', 'Team Password')}</Form.Label>
            <TextInput field="team.password" type="password" />
          </Form.Group>
        }        

        <Button onClick={this.onClickCancel} variant="secondary">
          {t('btn.cancel', 'Cancel')}
        </Button>

        <Button type="submit" disabled={!this.canContinueCreate()} isBusy={isBusyCreate}>
          {t('btn.createTeam', 'Create Team')}
        </Button>
      </Form>
    );
  }

  canContinueCreate() {
    const { formData, settings } = this.props;

    if (!formData['team.name']) return false;
    if (settings.showTeamType && !formData['team.type']) return false;
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
          title={t('teamPanel.doneTitle', 'Your Team')}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">

          {selectedTeam !== null
            ? <p>{selectedTeam.name}</p>
            : <p>{t('teamPanel.noTeam', 'No Team')}</p>
          }

          <Button onClick={this.onClickEdit}>
            {t('btn.edit', 'Edit')}
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }
}
