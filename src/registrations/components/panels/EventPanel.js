import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Form } from 'react-bootstrap';
import Select from 'react-select';
// TODO: move button into 'form/components'.
import { Button } from 'checkout/components';
import { setEvent, resetEvent, fetchFullEvent } from 'registrations/actions';
import { getEvent } from 'registrations/selectors';

class _EventPanel extends React.Component {
  state = {
    event: null,
  };

  componentDidMount() {
    // Preselect event via url param.
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');

    if (eventId) {
      const event = this.props.events.find(event => event.eventId === eventId);
      this.setState({ event });
    }
  }

  onClickNext = () => {
    if (!this.state.event) return;

    this.props.setEvent(this.state.event.eventId);
    this.props.fetchFullEvent(this.state.event.eventId);
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
    const { events, isBusy } = this.props;

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
          title={<FormattedMessage id="btn.next" />}
          onClick={this.onClickNext}
          disabled={!this.state.event}
          isBusy={isBusy}
          variant="action"
        />
      </Container>
    );
  }

  renderDone() {
    const { selectedEvent } = this.props;

    return (
      <Container>
        <FormattedMessage id="eventPanel.doneTitle" tagName="h4" />
        <p className="lead">{selectedEvent.name}</p>
        <Button
          title={<FormattedMessage id="btn.reset" />}
          onClick={this.onClickEdit}
          variant="action"
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.init.isBusy,
    events: state.init.events,
    selectedEvent: getEvent(state),
  };
};

const actions = {
  setEvent: setEvent,
  resetEvent: resetEvent,
  fetchFullEvent: fetchFullEvent,
};

export const EventPanel = connect(mapStateToProps, actions)(_EventPanel);
