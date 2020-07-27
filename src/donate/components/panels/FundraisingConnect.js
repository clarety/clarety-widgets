import { getSetting } from 'shared/selectors';
import { getErrors, getFormData } from 'form/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy, getSelectedFrequency, getDonationPanelSelection } from 'donate/selectors';

export class FundraisingConnect {
  static mapStateToProps = (state) => {
    const selection = getDonationPanelSelection(state);

    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),

      amount: selection.amount,
      frequency: getSelectedFrequency(state),
    };
  };

  static actions = {
    onSubmit: () => async () => true,
    setErrors: setErrors,
  };
}
