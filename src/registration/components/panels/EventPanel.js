import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Select from 'react-select';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { Button, TextInput } from 'form/components';

export class EventPanel extends BasePanel {
  state = {
    event: null,
    state: null,
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

  onSelectState = (state) => this.setState({ state });

  onClickNext = async () => {
    const { formData, fetchFullEvent, checkPromoCode, nextPanel } = this.props;
    const { event } = this.state;
    const promoCode = formData['promoCode'];

    if (!event) return;

    if (promoCode) {
      const isValidPromoCode = await checkPromoCode(promoCode);
      if (!isValidPromoCode) return;
    }

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
    const { layout, index, isBusy, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="event-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          intlId="eventPanel.editTitle"
        />

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          {settings.showStateButtons && this.renderStateButtons()}
          {this.renderEventSelect()}
          {settings.showPromoCode && this.renderPromoCode()}

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

  renderStateButtons() {
    return (
      <div className="text-center mb-3">
        <ToggleButtonGroup
          type="radio"
          name="state"
          value={this.state.state}
          onChange={this.onSelectState}
        >
          {this.props.stateOptions.map(option => (
            <ToggleButton value={option.value} key={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    );
  }

  renderEventSelect() {
    return (
      <Form.Group>
        <Select
          options={this.getEventOptions()}
          value={this.state.event}
          onChange={event => this.setState({ event })}
          placeholder="Select event"
          getOptionLabel={event => event.name}
          getOptionValue={event => event.eventId}
          classNamePrefix="react-select"
        />
      </Form.Group>
    );
  }

  getEventOptions() {
    const { events } = this.props;
    const { state } = this.state;

    if (!state) return events;

    return events
      .filter(event => event.state === state)
      .sort((a, b) => b.listOrder - a.listOrder);
  }

  renderPromoCode() {
    return (
      <Form.Group controlId="promoCode">
        <Form.Label>
          <FormattedMessage id="label.promoCode" />
        </Form.Label>
        <TextInput field="promoCode" placeholder="Promo code (optional)" />
      </Form.Group>
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
