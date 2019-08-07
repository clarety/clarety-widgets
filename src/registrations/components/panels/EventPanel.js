import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { setEvent, resetEvent, panels } from 'registrations/actions';
import { getEvent } from 'registrations/selectors';

class _EventPanel extends React.Component {
  state = {
    event: null,
  };

  onClickNext = () => {
    if (!this.state.event) return;

    this.props.setEvent(this.state.event.eventId);

    this.props.pushPanel({
      panel: panels.qtysPanel,
      progress: 20,
    });
  };

  onClickEdit = () => {
    this.props.popToPanel();
    this.props.resetEvent();
  };

  componentWillUnmount() {
    this.props.resetEvent();
  }

  render() {
    if (this.props.isDone) {
      return this.renderDone();
    } else {
      return this.renderEdit();
    }
  }
  
  renderEdit() {
    const { events } = this.props;

    return (
      <Container>
        <FormattedMessage id="eventPanel.editTitle" tagName="h2" />

        <div className="panel-body">
          <Form.Group>
            <Select
              options={events}
              value={this.state.event}
              onChange={event => this.setState({ event })}
              getOptionLabel={event => event.name}
              getOptionValue={event => event.eventId}
              classNamePrefix="react-select"
            />
          </Form.Group>
        </div>

        <Button
          onClick={this.onClickNext}
          disabled={!this.state.event}
        >
          <FormattedMessage id="btn.next" />
        </Button>
      </Container>
    );
  }

  renderDone() {
    const { selectedEvent } = this.props;

    return (
      <Container>
        <FormattedMessage id="eventPanel.doneTitle" tagName="h4" />
        <p className="lead">{selectedEvent.name}</p>
        <Button onClick={this.onClickEdit}>
          <FormattedMessage id="btn.reset" />
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    events: state.init.events,
    selectedEvent: getEvent(state),
  };
};

const actions = {
  setEvent: setEvent,
  resetEvent: resetEvent,
};

export const EventPanel = connect(mapStateToProps, actions)(_EventPanel);
