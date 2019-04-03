import React from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import FrequencySelect from '../components/FrequencySelect';
import SuggestedAmount from '../components/SuggestedAmount';
import VariableAmount from '../components/VariableAmount';
import ErrorMessages from '../../form/components/ErrorMessages';
import SubmitButton from '../../form/components/SubmitButton';
import { selectFrequency, selectAmount } from '../actions';
import { setStatus, statuses, updateFormData } from '../../form/actions';
import { addToSale, clearSale } from '../../shared/actions';

class AmountPanel extends React.Component {
  componentWillMount() {
    this.props.clearSale();
  }

  onSubmit = async event => {
    const { status, setStatus } = this.props;
    const { selections, frequency, history } = this.props;
    const { updateFormData, addToSale } = this.props;

    event.preventDefault();
    if (status !== statuses.ready) return;
    setStatus(statuses.busy);
    
    const offer = this._getOffer(frequency);

    addToSale({
      offerId: offer.offerId,
      offerPaymentId: offer.offerPaymentId,
      amount: selections[frequency].amount,
      qty: 1,
    });

    updateFormData('saleLine.offerId', offer.offerId);
    updateFormData('saleLine.offerPaymentId', offer.offerPaymentId);
    updateFormData('saleLine.amount', selections[frequency].amount);

    history.push('/details');

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
  }

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

  updateFormData: updateFormData,
  addToSale: addToSale,
  clearSale: clearSale,

  selectFrequency: selectFrequency,
  selectAmount: selectAmount,
};

export default connect(mapStateToProps, actions)(AmountPanel);
