import { getFormData, getErrors, getIsBusy, getSetting } from 'shared/selectors';
import { setErrors } from 'form/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
      defaultCountry: getSetting(state, 'defaultCountry'),
    };
  };

  static actions = {
    onSubmit: () => async () => true,
    setErrors: setErrors,
  };
}
