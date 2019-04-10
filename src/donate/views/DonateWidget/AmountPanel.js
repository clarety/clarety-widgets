import React from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { statuses } from '../../../shared/actions';
import { FrequencySelect, SuggestedAmount, VariableAmount } from '../../components';
import { SubmitButton, ErrorMessages } from '../../../form/components';
import * as donateActions from '../../actions';
import * as formActions from '../../../form/actions';
import * as sharedActions from '../../../shared/actions';

class AmountPanel extends React.Component {
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
    const { frequency, selectFrequency } = this.props;

    if (frequency === null) return null;

    const offer = this._getOffer(frequency);

    return (
      <form onSubmit={this.onSubmit}>
        <Card className="text-center">
          <Card.Header>Choose Amount</Card.Header>

          <Card.Body>
            <ErrorMessages />

            <FrequencySelect
              options={this._getFrequencyOptions()}
              value={frequency}
              onChange={selectFrequency}
            />

            <div className="mt-3 text-left" data-testid="suggested-amounts">
              {offer.suggestedAmounts.map(this.renderSuggestedAmount)}
            </div>
          </Card.Body>

          <Card.Footer>
            <SubmitButton block title="Next" />
          </Card.Footer>
        </Card>
      </form>
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

  _getFrequencyOptions = () => {
    return this.props.donationOffers.map(offer => ({
      value: offer.frequency,
      label: offer.label,
    }));
  };

  _getOffer = frequency => {
    return this.props.donationOffers.find(offer => offer.frequency === frequency);
  };
}

const mapStateToProps = state => {
  const { amountPanel } = state.panels;

  return {
    status: state.status,

    donationOffers: state.explain.donationOffers,

    frequency: amountPanel.frequency,
    selections: amountPanel.selections,
  };
};

const actions = {
  setStatus: sharedActions.setStatus,
  
  addSaleLine: sharedActions.addSaleLine,
  clearSaleLines: sharedActions.clearSaleLines,

  setErrors: formActions.setErrors,
  clearErrors: formActions.clearErrors,

  selectFrequency: donateActions.selectFrequency,
  selectAmount: donateActions.selectAmount,
};

export default connect(mapStateToProps, actions)(AmountPanel);
