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

class AmountPanel extends React.Component {
  componentWillMount() {
    const { selectFrequency, suggestedDonations } = this.props;

    this._selectDefaultAmounts();
    selectFrequency(suggestedDonations[0].frequency);
  }

  onSubmit = async event => {
    const { status, selections, frequency, history } = this.props;
    const { setStatus, setErrors, clearErrors } = this.props;

    event.preventDefault();
    if (status !== statuses.ready) return;
    
    setStatus(statuses.busy);
    clearErrors();

    const offer = this._getOffer(frequency);
    const amount = selections[frequency].amount;

    const lineItem = {
      offerId: offer.offerId,
      offerPaymentId: offer.offerPaymentId,
      qty: 1,
      amount: amount,
    };

    const result = await ClaretyApi.post('donate/choose-amount', 'validate', lineItem);
    if (result) {
      if (result.status === 'error') {
        setErrors(result.validationErrors);
      } else {
        // TODO: Add sale-line to cart.
        history.push('/details');
      }
    }

    setStatus(statuses.ready);
  }

  render() {
    const { frequency, selectFrequency } = this.props;

    if (frequency === null) return null;

    const suggestedAmounts = this._getOffer(frequency).amounts;

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
              {suggestedAmounts.map(this.renderDonationComponent)}
            </div>
          </Card.Body>

          <Card.Footer>
            <SubmitButton block title="Next" />
          </Card.Footer>
        </Card>
      </form>
    );
  }

  renderDonationComponent = (option, index) => {
    const { selections, frequency, selectAmount } = this.props;
    const selection = selections[frequency];

    const selectSuggestedAmount = amount => selectAmount(frequency, index, amount);
    const variableAmountChange = amount => selectAmount(frequency, index, amount, amount);

    if (option.amount) {
      return (
        <SuggestedAmount
          key={index}
          data={option}
          selectAmount={selectSuggestedAmount}
          isSelected={selection.index === index}
        />
      );
    }

    return (
      <VariableAmount
        key={index}
        data={option}
        amountChange={variableAmountChange}
        isSelected={selection.index === index}
        value={selection.variableAmount || ''}
      />
    );
  }

  _getFrequencyOptions = () => {
    return this.props.suggestedDonations.map(offer => ({
      value: offer.frequency,
      label: offer.label,
    }));
  };

  _getOffer = frequency => {
    return this.props.suggestedDonations.find(offer => offer.frequency === frequency);
  };

  _selectDefaultAmounts = () => {
    const { suggestedDonations, selectAmount } = this.props;

    for (let offer of suggestedDonations) {
      const index = offer.amounts.findIndex(option => option.default);
      if (index !== -1) selectAmount(offer.frequency, index, offer.amounts[index].amount);
    }
  };
}

const mapStateToProps = state => {
  return {
    status: state.status,
    suggestedDonations: state.suggestedDonations,
    frequency: state.amountPanel.frequency,
    selections: state.amountPanel.selections,
  };
};

const actions = {
  selectFrequency: selectFrequency,
  selectAmount: selectAmount,
  setStatus: setStatus,
  setErrors: setErrors,
  clearErrors: clearErrors,
};

export default connect(mapStateToProps, actions)(AmountPanel);
