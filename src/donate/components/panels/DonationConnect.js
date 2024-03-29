import { getSetting, getCurrency } from 'shared/selectors';
import { removeItemsWithType } from 'shared/actions';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors } from 'form/actions';
import { getSelectedAmount, getGivingTypeOptions } from 'donate/selectors';
import { selectAmount, selectSchedule, addDonationToCart } from 'donate/actions';

export class DonationConnect {
  static mapStateToProps = (state) => {
    const { donationPanel } = state.panels;
  
    return {
      offers: state.settings.priceHandles,
      frequency: donationPanel.frequency,
      selections: donationPanel.selections,
      selectedAmount: getSelectedAmount(state),
      givingTypeOptions: getGivingTypeOptions(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
      currency: getCurrency(state),
    };
  };

  static actions = {
    selectAmount: selectAmount,
    selectSchedule: selectSchedule,
    onSubmit: addDonationToCart,
    removeAllDonationsFromCart: () => removeItemsWithType('donation'),
    setErrors: setErrors,
  };
}
