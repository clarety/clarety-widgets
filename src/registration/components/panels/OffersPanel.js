import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { currency } from 'shared/utils';

export class OffersPanel extends BasePanel {
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

  onShowPanel() {
    this.autoSelectSingleOffers();
  }

  autoSelectSingleOffers() {
    const { participants, offers } = this.props;

    for (let index = 0; index < participants.length; index++) {
      // If we've only got one offer...
      if (offers[index].length === 1) {
        // ...then select it.
        this.onSelectOffer(index, offers[index][0]);
      }
    }
  }

  onClickNext = (event) => {
    event.preventDefault();

    if (!this.canContinue()) return;

    const { settings, setFirstNames, setOffers, prefillDetails, nextPanel } = this.props;
    const { names, offers, prefills } = this.state;

    setFirstNames(names);

    if (settings.showOffers) {
      setOffers(offers);
      this.addOffersToCart();
    }

    if (settings.showPrefill) {
      prefillDetails(prefills);
    }

    nextPanel();
  };

  onClickEdit = () => {
    const { participants, editPanel, settings } = this.props;

    if (settings.showOffers) {
      this.removeOffersFromCart();
    }

    // Update our component state with the names from the store.
    this.setState({
      names: participants.map(participant => participant.customer.firstName),
    });

    editPanel();
  };

  reset() {
    const { resetFirstNames, resetOffers, settings } = this.props;

    if (settings.showOffers) {
      resetOffers();
      this.removeOffersFromCart();
    }

    resetFirstNames();

    this.setState({ names: [], offers: [], prefills: [] });
  }

  addOffersToCart() {
    this.state.offers.forEach((offer, index) =>
      this.props.addToCart({
        offerId: offer.offerId,
        price: offer.price,
        type: 'event',
        panel: 'OffersPanel',
        options: { participantIndex: index },
      })
    );
  }

  removeOffersFromCart() {
    this.props.removeItemsWithPanel('OffersPanel');
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
      <PanelContainer layout={layout} status="edit" className="offers-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          intlId="offersPanel.editTitle"
        />

        <PanelBody layout={layout} status="edit">
          
          {this.renderDescription()}

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

  renderDescription() {
    return null;
  }

  renderRows() {
    const { participants, settings } = this.props;
    
    return participants.map((participant, index) =>
      <Row key={index} className="row-participant">
        <Col xs={12} xl={3}>
          <div className="participant-type">
            <span className="circle">{index + 1}</span>
            <FormattedMessage id={`offersPanel.${participant.type}.title`} tagName="h4" />
          </div>
        </Col>

        {settings.showOffers &&
          <Col xs={12} xl={6}>
            <Row>
              {this.renderOffers(index)}
            </Row>
          </Col>
        }

        <Col xs={12} xl={3}>
          {settings.showPrefill
            ? this.renderPrefillOptions(index)
            : this.renderNameInput(index)
          }
        </Col>
      </Row>
    );
  }

  renderPrefillOptions(index) {
    const selectedOption = this.state.prefills[index];
    const options = this.getPrefillOptions(index);

    // Auto-select 'other' if it's the only option.
    if (!selectedOption && options.length === 1 && options[0].value === 'other') {
      this.onSelectPrefill(index, 'other');
    }

    const onChange = event => this.onSelectPrefill(index, event.target.value);

    return (
      <React.Fragment>
        <Form.Group controlId={`prefill-options-${index}`}>
          <Form.Label>
            <FormattedMessage id="offersPanel.prefillPrompt" />
          </Form.Label>
          <Form.Control as="select" onChange={onChange} value={selectedOption}>
            <option hidden>Select</option>
            {options.map(option =>
              <option key={option.value} value={option.value}>{option.label}</option>
            )}
          </Form.Control>
        </Form.Group>

        {selectedOption === 'other' &&
          this.renderNameInput(index)
        }
      </React.Fragment>
    );
  }

  renderNameInput(index) {
    return (
      <Form.Group>
        <Form.Label>
          <FormattedMessage id="label.customer.firstName" />
        </Form.Label>

        <Form.Control
          value={this.state.names[index] || ''}
          onChange={event => this.onChangeName(index, event.target.value)}
        />
      </Form.Group>
    );
  }

  renderOffers(index) {
    const { offers } = this.props;
    const selectedOffer = this.state.offers[index];

    return offers[index].map(offer => 
      <Col sm={4} xl={3} key={offer.offerId}>
        <OfferButton
          offer={offer}
          isSelected={offer === selectedOffer}
          onClick={() => this.onSelectOffer(index, offer)}
        />
      </Col>
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
                <span>{index + 1}. {participant.customer.firstName}</span>
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
    const { participants, previousParticipants, offers, event } = this.props;

    const options = [];

    if (participants[index].type !== 'child') {
      this.maybeAddOption(options, index, 'yourself', 'Yourself');
    }

    const offer = offers[index][0];
    const eventDate = new Date(offer.ageCalculationDate || event.startDate);

    previousParticipants.forEach(participant => {      
      // Only add previous participants who are within the age range.
      const { dateOfBirthYear, dateOfBirthMonth, dateOfBirthDay } = participant;
      const dob = new Date(Number(dateOfBirthYear), Number(dateOfBirthMonth) - 1, Number(dateOfBirthDay));

      let isOverMinAge  = this.isOverMinAge(offer.minAgeOver, dob, eventDate);
      let isUnderMaxAge = this.isUnderMaxAge(offer.maxAgeUnder, dob, eventDate);

      if (isOverMinAge && isUnderMaxAge) {
        const name = `${participant.firstName} ${participant.lastName}`;
        this.maybeAddOption(options, index, participant.id, name);
      }
    });

    options.push({ value: 'other', label: 'Other' });

    return options;
  }

  isOverMinAge(minAge, dob, eventDate) {
    if (minAge === undefined || minAge === '') return true;

    const turnsMinAge = new Date(dob.getFullYear() + minAge, dob.getMonth(), dob.getDate());
    return turnsMinAge < eventDate;
  }

  isUnderMaxAge(maxAge, dob, eventDate) {
    if (maxAge === undefined || maxAge === '') return true;

    const turnsMaxAge = new Date(dob.getFullYear() + maxAge, dob.getMonth(), dob.getDate());
    return turnsMaxAge > eventDate;
  }

  // Add an option if it hasn't already been selected by another partcipant.
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

const OfferButton = ({ offer, isSelected, onClick }) => {
  const className = isSelected ? 'selected' : '';

  return (
    <Button onClick={onClick} className={className} variant="offer">
      <span className="offer-name">{offer.shortDescription}</span>
      <span className="offer-price">{currency(offer.price)}</span>
    </Button>
  );
};
