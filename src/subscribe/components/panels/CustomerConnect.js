import { getFormData, getErrors, getStatus } from 'shared/selectors';
import { setErrors } from 'form/actions';
import { subscribe } from 'subscribe/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getStatus(state) !== 'ready',
      formData: getFormData(state),
      errors: getErrors(state),
    };
  };

  static actions = {
    onSubmit: subscribe,
    setErrors: setErrors,
  };
}
