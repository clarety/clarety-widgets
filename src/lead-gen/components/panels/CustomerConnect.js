import { getFormData, getErrors } from 'shared/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy } from 'donate/selectors';
import { createLead } from 'lead-gen/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
    };
  };

  static actions = {
    onSubmit: createLead,
    setErrors: setErrors,
  };
}
