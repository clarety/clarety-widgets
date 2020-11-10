import { getSetting } from 'shared/selectors';
import { getErrors, getFormData } from 'form/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy } from 'donate/selectors';

export class FundraisingConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
    };
  };

  static actions = {
    onSubmit: () => async () => true,
    setErrors: setErrors,
  };
}
