import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form } from 'react-bootstrap';
import { TeamSearchInput } from 'registrations/components';
import { searchTeams, selectTeam } from 'registrations/actions';

export class _TeamPanel extends React.Component {
  onClickNext = () => {
    // TODO:
    console.log('TeamPanel onClickNext');
  };

  onClickEdit = () => {
    this.props.popToPanel();
  };



  render() {
    if (this.props.isDone) {
      return this.renderDone();
    } else {
      return this.renderEdit();
    }
  }

  renderEdit() {
    return (
      <Container>
        <FormattedMessage id="teamPanel.editTitle" tagName="h2" />
        <FormattedMessage id="teamPanel.message.1" tagName="p" />
        <FormattedMessage id="teamPanel.message.2" tagName="p" />

        <Form className="panel-body panel-body-team">
          <FormattedMessage id="teamPanel.searchPrompt">
            {text => <TeamSearchInput placeholder={text} />}
          </FormattedMessage>
        </Form>

        <Button onClick={this.onClickNext}>
          <FormattedMessage id="btn.next" />
        </Button>
      </Container>
    );
  }

  renderDone() {
    return (
      <Container>
        <FormattedMessage id="teamPanel.doneTitle" tagName="h4" />

        <Button onClick={this.onClickEdit}>
          <FormattedMessage id="btn.edit" />
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { teamPanel } = state.panels;

  return {
    isBusySearch: teamPanel.isBusySearch,
    searchResults: teamPanel.searchResults,
    selectedTeam: teamPanel.selectedTeam,
  };
};

const actions = {
  searchTeams: searchTeams,
  selectTeam: selectTeam,
};

export const connectTeamPanel = connect(mapStateToProps, actions);
export const TeamPanel = connectTeamPanel(_TeamPanel);
