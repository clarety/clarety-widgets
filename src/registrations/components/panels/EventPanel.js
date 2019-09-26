import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Form } from 'react-bootstrap';
import Select from 'react-select';
import { panels } from 'shared/actions';
import { Button } from 'form/components';
import { BasePanel } from 'registrations/components';
import { setEvent, resetEvent, fetchFullEvent } from 'registrations/actions';
import { getEvent } from 'registrations/selectors';

class _EventPanel extends BasePanel {
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

  onClickNext = async () => {
    const { setEvent, fetchFullEvent, pushPanel } = this.props;
    const { event } = this.state;

    if (!event) return;

    setEvent(event.eventId);

    const didFetch = await fetchFullEvent(event.eventId);
    if (!didFetch) return;

    pushPanel({ panel: panels.qtysPanel, progress: 20 });
  };

  onClickEdit = () => {
    this.props.popToPanel();
    this.props.resetEvent();
  };

  componentWillUnmount() {
    this.props.resetEvent();
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
          onClick={this.onClickNext}
          disabled={!this.state.event}
          isBusy={isBusy}
          variant="action"
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

        <Button onClick={this.onClickEdit} variant="action">
          <FormattedMessage id="btn.reset" />
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.settings.isBusy,
    events: state.settings.events,
    selectedEvent: getEvent(state),
  };
};

const actions = {
  setEvent: setEvent,
  resetEvent: resetEvent,
  fetchFullEvent: fetchFullEvent,
};

export const EventPanel = connect(mapStateToProps, actions)(_EventPanel);
