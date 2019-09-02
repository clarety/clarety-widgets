import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Form } from 'react-bootstrap';
import Select from 'react-select';
// TODO: move button into 'form/components'.
import { Button } from 'checkout/components';
import { statuses, updateFormData, fetchFullEvent } from 'registrations/actions';
import { getEvent } from 'registrations/selectors';

class _EventPanel extends React.Component {
  componentDidMount() {
    // Preselect event via url param.
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');

    if (eventId) {
      this.props.updateFormData({ eventId });
    }
  }

  onChange = event => {
    this.props.updateFormData({ eventId: event.eventId });
  };

  onClickNext = () => {
    const { formData, fetchFullEvent } = this.props;
    fetchFullEvent(formData['eventId']);
  };

  onClickEdit = () => {
    this.props.popToPanel();
    this.props.updateFormData({ eventId: undefined });
  };

  componentWillUnmount() {
    this.props.updateFormData({ eventId: undefined });
  }

  render() {
    if (this.props.isDone) {
      return this.renderDone();
    } else {
      return this.renderEdit();
    }
  }
  
  renderEdit() {
    const { isBusy, events, formData } = this.props;
    const value = events.find(event => event.eventId === formData['eventId']);

    return (
      <Container>
        <FormattedMessage id="eventPanel.editTitle" tagName="h2" />

        <div className="panel-body">
          <Form.Group>
            <Select
              options={events}
              value={value}
              onChange={this.onChange}
              getOptionLabel={event => event.name}
              getOptionValue={event => event.eventId}
              classNamePrefix="react-select"
            />
          </Form.Group>
        </div>

        <Button
          title={<FormattedMessage id="btn.next" />}
          onClick={this.onClickNext}
          disabled={!value}
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
    isBusy: state.status === statuses.fetchingEvent,
    events: state.settings.events,
    formData: state.formData,
    selectedEvent: getEvent(state),
  };
};

const actions = {
  updateFormData: updateFormData,
  fetchFullEvent: fetchFullEvent,
};

export const EventPanel = connect(mapStateToProps, actions)(_EventPanel);
