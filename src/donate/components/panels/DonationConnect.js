import { getSetting } from 'shared/selectors';
import { clearItems } from 'shared/actions';
import { getErrors } from 'form/selectors';
import { setErrors } from 'form/actions';
import { getSelectedAmount } from 'donate/selectors';
import { selectAmount, submitDonationPanel } from 'donate/actions';

export class DonationConnect {
  static mapStateToProps = (state) => {
    const { donationPanel } = state.panels;
  
    return {
      offers: state.settings.priceHandles,
      frequency: donationPanel.frequency,
      selections: donationPanel.selections,
      selectedAmount: getSelectedAmount(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    selectAmount: selectAmount,
    onSubmit: submitDonationPanel,
    clearItems: clearItems,
    setErrors: setErrors,
  };
}
