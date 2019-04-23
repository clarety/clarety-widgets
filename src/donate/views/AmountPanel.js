import React from 'react';
import { Card, Form, Col } from 'react-bootstrap';
import { statuses } from '../../shared/actions';
import { StepIndicator, FrequencySelect, SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg } from '../components';
import { SubmitButton, ErrorMessages } from '../../form/components';
import { connectAmountPanel } from '../utils/donate-utils';

export class AmountPanel extends React.Component {
  componentWillMount() {
    this.props.clearSaleLines();
  }

  onSubmit = event => {
    const { status, setStatus, addSaleLine } = this.props;
    const { selections, frequency, history } = this.props;
    const { setErrors, clearErrors } = this.props;

    event.preventDefault();

    if (status !== statuses.ready) return;
    clearErrors();
    setStatus(statuses.busy);

    // Make sure an amount has been selected.
    const { amount } = selections[frequency];
    if (amount) {
      const { offerUid, offerPaymentUid } = this._getOffer(frequency);
      addSaleLine({ offerUid, offerPaymentUid, price: amount });
      history.push('/details');
    } else {
      setErrors([{ message: 'Please select a donation amount.' }]);
    }

    setStatus(statuses.ready);
  };

  render() {
    if (this.props.frequency === null) return null;

    return (
      <form onSubmit={this.onSubmit} data-testid="amount-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { frequency, forceMd } = this.props;

    const offer = this._getOffer(frequency);

    let deckClassName = 'card-deck flex-column mt-3 mx-n3 text-left';
    if (!forceMd) deckClassName += ' flex-lg-row';

    return (
      <Card className="text-center">
        <Card.Header>
          <StepIndicator currentStep="amount" />
        </Card.Header>

        <Card.Body>
          <ErrorMessages />

          <FrequencySelect />

          <div className={deckClassName} data-testid="suggested-amounts">
            {offer.amounts.map(this.renderSuggestedAmount)}
          </div>
        </Card.Body>

        <Card.Footer>
        <Form.Row className="justify-content-center">
            <Col lg={forceMd ? null : 5}>
              <SubmitButton title="Next" block testId="next-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }

  renderSuggestedAmount = suggestedAmount => {
    const { selections, frequency, selectAmount, forceMd } = this.props;
    const currentSelection = selections[frequency];

    if (suggestedAmount.variable) {
      return (
        <React.Fragment key="variable">
          <VariableAmount
            key="variable"
            value={currentSelection.variableAmount || ''}
            amountInfo={suggestedAmount}
            onChange={amount => selectAmount(frequency, amount, true)}
            isSelected={currentSelection.isVariableAmount}
            forceMd={forceMd}
          />
          <VariableAmountLg
            key="variable-lg"
            value={currentSelection.variableAmount || ''}
            amountInfo={suggestedAmount}
            onChange={amount => selectAmount(frequency, amount, true)}
            isSelected={currentSelection.isVariableAmount}
            forceMd={forceMd}
          />
        </React.Fragment>
      );
    }

    const isSelected = !currentSelection.isVariableAmount && currentSelection.amount === suggestedAmount.amount;
    return (
      <React.Fragment key={suggestedAmount.amount}>
        <SuggestedAmount
          key={suggestedAmount.amount}
          amountInfo={suggestedAmount}
          onClick={amount => selectAmount(frequency, amount)}
          isSelected={isSelected}
          forceMd={forceMd}
        />
        <SuggestedAmountLg
          key={`${suggestedAmount.amount}-lg`}
          amountInfo={suggestedAmount}
          onClick={amount => selectAmount(frequency, amount)}
          isSelected={isSelected}
          forceMd={forceMd}
        />
      </React.Fragment>
    );
  };

  _getOffer = frequency => {
    return this.props.offers.find(offer => offer.frequency === frequency);
  };
}

export default connectAmountPanel(AmountPanel);
