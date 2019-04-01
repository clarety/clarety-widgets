import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import FrequencySelect from '../components/FrequencySelect';
import SuggestedDonation from '../components/SuggestedDonation';
import DonationInput from '../components/DonationInput';

class AmountPanel extends React.Component {
  state = {
    frequency: 'single',
    amount: 0,
    singleIndex: -1,
    recurringIndex: -1,
  };

  selectFrequency = frequency => this.setState({ frequency });
  selectSingleAmount = (singleIndex, amount) => this.setState({ singleIndex, amount });
  selectRecurringAmount = (recurringIndex, amount) => this.setState({ recurringIndex, amount });

  componentDidMount() {
    const { single, recurring } = this.props.suggestedDonations;
    this._selectDefaultAmount(single.amounts, this.selectSingleAmount);
    this._selectDefaultAmount(recurring.amounts, this.selectRecurringAmount);
  }

  render() {
    // TODO: get from init.
    const options = [
      { value: 'single', label: 'One-Time' },
      { value: 'monthly', label: 'Monthly' },
    ];

    return (
      <Card className="text-center">
        <Card.Header>Choose Amount</Card.Header>

        <Card.Body>
          <FrequencySelect
          options={options}
            value={this.state.frequency}
            onChange={this.selectFrequency}
          />

          <div className="mt-3 text-left">
            {this._getOptions().map(this.renderDonationOption)}
          </div>
        </Card.Body>

        <Card.Footer>
          <Button block>Next</Button>
        </Card.Footer>
      </Card>
    );
  }

  renderDonationOption = (option, index) => {
    const DonationComponent = option.amount ? SuggestedDonation : DonationInput;
    const selectAmount = this._getSelectAmountHandler();
    const selectedIndex = this._getSelectedIndex();

    return (
      <DonationComponent
        key={index}
        data={option}
        selectAmount={amount => selectAmount(index, amount)}
        isSelected={selectedIndex === index}
      />
    );
  }

  _getOptions = () => {
    const { single, recurring } = this.props.suggestedDonations;
    return this.state.frequency === 'single' ? single.amounts : recurring.amounts;
  };

  _getSelectAmountHandler = () => (this.state.frequency === 'single' ? this.selectSingleAmount : this.selectRecurringAmount);

  _getSelectedIndex = () => (this.state.frequency === 'single' ? this.state.singleIndex : this.state.recurringIndex);

  _selectDefaultAmount = (options, selectAmount) => {
    const index = options.findIndex(option => option.default);
    selectAmount(index, options[index].amount);
  }
}

const mapStateToProps = state => {
  return {
    suggestedDonations: state.suggestedDonations,
  };
};

export default connect(mapStateToProps)(AmountPanel);
