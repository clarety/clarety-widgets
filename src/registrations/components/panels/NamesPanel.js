import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { setFirstNames, resetFirstNames, panels } from 'registrations/actions';
import { calcProgress } from 'registrations/utils';

class _NamesPanel extends React.Component {
  state = {
    names: [],
  };

  onChangeName = (index, name) => {
    this.setState(prevState => {
      const names = [...prevState.names];
      names[index] = name;
      return { names };
    });
  };

  onClickNext = event => {
    event.preventDefault();

    if (!this.canContinue()) return;

    const { setFirstNames, pushPanel } = this.props;

    setFirstNames(this.state.names);

    const participantCount = this.state.names.length;

    pushPanel({
      panel: panels.detailsPanel,
      progress: calcProgress(participantCount, 0),
      props: { participantIndex: 0 },
    });
  };

  onClickEdit = () => {
    // Update our component state with the names from the store.
    const { participants } = this.props;
    this.setState({
      names: participants.map(participant => participant.customer.firstName),
    });

    this.props.popToPanel();
  };

  componentWillUnmount() {
    this.props.resetFirstNames();
  }

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
        <FormattedMessage id="namesPanel.editTitle" tagName="h2" />

        <Form onSubmit={this.onClickNext} className="panel-body panel-body-names">
          {this.renderRows()}

          <div className="text-center">
            <Button type="submit" disabled={!this.canContinue()}>
              <FormattedMessage id="btn.next" />
            </Button>
          </div>
        </Form>
      </Container>
    );
  }

  renderRows() {
    const { participants } = this.props;
    const { names } = this.state;

    return participants.map((participant, index) =>
      <Row key={index} className="mb-3 align-items-center">
        <Col xs={2}>
          <span className="circle">{index + 1}</span>
        </Col>
        <Col>
          <FormattedMessage id={`namesPanel.${participant.type}.title`}>
            {txt => <span className="lead">{txt}</span>}
          </FormattedMessage>
        </Col>
        <Col>
          <Form.Control
            placeholder="First Name"
            value={names[index] || ''}
            onChange={event => this.onChangeName(index, event.target.value)}
          />
        </Col>
      </Row>
    );
  }

  renderDone() {
    const { participants } = this.props;

    return (
      <Container>
        <FormattedMessage id="namesPanel.doneTitle" tagName="h4" />

        <p>
          {participants.map((participant, index) =>
            <React.Fragment key={index}>
              <span className="lead">{index + 1}. {participant.customer.firstName}</span>
              <br />
            </React.Fragment>
          )}
        </p>

        <Button onClick={this.onClickEdit}>
          <FormattedMessage id="btn.edit" />
        </Button>
      </Container>
    );
  }

  canContinue() {
    const { participants } = this.props;
    const { names } = this.state;

    if (names.length !== participants.length) return false;

    for (let name of names) {
      if (!name.trim()) return false;
    }

    return true;
  }
}

const mapStateToProps = state => {
  return {
    participants: state.panelData.participants,
  };
};

const actions = {
  setFirstNames: setFirstNames,
  resetFirstNames: resetFirstNames,
};

export const NamesPanel = connect(mapStateToProps, actions)(_NamesPanel);
