import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import FrequencySelect from '../components/FrequencySelect';
import SuggestedDonation from '../components/SuggestedDonation';
import DonationInput from '../components/DonationInput';

class AmountPanel extends React.Component {
  state = {
    frequency: null,
    selections: {},
  };

  selectFrequency = frequency => this.setState({ frequency });

  selectAmount = (frequency, index, amount, variableAmount = null) => {
    this.setState(prevState => {
      const selections = { ...prevState.selections };
      
      selections[frequency] = selections[frequency] || {};
      selections[frequency].index = index;
      selections[frequency].amount = amount;

      if (variableAmount !== null) {
        selections[frequency].variableAmount = variableAmount;
      }

      return { selections };
    });
  }

  componentWillMount() {
    this._selectDefaultAmounts();
    this.selectFrequency(this.props.suggestedDonations[0].frequency);
  }

  render() {
    return (
      <Card className="text-center">
        <Card.Header>Choose Amount</Card.Header>

        <Card.Body>
          <FrequencySelect
            options={this._getFrequencyOptions()}
            value={this.state.frequency}
            onChange={this.selectFrequency}
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
    const { selections, frequency } = this.state;
    const selection = selections[frequency];

    const selectAmount = amount => this.selectAmount(frequency, index, amount);
    const variableAmountChange = amount => this.selectAmount(frequency, index, amount, amount);

    if (option.amount) {
      return (
        <SuggestedDonation
          key={index}
          data={option}
          selectAmount={selectAmount}
          isSelected={selection.index === index}
        />
      );
    }

    return (
      <DonationInput
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
    const offer = this.props.suggestedDonations.find(offer => offer.frequency === this.state.frequency);
    return offer.amounts;
  };

  _selectDefaultAmounts = () => {
    for (let offer of this.props.suggestedDonations) {
      const index = offer.amounts.findIndex(option => option.default);
      if (index) this.selectAmount(offer.frequency, index, offer.amounts[index].amount);
    }
  };
}

const mapStateToProps = state => {
  return {
    suggestedDonations: state.suggestedDonations,
  };
};

export default connect(mapStateToProps)(AmountPanel);
