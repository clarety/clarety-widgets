import { submitPaymentPanel } from 'donate/actions';
import { getSetting } from 'shared/selectors';
import { getIsBusy, getSelectedFrequency, getSelectedAmount } from 'donate/selectors';

export class PaymentConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      amount: getSelectedAmount(state),
      frequency: getSelectedFrequency(state),
      formData: state.formData,
      errors: state.errors,
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onSubmit: submitPaymentPanel,
  };
}
