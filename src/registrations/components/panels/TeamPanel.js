import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form, Col } from 'react-bootstrap';

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

        <Form className="panel-body panel-body-teams">
          <p>Hello, teams panel!</p>
        </Form>

        <Button onClick={this.onClickNext} disabled={true}>
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
  return {
    
  };
};

const actions = {
  
};

export const connectTeamPanel = connect(mapStateToProps, actions);
export const TeamPanel = connectTeamPanel(_TeamPanel);



