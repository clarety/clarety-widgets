import React from 'react';
import { Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Select from 'react-select';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { Button, TextInput } from 'form/components';
import { LanguageSelect } from 'registration/components';

export class EventPanel extends BasePanel {
  state = {
    event: null,
    state: null,
  };
  
  componentDidUpdate(prevProps) {
    const { events } = this.props;

    if (events !== prevProps.events) {
      // Preselect event via url param.
      const urlParams = new URLSearchParams(window.location.search);
      const eventId = urlParams.get('event');

      if (eventId) {
        const event = events.find(event => event.eventId === eventId);
        this.setState({ event });
      }
    }
  }

  onSelectState = (state) => {
    this.setState({ state });
    this.autoSelectSingleEvent(state);
  }

  autoSelectSingleEvent(state) {
    if (!state) return;

    const events = this.props.events.filter(event => event.state === state);
    if (events.length === 1) {
      this.setState({ event: events[0] });
    }
  }

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
          title={t('eventPanel.editTitle', 'Which Location Are You Registering For?')}
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
              {t('btn.next', 'Next')}
            </Button>
          </div>

          {settings.showLanguageSelect &&
            <LanguageSelect />
          }

        </PanelBody>
      </PanelContainer>
    );
  }

  renderStateButtons() {
    return (
      <ToggleButtonGroup
        type="radio"
        name="state"
        value={this.state.state}
        onChange={this.onSelectState}
        className="state-buttons"
      >
        {this.props.stateOptions.map(option => (
          <ToggleButton value={option.value} key={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  }

  renderEventSelect() {
    return (
      <Form.Group>
        <Select
          options={this.getEventOptions()}
          value={this.state.event}
          onChange={event => this.setState({ event })}
          placeholder={t('label.selectEvent', 'Select event')}
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
      <div className="promo-code">
        <Form.Group controlId="promoCode">
          <Form.Label>
            {t('label.promoCodePrompt', 'If applicable, enter the promo code provided')}
          </Form.Label>
          <TextInput
            field="promoCode"
            placeholder={t('label.promoCode', 'Promo code')}
          />
        </Form.Group>
      </div>
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
          title={t('eventPanel.doneTitle', 'Location')}
          onPressEdit={this.onPressEdit}
        />
        <PanelBody layout={layout} status="done">

          <p>{selectedEvent.name}</p>

          <Button onClick={this.onClickEdit}>
            {t('btn.edit', 'Edit')}
          </Button>
          
        </PanelBody>
      </PanelContainer>
    );
  }
}
