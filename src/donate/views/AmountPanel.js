import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import FrequencySelect from '../components/FrequencySelect';
import SuggestedAmount from '../components/SuggestedAmount';
import VariableAmount from '../components/VariableAmount';
import { selectFrequency, selectAmount } from '../actions';

class AmountPanel extends React.Component {
  componentWillMount() {
    const { selectFrequency, suggestedDonations } = this.props;

    this._selectDefaultAmounts();
    selectFrequency(suggestedDonations[0].frequency);
  }

  render() {
    const { frequency, selectFrequency } = this.props;

    if (frequency === null) return null;

    return (
      <Card className="text-center">
        <Card.Header>Choose Amount</Card.Header>

        <Card.Body>
          <FrequencySelect
            options={this._getFrequencyOptions()}
            value={frequency}
            onChange={selectFrequency}
          />

          <div className="mt-3 text-left">
            {this._getAmounts().map(this.renderDonationComponent)}
          </div>
        </Card.Body>

        <Card.Footer>
          <Button block>Next</Button>
        </Card.Footer>
      </Card>
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

  _getAmounts = () => {
    const { suggestedDonations, frequency } = this.props;

    const offer = suggestedDonations.find(offer => offer.frequency === frequency);
    return offer.amounts;
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
    suggestedDonations: state.suggestedDonations,
    frequency: state.amountPanel.frequency,
    selections: state.amountPanel.selections,
  };
};

const actions = {
  selectFrequency: selectFrequency,
  selectAmount: selectAmount,
};

export default connect(mapStateToProps, actions)(AmountPanel);
