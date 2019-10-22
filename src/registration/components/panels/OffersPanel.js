import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { currency } from 'shared/utils';
import { setFirstNames, resetFirstNames, setOffers, resetOffers, prefillDetails } from 'registration/actions';
import { getParticipants, getOffersForAllParticipants, getPreviousParticipants } from 'registration/selectors';

class _RegistrationOffersPanel extends BasePanel {
  state = {
    names: [],
    offers: [],
    prefills: [],
  };

  updateProperty = (property, index, value) => this.setState(prevState => ({
    [property]: Object.assign([...prevState[property]], { [index]: value }),
  }));

  onChangeName = (index, name) => this.updateProperty('names', index, name);

  onSelectOffer = (index, offer) => this.updateProperty('offers', index, offer);

  onSelectPrefill = (index, prefill) => this.updateProperty('prefills', index, prefill);

  onClickNext = event => {
    event.preventDefault();

    if (!this.canContinue()) return;

    const { settings, setFirstNames, setOffers, prefillDetails, nextPanel } = this.props;
    const { names, offers, prefills } = this.state;

    setFirstNames(names);

    if (settings.showOffers) setOffers(offers);

    if (settings.showPrefill) prefillDetails(prefills);

    nextPanel();
  };

  onClickEdit = () => {
    // Update our component state with the names from the store.
    const { participants } = this.props;
    this.setState({
      names: participants.map(participant => participant.customer.firstName),
    });

    this.props.editPanel();
  };

  reset() {
    const { resetFirstNames, resetOffers, settings } = this.props;

    this.setState({ names: [], offers: [] });

    resetFirstNames();

    if (settings.showOffers) resetOffers();
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
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="offers">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          intlId="offersPanel.editTitle"
        />

        <PanelBody layout={layout} status="edit">

          <Form onSubmit={this.onClickNext}>
            {this.renderRows()}

            <div className="panel-actions">
              <Button type="submit" disabled={!this.canContinue()}>
                <FormattedMessage id="btn.next" />
              </Button>
            </div>
          </Form>

        </PanelBody>
      </PanelContainer>
    );
  }

  renderRows() {
    const { participants, settings } = this.props;
    
    return participants.map((participant, index) =>
      <Row key={index} className="mb-3 align-items-center">
        <Col md={1}>
          <span className="circle">{index + 1}</span>
        </Col>
        
        <Col md={1}>
          <FormattedMessage id={`offersPanel.${participant.type}.title`}>
            {txt => <p className="lead m-0">{txt}</p>}
          </FormattedMessage>
        </Col>

        {settings.showOffers &&
          <Col md={6}>
            {this.renderOffers(index)}
          </Col>
        }

        <Col md={4}>
          {settings.showPrefill
            ? this.renderPrefillOptions(index)
            : this.renderNameInput(index)
          }
        </Col>
      </Row>
    );
  }

  renderPrefillOptions(index) {
    const prefill = this.state.prefills[index];
    const options = this.getPrefillOptions(index);
    const onChange = event => this.onSelectPrefill(index, event.target.value);

    return (
      <React.Fragment>
        <Form.Group controlId={`prefill-options-${index}`}>
          <Form.Label>
            <FormattedMessage id={`offersPanel.prefillPrompt`} />
          </Form.Label>
          <Form.Control as="select" onChange={onChange} value={prefill}>
            <option hidden>Select</option>
            {options.map(option =>
              <option key={option.value} value={option.value}>{option.label}</option>
            )}
          </Form.Control>
        </Form.Group>

        {prefill === 'other' &&
          this.renderNameInput(index)
        }
      </React.Fragment>
    );
  }

  renderNameInput(index) {
    const { names } = this.state;

    return (
      <FormattedMessage id={`label.firstName`}>
        {label =>
          <Form.Control
            placeholder={label}
            value={names[index] || ''}
            onChange={event => this.onChangeName(index, event.target.value)}
          />
        }
      </FormattedMessage>
    );
  }

  renderOffers(index) {
    const { offers } = this.props;
    const selectedOffer = this.state.offers[index];

    return offers[index].map(offer => 
      <OfferButton
        key={offer.offerId}
        offer={offer}
        isSelected={offer === selectedOffer}
        onClick={() => this.onSelectOffer(index, offer)}
      />
    );
  }

  renderDone() {
    const { layout, index, participants } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          intlId="offersPanel.doneTitle"
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">

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

        </PanelBody>
      </PanelContainer>
    );
  }

  getPrefillOptions(index) {
    const options = [];

    this.maybeAddOption(options, index, 'yourself', 'Yourself');

    this.props.previousParticipants.forEach(participant => {
      const name = `${participant.firstName} ${participant.lastName}`;
      this.maybeAddOption(options, index, participant.id, name);
    });

    options.push({ value: 'other', label: 'Other' });

    return options;
  }

  maybeAddOption(options, index, value, label) {
    const valueIndex = this.state.prefills.indexOf(value);
    if (valueIndex === index || valueIndex === -1) {
      options.push({ value, label });
    }
  }

  canContinue() {
    const { participants, settings } = this.props;
    const { names, offers, prefills } = this.state;

    const count = participants.length;

    // If showing offers, every participant needs a selected offer.

    if (settings.showOffers) {
      for (let index = 0; index < count; index++) {
        if (!offers[index]) return false;
      }
    }

    if (settings.showPrefill) {
      // If showing prefills, every participant needs a prefil selection,
      // and any 'other' prefills need a name.

      for (let index = 0; index < count; index++) {
        if (!prefills[index]) return false;
        if (prefills[index] === 'other') {
          if (!names[index] || !names[index].trim()) return false;
        }
      }

    } else {
      // If not showing prefils, every participant needs name.

      for (let index = 0; index < count; index++) {
        if (!names[index] || !names[index].trim()) return false;
      }
    }

    return true;
  }
}

const mapStateToProps = state => {
  return {
    participants: getParticipants(state),
    offers: getOffersForAllParticipants(state),
    previousParticipants: getPreviousParticipants(state),
  };
};

const actions = {
  setFirstNames: setFirstNames,
  resetFirstNames: resetFirstNames,
  prefillDetails: prefillDetails,
  setOffers: setOffers,
  resetOffers: resetOffers,
};

export const RegistrationOffersPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_RegistrationOffersPanel);

const OfferButton = ({ offer, isSelected, onClick }) => {
  const className = isSelected ? 'btn btn-offer selected' : 'btn btn-offer';

  return (
    <Button onClick={onClick} className={className}>
      <span className="offer-name">{offer.name}</span>
      <span className="offer-price">{currency(Number(offer.amount))}</span>
    </Button>
  );
};
