import React from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import ClaretyApi from '../../shared/services/clarety-api';
import FrequencySelect from '../components/FrequencySelect';
import SuggestedAmount from '../components/SuggestedAmount';
import VariableAmount from '../components/VariableAmount';
import ErrorMessages from '../../form/components/ErrorMessages';
import SubmitButton from '../../form/components/SubmitButton';
import { selectFrequency, selectAmount } from '../actions';
import { setStatus, statuses, clearErrors, setErrors } from '../../form/actions';
import { addToCart, clearCart } from '../../shared/actions';

class AmountPanel extends React.Component {
  componentWillMount() {
    this.props.clearCart();
  }

  onSubmit = async event => {
    const { status, selections, frequency, history } = this.props;
    const { setStatus, setErrors, clearErrors, addToCart } = this.props;

    event.preventDefault();
    if (status !== statuses.ready) return;
    
    setStatus(statuses.busy);
    clearErrors();

    const offer = this._getOffer(frequency);
    const amount = selections[frequency].amount;

    const saleLine = {
      offerId: offer.offerId,
      offerPaymentId: offer.offerPaymentId,
      qty: 1,
      amount: amount,
    };

    const result = await ClaretyApi.post('donate/choose-amount', 'validate', saleLine);
    if (result) {
      if (result.status === 'error') {
        setErrors(result.validationErrors);
      } else {
        addToCart(saleLine);
        history.push('/details');
      }
    }

    setStatus(statuses.ready);
  }

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

            <div className="mt-3 text-left">
              {offer.suggestedAmounts.map(this.renderSuggestedAmount)}
              {this.renderVariableAmount(offer.variableAmount)}
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
    const isSelected = !currentSelection.isVariableAmount && currentSelection.amount === suggestedAmount.amount;
    
    return (
      <SuggestedAmount
        key={suggestedAmount.amount}
        data={suggestedAmount}
        selectAmount={amount => selectAmount(frequency, amount)}
        isSelected={isSelected}
      />
    );
  }

  renderVariableAmount = (variableAmount) => {
    if (!variableAmount) return null;

    const { selections, frequency, selectAmount } = this.props;
    const currentSelection = selections[frequency];

    return (
      <VariableAmount
        data={variableAmount}
        amountChange={amount => selectAmount(frequency, amount, true)}
        isSelected={currentSelection.isVariableAmount}
        value={currentSelection.variableAmount || ''}
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
  return {
    status: state.status,

    donationOffers: state.donationOffers,

    frequency: state.amountPanel.frequency,
    selections: state.amountPanel.selections,
  };
};

const actions = {
  setStatus: setStatus,

  setErrors: setErrors,
  clearErrors: clearErrors,

  addToCart: addToCart,
  clearCart: clearCart,

  selectFrequency: selectFrequency,
  selectAmount: selectAmount,
};

export default connect(mapStateToProps, actions)(AmountPanel);
