import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { Button } from 'form/components';

export class EventPanel extends BasePanel {
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
    const { fetchFullEvent, nextPanel } = this.props;
    const { event } = this.state;

    if (!event) return;

    const didFetch = await fetchFullEvent(event.eventId);
    if (!didFetch) return;

    nextPanel();
  };

  onClickEdit = () => {
    this.props.editPanel();
  };

  reset() {
  }

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
    const { layout, index, events, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
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
          intlId="eventPanel.doneTitle"
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">

          <p>{selectedEvent.name}</p>

          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>
          
        </PanelBody>
      </PanelContainer>
    );
  }
}
