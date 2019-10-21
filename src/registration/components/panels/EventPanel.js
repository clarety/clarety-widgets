import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { Button } from 'form/components';
import { setEvent, resetEvent, fetchFullEvent } from 'registration/actions';
import { getEvent } from 'registration/selectors';

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
    const { setEvent, fetchFullEvent, nextPanel } = this.props;
    const { event } = this.state;

    if (!event) return;

    setEvent(event.eventId);

    const didFetch = await fetchFullEvent(event.eventId);
    if (!didFetch) return;

    nextPanel();
  };

  onClickEdit = () => {
    this.props.editPanel();
    this.props.resetEvent();
  };

  reset() {
    this.props.resetEvent();
  }

  renderWait() {
    return null;
  }
  
  renderEdit() {
    const { layout, index, events, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Select Event"
          intlId="eventPanel.editTitle"
        />

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

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

          <div className="panel-actions">
            <Button
              onClick={this.onClickNext}
              disabled={!this.state.event}
              isBusy={isBusy}
            >
              <FormattedMessage id="btn.next" />
            </Button>
          </div>

        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, selectedEvent } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={selectedEvent}
          onPressEdit={this.onPressEdit}
          intlId="eventPanel.doneTitle"
        />

        <PanelBody layout={layout} status="done">

          <p className="lead">{selectedEvent.name}</p>

          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>
          
        </PanelBody>
      </PanelContainer>
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

export const EventPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_EventPanel);
