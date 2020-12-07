import { getFormData, getErrors, getSetting } from 'shared/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy } from 'donate/selectors';
import { createLead } from 'lead-gen/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onSubmit: createLead,
    setErrors: setErrors,
  };
}
