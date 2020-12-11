import { getSetting } from 'shared/selectors';
import { clearItems } from 'shared/actions';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors } from 'form/actions';
import { getSelectedAmount, getGivingTypeOptions, getHasExpressPaymentMethods } from 'donate/selectors';
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
      hasExpressPaymentMethods: getHasExpressPaymentMethods(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    selectAmount: selectAmount,
    selectSchedule: selectSchedule,
    onSubmit: addDonationToCart,
    clearItems: clearItems,
    setErrors: setErrors,
  };
}
