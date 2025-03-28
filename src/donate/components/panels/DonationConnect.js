import { getSetting, getCurrency } from 'shared/selectors';
import { removeItemsWithType } from 'shared/actions';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors } from 'form/actions';
import { getSelectedAmount, getGivingTypeOptions, getIsRgUpsellEnabled } from 'donate/selectors';
import { selectAmount, selectSchedule, addDonationToCart, resetRgUpsell } from 'donate/actions';
import { maybeShowRgUpsell } from 'donate/actions/rg-upsell-maybe-show-action';

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
      upsellEnabled: getIsRgUpsellEnabled(state),
    };
  };

  static actions = {
    selectAmount: selectAmount,
    selectSchedule: selectSchedule,
    onSubmit: addDonationToCart,
    removeAllDonationsFromCart: () => removeItemsWithType('donation'),
    setErrors: setErrors,
    maybeShowRgUpsell: maybeShowRgUpsell,
    resetRgUpsell: resetRgUpsell,
  };
}
