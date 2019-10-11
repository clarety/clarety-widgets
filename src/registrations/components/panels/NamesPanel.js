import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { currency } from 'shared/utils';
import { BasePanel } from 'registrations/components';
import { setFirstNames, resetFirstNames } from 'registrations/actions';
import { getParticipants, getParticipantsOffers } from 'registrations/selectors';

class _NamesPanel extends BasePanel {
  state = {
    names: [],
    offers: [],
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

  onClickNext = event => {
    event.preventDefault();

    if (!this.canContinue()) return;

    const { setFirstNames, nextPanel } = this.props;
    setFirstNames(this.state.names);
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

  componentDidUpdate(prevProps) {
    if (this.props.participants.length !== prevProps.participants.length) {
      this.setState({ names: [] });
    }
  }

  reset() {
    this.props.resetFirstNames();
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
    const { participants, offers } = this.props;
    const { names } = this.state;

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

        <Col>
          {offers[index].map(offer =>
            <OfferButton
              key={offer.offerId}
              offer={offer}
              onClick={() => this.onClickOffer(index, offer)}
            />
          )}
        </Col>

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
      </Row>
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
    const { participants } = this.props;
    const { names } = this.state;

    if (names.length !== participants.length) return false;

    for (let name of names) {
      if (!name.trim()) return false;
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
};

export const NamesPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_NamesPanel);

const OfferButton = ({ offer, onClick }) => {
  // TODO: move to stylesheet.
  const style = { width: '120px', margin: '10px' };

  return (
    <Button onClick={onClick} style={style}>
      {offer.name} ({currency(Number(offer.amount))})
    </Button>
  );
};
