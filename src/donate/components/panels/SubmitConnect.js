import { getSetting } from 'shared/selectors';
import { getFormData } from 'form/selectors';
import { getIsBusy, getDonationAmount, getDonationFrequency } from 'donate/selectors';
import { makePayment } from 'donate/actions';

export class SubmitConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      amount: getDonationAmount(state),
      frequency: getDonationFrequency(state),
      turnstileSiteKey: getSetting(state, 'turnstileSiteKey'),
    };
  };

  static actions = {
    onSubmit: makePayment,
  };
}
