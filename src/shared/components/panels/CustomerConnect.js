import { getFormData, getErrors, getIsBusy } from 'shared/selectors';
import { setErrors } from 'form/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
    };
  };

  static actions = {
    onSubmit: () => async () => true,
    setErrors: setErrors,
  };
}
