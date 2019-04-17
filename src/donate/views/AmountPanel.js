import React from 'react';
import { Card } from 'react-bootstrap';
import { statuses } from '../../shared/actions';
import { StepIndicator, FrequencySelect, SuggestedAmount, VariableAmount } from '../components';
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
      const { offerId, offerPaymentId } = this._getOffer(frequency);
      addSaleLine({ offerId, offerPaymentId, amount });
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
    const offer = this._getOffer(this.props.frequency);

    return (
      <Card className="text-center">
        <Card.Header>
          <StepIndicator currentStep="amount" />
        </Card.Header>

        <Card.Body>
          <ErrorMessages />

          <FrequencySelect />

          <div className="mt-3 text-left" data-testid="suggested-amounts">
            {offer.suggestedAmounts.map(this.renderSuggestedAmount)}
          </div>
        </Card.Body>

        <Card.Footer>
          <SubmitButton block title="Next" testId="next-button" />
        </Card.Footer>
      </Card>
    );
  }

  renderSuggestedAmount = suggestedAmount => {
    const { selections, frequency, selectAmount } = this.props;
    const currentSelection = selections[frequency];

    if (suggestedAmount.variable) {
      return (
        <VariableAmount
          key="variable"
          data={suggestedAmount}
          amountChange={amount => selectAmount(frequency, amount, true)}
          isSelected={currentSelection.isVariableAmount}
          value={currentSelection.variableAmount || ''}
        />
      );
    }

    const isSelected = !currentSelection.isVariableAmount && currentSelection.amount === suggestedAmount.amount;
    return (
      <SuggestedAmount
        key={suggestedAmount.amount}
        data={suggestedAmount}
        selectAmount={amount => selectAmount(frequency, amount)}
        isSelected={isSelected}
      />
    );
  };

  _getOffer = frequency => {
    return this.props.donationOffers.find(offer => offer.frequency === frequency);
  };
}

export default connectAmountPanel(AmountPanel);
