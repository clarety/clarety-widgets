import React from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { connect } from 'react-redux';
import { t } from 'shared/translations';
import { Currency } from 'shared/components';
import { adjustAmount, adjustDonation } from 'donate/actions';
import { getDonationPanelSelection } from 'donate/selectors';

class _CoverFeesCheckbox extends React.Component {
  state = {
    addedAmount: 0,
  };

  onChange = (event) => {
    const { adjustAmount, adjustDonation } = this.props;

    if (event.target.checked) {
      const addedAmount = this.getCoverFeeAmount();
      adjustAmount(addedAmount);
      adjustDonation(addedAmount);
      this.setState({ addedAmount });
    } else {
      const { addedAmount } = this.state;
      adjustAmount(-addedAmount);
      adjustDonation(-addedAmount);
      this.setState({ addedAmount: 0 });
    }
  }

  getCoverFeeAmount() {
    const { calculateFees, donationAmount } = this.props;
    return calculateFees(Number(donationAmount));
  }

  render() {
    const coverAmount = this.state.addedAmount || this.getCoverFeeAmount();

    return (
      <Form.Group controlId="coverFees" className="cover-fees-checkbox">
        <FormCheck>
          <FormCheck.Input
            checked={this.state.addedAmount !== 0}
            onChange={this.onChange}
          />
          <FormCheck.Label>
            {t('give-additional', 'I choose to give an additional')} <Currency amount={coverAmount} /> {t('to-help-cover-costs', 'to help cover the costs and processing fees associated with my donation')}
          </FormCheck.Label>
        </FormCheck>
      </Form.Group>
    );
  }
}

const mapStateToProps = (state) => {
  const selection = getDonationPanelSelection(state);

  return {
    donationAmount: selection.amount,
  };
};

const actions = { adjustAmount, adjustDonation };

export const CoverFeesCheckbox = connect(mapStateToProps, actions)(_CoverFeesCheckbox);
