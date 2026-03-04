import { getFormData, getSetting } from 'shared/selectors';
import { updateFormData, setErrors } from 'form/actions';

export class SelectRecurrenceConnect {
  static mapStateToProps = (state) => {
    return {
      recurringDonations: getSetting(state, 'recurringDonations'),
      customerName: getSetting(state, 'customerName'),
      hasAuthError: getSetting(state, 'hasAuthError'),
      formData: getFormData(state),
    };
  };

  static actions = {
    onSubmit: () => async () => true,
    updateFormData: updateFormData,
    setErrors: setErrors,
  };
}
