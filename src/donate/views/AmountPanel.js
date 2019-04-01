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

  selectAmount = (frequency, index, amount) => {
    this.setState(prevState => {
      const selections = { ...prevState.selections };
      selections[frequency] = { index, amount };
      return { selections };
    });
  }

  componentWillMount() {
    this._selectDefaultAmounts();
    this.selectFrequency(this.props.suggestedDonations[0].frequency);
  }

  render() {
    // TODO: get from init.
    const frequencyOptions = [
      { value: 'single', label: 'One-Time' },
      { value: 'recurring', label: 'Monthly' },
    ];

    const amounts = this._getSuggestedAmounts();

    return (
      <Card className="text-center">
        <Card.Header>Choose Amount</Card.Header>

        <Card.Body>
          <FrequencySelect
            options={frequencyOptions}
            value={this.state.frequency}
            onChange={this.selectFrequency}
          />

          <div className="mt-3 text-left">
            {amounts.map(this.renderDonationComponent)}
          </div>
        </Card.Body>

        <Card.Footer>
          <Button block>Next</Button>
        </Card.Footer>
      </Card>
    );
  }

  renderDonationComponent = (option, index) => {
    const DonationComponent = option.amount ? SuggestedDonation : DonationInput;
    const selectAmount = (amount) => this.selectAmount(this.state.frequency, index, amount);
    const selectedIndex = this.state.selections[this.state.frequency].index;

    return (
      <DonationComponent
        key={index}
        data={option}
        selectAmount={selectAmount}
        isSelected={selectedIndex === index}
      />
    );
  }

  _getSuggestedAmounts = () => {
    const suggestedDonations = this.props.suggestedDonations.find(offer => offer.frequency === this.state.frequency);
    return suggestedDonations.amounts;
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
