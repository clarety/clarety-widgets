import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { currency } from 'shared/utils';
import { BasePanel } from 'registrations/components';
import { setFirstNames, resetFirstNames, setOffers, resetOffers } from 'registrations/actions';
import { getParticipants, getParticipantsOffers } from 'registrations/selectors';

class _NamesPanel extends BasePanel {
  state = {
    names: [],
    offers: [],
    prefills: [],
  };  

  onChangeName = (index, name) => {
    this.setState(prevState => {
      const names = [...prevState.names];
      names[index] = name;
      return { names };
    });
  };

  onClickOffer = (index, offer) => {
    this.setState(prevState => {
      const offers = [...prevState.offers];
      offers[index] = offer;
      return { offers };
    });
  };

  onSelectPrefill = (index, value) => {
    this.setState(prevState => {
      const prefills = [...prevState.prefills];
      prefills[index] = value;
      return { prefills };
    });
  };

  onClickNext = event => {
    event.preventDefault();

    if (!this.canContinue()) return;

    const { setFirstNames, setOffers, nextPanel, settings } = this.props;
    setFirstNames(this.state.names);

    if (settings.showOffers) setOffers(this.state.offers);

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
    return null;
  }

  renderEdit() {
    return (
      <Container>
        <FormattedMessage id="namesPanel.editTitle" tagName="h2" />

        <Form onSubmit={this.onClickNext} className="panel-body panel-body-names">
          {this.renderRows()}

          <div className="text-center mt-5">
            <Button type="submit" disabled={!this.canContinue()}>
              <FormattedMessage id="btn.next" />
            </Button>
          </div>
        </Form>
      </Container>
    );
  }

  renderRows() {
    const { participants, settings } = this.props;
    
    return participants.map((participant, index) =>
      <Row key={index} className="mb-3 align-items-center">
        <Col xs={2}>
          <span className="circle">{index + 1}</span>
        </Col>
        
        <Col>
          <FormattedMessage id={`namesPanel.${participant.type}.title`}>
            {txt => <p className="lead m-0">{txt}</p>}
          </FormattedMessage>
        </Col>

        {settings.showOffers &&
          <Col>
            {this.renderOffers(index)}
          </Col>
        }

        {settings.showPrefill
          ? this.renderPrefillOptions(index)
          : this.renderNameInput(index)
        }
      </Row>
    );
  }

  renderPrefillOptions(index) {
    const value = this.state.prefills[index];
    const options = this.getPrefillOptions(index);
    const onChange = event => this.onSelectPrefill(index, event.target.value);

    return (
      <Col>
        <Form.Group controlId={`prefill-options-${index}`}>
          <Form.Label>
            <FormattedMessage id={`namesPanel.prefillPrompt`} />
          </Form.Label>
          <Form.Control as="select" onChange={onChange} value={value}>
            <option hidden>Select</option>
            {options.map(option =>
              <option key={options.value} value={option.value}>{option.label}</option>
            )}
          </Form.Control>
        </Form.Group>

        {value === 'other' &&
          this.renderNameInput(index)
        }
      </Col>
    );
  }

  getPrefillOptions(index) {
    const { prefills } = this.state;

    const options = [];

    const yourselfIndex = prefills.indexOf('yourself');
    if (yourselfIndex === index || yourselfIndex === -1) {
      options.push({ value: 'yourself', label: 'Yourself' });
    }

    options.push({ value: 'other', label: 'Other' });

    return options;
  }

  renderNameInput(index) {
    const { names } = this.state;

    return (
      <Col>
        <FormattedMessage id={`label.firstName`}>
          {label =>
            <Form.Control
              placeholder={label}
              value={names[index] || ''}
              onChange={event => this.onChangeName(index, event.target.value)}
            />
          }
        </FormattedMessage>
      </Col>
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
        onClick={() => this.onClickOffer(index, offer)}
      />
    );
  }

  renderDone() {
    const { participants } = this.props;

    return (
      <Container>
        <FormattedMessage id="namesPanel.doneTitle" tagName="h4" />

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
      </Container>
    );
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
    offers: getParticipantsOffers(state),
  };
};

const actions = {
  setFirstNames: setFirstNames,
  resetFirstNames: resetFirstNames,
  setOffers: setOffers,
  resetOffers: resetOffers,
};

export const NamesPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_NamesPanel);

const OfferButton = ({ offer, isSelected, onClick }) => {
  const style = { width: '120px', margin: '10px' };
  const variant = isSelected ? 'primary' : 'secondary';

  return (
    <Button onClick={onClick} style={style} variant={variant}>
      {offer.name} ({currency(Number(offer.amount))})
    </Button>
  );
};
