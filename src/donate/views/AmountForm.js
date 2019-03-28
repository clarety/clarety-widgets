import React from 'react';
import { Card, Button } from 'react-bootstrap';
import FrequencySelect from '../components/FrequencySelect';
import DonationOption from '../components/DonationOption';
import DonationInput from '../components/DonationInput';
import singleOptions from '../mock-data/single-options';
import recurringOptions from '../mock-data/recurring-options';

class AmountForm extends React.Component {
  state = {
    singleIndex: null,
    recurringIndex: null,
    frequency: 'single',
    amount: 0,
  };

  selectFrequency = frequency => this.setState({ frequency });
  selectSingleAmount = (singleIndex, amount) => this.setState({ singleIndex, amount });
  selectRecurringAmount = (recurringIndex, amount) => this.setState({ recurringIndex, amount });

  render() {
    return (
      <Card className="text-center">
        <Card.Header>Choose Amount</Card.Header>

        <Card.Body>
          <FrequencySelect
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
    const DonationComponent = option.amount ? DonationOption : DonationInput;
    const selectAmount = this._getSelectAmountHandler();
    const selectedIndex = this._getSelectedIndex();

    return (
      <DonationComponent
        data={option}
        selectAmount={amount => selectAmount(index, amount)}
        isSelected={selectedIndex === index}
      />
    );
  }

  _getOptions = () => (this.state.frequency === 'single' ? singleOptions : recurringOptions);

  _getSelectAmountHandler = () => (this.state.frequency === 'single' ? this.selectSingleAmount : this.selectRecurringAmount);

  _getSelectedIndex = () => (this.state.frequency === 'single' ? this.state.singleIndex : this.state.recurringIndex);
}

export default AmountForm;
